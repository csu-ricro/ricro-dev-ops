## Basic Deployment with [Codeship](https://app.codeship.com/csu-ricro)

1. **Create a new project**
    1. Select GitHub for the SCM
    1. Select the correct GitHub Org and Repository
    1. Select Codeship Basic for the project type
1. **Add a pipeline in the Tests tab**
    1. Add the commands to install dependencies and test the code
        ```
        yarn install
        yarn lint
        yarn test
        ```
1. **Configure Your Deployment Branches**
    1. Set Branch Type to `Branch is exactly` and Branch Name to `master`
    1. Add a `Script` deployment
    1. Add the custom deployment commands
        ```
        yarn build
        tar -C build/ -zcvf build.tar.gz .
        scp build.tar.gz cwis607@services.ricro.colostate.edu:~/deploy/tmp/codeship-build-<appName>.tar.gz
        ssh -t cwis607@services.ricro.colostate.edu '~/deploy/scripts/codeship/deploy.py <appName> <webPathToApp>'
        ```
        * Note: `<webPathToApp>` must begin with a `/` and not have a trailing `/`
        * Example: `...ate.edu '~/deploy/scripts/codeship/deploy.py demo /dev/demo'`
    1. Select Create Deployment
1. **Setting up SSH access to the production server**
    1. Retrieve the SSH key from the general section in the Project's settings
    1. Add the whole key to the `~/.ssh/authorized_keys` file on the production server
        * SSH into the server or use the Virtualmin dashboard to modify the ssh file
1. **Push a new commit** to the master branch in GitHub to ensure the deployment is set up successfully 
