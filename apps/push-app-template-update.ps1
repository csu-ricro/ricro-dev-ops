$ProjectDirs = dir c:\dev\sandbox\apps | ?{$_.PSISContainer}
$SourcePath = "c:\dev\sandbox\ricro-app-template\src\csu-app-template"
$ProdPath = "c:\dev\sandbox\prod"

$CopyLocation = "src\csu-app-template"
$OriginalDir = $PWD.Path

foreach ($app in $ProjectDirs) {
    " "
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
        Path = "$SourcePath\*"
        Destination = ".\$CopyLocation\"
        Recurse = $True
    }

    if($Force) {
        $splat += @{Force = $True}
    }

    # Run the copy command
    Copy-Item @splat

    # Finally, run our npm command
    npm run build

    # Compress production build
    Compress-Archive -Path "$LocalDir\build\*" -DestinationPath "$ProdPath\$app.zip" -Force

    Write-Host $app finished rebuild -BackgroundColor DarkGreen
}
Set-Location $OriginalDir
