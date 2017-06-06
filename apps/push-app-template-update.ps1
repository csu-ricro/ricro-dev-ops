$ProjectDirs = dir c:\dev\apps | ?{$_.PSISContainer}
$SourcePath = "c:\dev\dev-ops\ricro-app-template"
$ProdPath = "c:\dev\prod"

$build = Read-Host -Prompt "Build? (y)"
if($build.toLower() -eq "y" -or $force -eq ""){
  $build = $True
}else{
  $build = $False
}
$force = Read-Host -Prompt "Force? (y)"
if($force.toLower() -eq "y" -or $force -eq ""){
  $force = $True
}else{
  $force = $False
}

Write-Host "$build $force"

$CopyLocation = "src\csu-app-template"
$OriginalDir = $PWD.Path

foreach ($app in $ProjectDirs) {
    "`n`n"
    Write-Host $app
    $LocalDir = $app.FullName
    Set-Location $app.FullName

    # Check if the location exists and nuke it if it does
    if(Test-Path "$LocalDir\$CopyLocation\") {
        Remove-Item "$LocalDir\$CopyLocation\" -recurse
    }

    # Create location before copy
    New-Item "$LocalDir\$CopyLocation\" -type directory

    # Bundle parameters to copy command, add force if necessary
    $source = @{
        Path = "$SourcePath\$CopyLocation\*"
        Destination = ".\$CopyLocation\"
        Recurse = $True
    }
    $index = @{
        Path = "$SourcePath\public\index.html"
        Destination = ".\public\"
    }
    $favicon = @{
        Path = "$SourcePath\public\favicon.ico"
        Destination = ".\public\"
    }
    $serviceWorker = @{
        Path = "$SourcePath\src\registerServiceWorker.js"
        Destination = ".\src\"
    }

    if($force) {
        $source += @{Force = $True}
        $index += @{Force = $True}
        $favicon += @{Force = $True}
        $serviceWorker += @{Force = $True}
    }

    # Run the copy command
    Copy-Item @source
    Copy-Item @index
    Copy-Item @favicon
    Copy-Item @serviceWorker

    # Finally, run our npm command
    if($build){
      npm run build
      # Compress production build
      Compress-Archive -Path "$LocalDir\build\*" -DestinationPath "$ProdPath\$app.zip" -Force
    }


    Write-Host "$app finished rebuild" -BackgroundColor DarkGreen
}
Set-Location $OriginalDir
Write-Host "`n`nPress any key to close..."
$x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
