## Building a RICRO App
This script creates a basic app with the `ricro-app-template@1.1.0` to use as a starting point. It leverages `create-react-app` for a base app then customizes it based on the template.
### Usage
`build-ricro-app <pathToInstallLocation>`
- Must use PowerShell 5.1
- Install location must be empty or only contain a `.git` folder
- Install location is optional. If one isn't specified the install location will be the current directory

**Examples**

`build-ricro-app.ps1 .\apps\new-fancy-app`

`cd .\apps\new-fancy-app; build-ricro-app.ps1`

### Execute from anywhere
1. Add a new PATH variable to point to the directory where you want to keep your PowerShell files
1. Copy the PowerShell `.ps1` file into that directory
1. Restart the system
