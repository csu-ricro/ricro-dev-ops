<?php

// Migrates the requests' approvals in V1 data to a separate table for V2 compatibility

require_once realpath(__DIR__ . "/sql.class.php");

$v1Sql = new Sql('ricro-apps');
$v2Sql = new Sql('ricro-apps-v2');

$columns = [
	["old"=>"animals", "new"=>"iacuc-animals"],
	["old"=>"dataRestrictions", "new"=>"xc-dataRestrictions"],
	["old"=>"exemptRDna", "new"=>"ibc-exemptRdna"],
	["old"=>"human", "new"=>"irb-humans"],
	["old"=>"humanTissueFluids", "new"=>"ibc-humanTissue"],
	["old"=>"infectiousAgents", "new"=>"ibc-infectiousAgents"],
	["old"=>"nonExemptRDna", "new"=>"ibc-nonExemptRdna"],
	["old"=>"qa", "new"=>"qa"]
];

foreach($columns as $column) {
	$oldData = $v1Sql->query("SELECT requestId from `".$v1Sql->db."`.`protocolStatus-requests` where ".$column["old"]." = 1");
	if($oldData->status === "success"){
    	var_dump("Migrated `".$column["old"]."` to `".$column["new"]."` successfully");
    	foreach($oldData->result as $data) {
        	$newData = $v2Sql->query([
        		"prequery"=>"INSERT INTO `".$v2Sql->db."`.`protocolStatus-approvals` (`requestId`, `approval`) VALUES (?, ?)",
        		"data"=>[$data["requestId"], $column["new"]],
        	]);
        	if($newData->status !== "success") {
            	var_dump("error: `".$column["old"]."` --> `".$column["new"]."`");
            	var_dump([$data, $newData]);
            }
        }
    } else {
    	var_dump("Failed to migrate `".$column["old"]."` to `".$column["new"]."`");
    	var_dump($oldData);
    }
}

// var_dump($v1Sql->getColumnNames("protocolStatus-requests"));
// var_dump($v2Sql->getColumnNames("protocolStatus-requests"));
?>
