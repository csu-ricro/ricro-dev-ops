<?php
// require_once realpath(__DIR__ . "/config.php");
require_once realpath(__DIR__ . "/result.class.php");
class Sql {
  public $conn; // SQL Connection object

  public function __construct($db) {
    // Attempts to connect to a MySQL database
	// Config data for the API
	define('SQL_HOST', "mysql-webhost0.acns.colostate.edu");
	define('SQL_USER', "cwis607");
	define('SQL_PASSWORD', "kuEF0hAV17kOhY4o");
    try {
      // MySQL Connection Information
      // Should not be needed outside of class, even by a child class
      $this->db = $db; // Must be public for query() call
      $pdoOptions = [
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false, // Improves security
        PDO::ATTR_PERSISTENT => true, // Persist connections for faster responses
      ];
      $this->conn = new PDO("mysql:host=" . SQL_HOST . ";dbname=" . $db, SQL_USER, SQL_PASSWORD, $pdoOptions);
      $this->status = new Result([
        "status" => "success",
        "result" => "Successful connected to the database.",
      ]);
    } catch (PDOException $e) {
      error_log("Failed to connect to database: $e");
      echo json_encode(new Result([
        "httpCode" => 500,
        "status" => "error",
        "result" => "Failed to connect to database.",
      ]));
      die;
    }
  }

  public function __destruct() {
    $this->conn = null;
  }

  /**
   * Returns the results of the SELECT if successful
   * If modifying the database (DELETE, UPDATE, INSERT) returns the number of rows affected
   **/
  public function query($queryOptions) {
    $queryOptions = gettype($queryOptions) === "string" ? ["prequery" => $queryOptions] : $queryOptions;
    $queryOptions = gettype($queryOptions) === "array" ? (object)$queryOptions : $queryOptions;
    $prequery = $queryOptions->prequery;
    $data = isset($queryOptions->data) ? $queryOptions->data : null;
    $debug = isset($queryOptions->debug) ? $queryOptions->debug : false;

    header("Content-Type: application/json");

    if ($debug) {
      var_dump($prequery, $data);
    }

    // $data objects must be stored in an array, even if it's only one element
    if ($data != NULL && gettype($data) !== "array") {
      $data = [$data];
    }

    $type = trim(preg_replace(
      '/\s{2,}/',
      ' ',
      strtoupper(explode(" ", str_replace(["\n", "\t", "\r"], ' ', $prequery))[0])
    ));

    if ($debug) {
      var_dump($type);
    }

    if (!$sth = $this->conn->prepare($prequery)) {
      return new Result([
        "httpCode" => 500,
        "status" => "error",
        "result" => "Failed to prepare query",
      ]);
    }

    if ($data !== NULL) {
      $sth->execute($data);
    } else {
      $sth->execute();
    }

    if ($debug) {
      echo "<pre>";
      $sth->debugDumpParams();
      echo "</pre>";
      var_dump($sth->errorInfo());
      var_dump($sth->rowCount());
    }

    if ($sth->errorInfo()[0] !== '00000') {
      return new Result([
        "httpCode" => 500,
        "status" => "error",
        "result" => $sth->errorInfo()[2],
      ]);
    }

    if ($type === "SELECT") {
      $data = $sth->fetchAll();
      // $data = $sth->fetch(PDO::FETCH_ASSOC);

      if ($debug) {
        var_dump($data);
      }

      if (count($data) > 0) {
        return new Result([
          "status" => "success",
          "result" => $data,
        ]);
      }
      return new Result([
        "status" => "nodata",
        "result" => $data,
      ]);
    } elseif ($type === "DESCRIBE") {
      return $sth->fetchAll();
    } else {
      $s = $sth->rowCount() > 1 ? "s" : "";
      if ($sth->rowCount() > 0) {
        return new Result([
          "status" => "success",
          "result" => $sth->rowCount() . " row$s modified",
        ]);
      } else {
        return new Result([
          "status" => "nochange",
          "result" => $sth->rowCount() . " row$s modified",
        ]);
      }
    }
  }

  /**
   * Gets the column names of the MySQL table
   * @param string $tableName
   * @return array
   **/
  public function getColumnNames($tableName) {
    $cols = [];
    $result = $this->query([
      "prequery" => "SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`='"
      . $this->db . "' AND `TABLE_NAME`=?",
      "data" => array($tableName),
    ]);

    if ($result->status === "success") {
      $sqlCols = $result->result;
      foreach ($sqlCols as $col) {
        array_push($cols, $col["COLUMN_NAME"]);
      }
    }
    return $cols;
  }

  /**
   * Add MySQL LIKE, ORDER BY, and LIMIT clauses to the query string
   * @param string &$queryString Reference to the existing query string
   * @param array &$args Reference to the args
   **/
  public function addSortFilterLimitQuery(&$queryString, &$args) {
    $sortFilterLimitArgs = [];
    if (isset($args["search"])) {
      $searchFields = "";
      foreach ($args["searchFields"] as $field) {
        if ($searchFields !== "") {
          $searchFields .= " OR ";
        }
        // must use CONCAT so prepared statement doesn't get quotes injected into the wildcard
        $searchFields .= "$field LIKE CONCAT('%', ?, '%')";
        array_push($sortFilterLimitArgs, $args["search"]);
      }
      $queryString .= " WHERE $searchFields";
    }

    if (isset($args["sortBy"]) && isset($args["sortDir"])) {
      $queryString .= " ORDER BY " . $args["sortBy"] . " " . ($args["sortDir"] === "asc" ? "asc" : "desc");
    }

    if (isset($args["limit"])) {
      $queryString .= " LIMIT ?";
      array_push($sortFilterLimitArgs, $args["limit"]);
    }
    $args["sortFilterLimitArgs"] = $sortFilterLimitArgs;
  }
}
?>
