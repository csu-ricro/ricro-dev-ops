# Developing ricro-api with Docker Containers

Clone this section of the repo to ensure the file struture is correct.

## Building the Container from the Image

This image is from Matt Rayner's simple LAMP image: [mattrayner/docker-lamp](https://github.com/mattrayner/docker-lamp). Run the following command in PowerShell after the Docker service is running.

```powershell
docker run --name lamp -p "80:80" -p "3306:3306" -v ${PWD}/api:/app -v ${PWD}/mysql:/var/lib/mysql -v ${PWD}/api/test/mysql/:/var/lib/mysql-files -v ${PWD}/shell-scripts:/tmp mattrayner/lamp:latest-1604-php7
```

Once the script outputs that the apache2 and mysqld processes are running, hit `ctrl`+`c` to gain the terminal back. The container is now up and running.

```
2018-11-02 19:48:47,695 INFO success: mysqld entered RUNNING state, process has stayed up for > than 1 seconds (startsecs)
2018-11-02 19:48:47,695 INFO success: apache2 entered RUNNING state, process has stayed up for > than 1 seconds (startsecs)
```

### What it does

| Flag | Description |
| ---- | ----------- |
| `--name lamp` | Names the Docker container for easy CLI usage. (eg `docker start lamp`) |
| `-p "80:80"` | Port for the Apache web server
| `-p "3306:3306"` | Port for the MySQL server
| `-v ${PWD}/api:/app` | Links the `api` directory in the current working directory (`${PWD}`) to the `/app` directory in the Docker container. This is where the [`ricro-api`](https://github.com/dlennox24/ricro-api) files go. |
| `-v ${PWD}/mysql:/var/lib/mysql` | Preserves the data from MySQL in the Docker container. If not set data in the database will be lost on image stop, crash, or restart. |
| `-v ${PWD}/api/test/mysql:/var/lib/mysql-files` | Links SQL scripts directory to the Docker container. This allows for running of the SQL scripts in either MySQL Workbench or via the Docker container's CLI. |
| `-v ${PWD}/shell-scripts:/tmp` | Links shell scripts directory to the Docker container. This allows for running of the shell scripts from within the Docker container's CLI |
| `mattrayner/lamp:latest-1604-php7` | Docker file to install. More distributions available in [Matt Rayner's GitHub repo](https://github.com/mattrayner/docker-lamp). |

## Accessing the Linux CLI in the Docker Container

To access the CLI from PowerShell run the command below within PowerShell after the Docker container is running. This will give you root access within the Linux CLI. Make sure the container is running (`docker ps`). If it's not use `docker start lamp`.

```powershell
docker exec -it lamp "/bin/bash"
```


## Updating Config Files

Run the `/tmp/fix-docker-config.sh` from within the Linux CLI in the Docker container to tweak some of the config files within the Docker container.

**NOTE:** to automatically build the schema for the test database copy all data from `ricro-api` into the `${PWD}/api` directory.

### What it does

1. Tweaks some MySQL config files.
    1. Comments out the `bind-address` as it causes an issue with connecting to the server via external programs in Windows (e.g. MySQL Workbench).
    1. Sets `secure-file-priv = ""` to allow for injection of data into the MySQL database from csv files.
1. Restarts the `apache2` service to apply the above changes.

## Common Errors

### Ports already in use

Sometimes when the system is shutdown or the Docker service is terminated, an error about the container being unable to connect to the ports because there is already something running on them occurs. This appears to be an issue with the service not cleaning up the ports on shutdown. The best way to solve this appears to be to restart the entire Docker service.
