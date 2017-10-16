if($args[0] -eq $Null){
  $path = $(Resolve-Path -Path .)
} else {
  $path = $(Resolve-Path -Path $args[0])
}

$pwd = $(pwd)
$buildRicroApp = ".\node_modules\ricro-app-template\src\demo\build-ricro-app"

create-react-app $path
if($lastExitCode -ne 0){
  exit 1
}

cd $path
Write-Host "`nInstalling ricro-app-template" -ForegroundColor Green
npm i ricro-app-template --save

Copy-Item .\src\registerServiceWorker.js .\registerServiceWorker.js
Remove-Item .\src\*

Copy-Item $buildRicroApp\public\* .\public
Copy-Item $buildRicroApp\src\* .\src

Copy-Item .\registerServiceWorker.js .\src\registerServiceWorker.js
Remove-Item .\registerServiceWorker.js

Write-Host "`nStarting dev server" -ForegroundColor Green
start npm start

cd $pwd
