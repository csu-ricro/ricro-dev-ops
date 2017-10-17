## Building a RICRO App
This script creates a basic app with the [`ricro-app-template`](https://github.com/dlennox24/ricro-app-template) to use as a starting point. It leverages `create-react-app` for a base app then customizes it based on the template.
### Usage
`build-ricro-app [pathToInstallLocation]`
- [Node.js](https://nodejs.org) and NPM must be installed
- [`create-react-app`](https://github.com/facebookincubator/create-react-app) must be installed globally
- Must use at least PowerShell 5.1
- Install location must be empty or only contain a `.git` folder and/or a `README.md`
- Install location is optional. If one is not specified the install location will be the current directory

**Examples**

`build-ricro-app`

`build-ricro-app foo`

`build-ricro-app .\apps\new-fancy-app`

`cd .\apps\new-fancy-app; build-ricro-app`

### Execute from anywhere
1. Add a new PATH variable to point to the directory where you want to keep your PowerShell files
1. Copy the PowerShell `.ps1` file into that directory
1. Restart the system
