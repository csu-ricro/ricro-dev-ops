$ProjectDirs = dir c:\dev\apps | ?{$_.PSISContainer}
$SourcePath = "c:\dev\dev-ops\ricro-app-template"
$ProdPath = "c:\dev\prod"

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
    $splat = @{
        Path = "$SourcePath\$CopyLocation\*"
        Destination = ".\$CopyLocation\"
        Recurse = $True
    }

    if($Force) {
        $splat += @{Force = $True}
    }

    # Run the copy command
    Copy-Item @splat
    Copy-Item "$SourcePath\public\index.html" -Destination ".\public\" -Force

    # Finally, run our npm command
    npm run build

    # Compress production build
    Compress-Archive -Path "$LocalDir\build\*" -DestinationPath "$ProdPath\$app.zip" -Force

    Write-Host "$app finished rebuild" -BackgroundColor DarkGreen
}
Set-Location $OriginalDir
Write-Host "`n`nPress any key to close..."
$x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
