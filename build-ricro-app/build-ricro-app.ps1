$version="v1.1.1"
write-host "build-ricro-app@$($version)`n" -NoNewline -ForegroundColor Green

if($args[0] -eq $Null){
  $path = ".\"
} else {
  $path = $args[0]
}

if(!$([bool](get-command -Name npm -ErrorAction SilentlyContinue))){
  write-host "Command npm not found. Have you installed Node.js?" -ForegroundColor Red
  exit 1
}

while(!$([bool](get-command -Name create-react-app -ErrorAction SilentlyContinue))){
  write-host "create-react-app not found" -ForegroundColor Red
  write-host "Would you like to install it globally? (Y/n) " -NoNewline -ForegroundColor Red
  do {
    $install = $(read-host).ToLower()
  } while($install -ne "y" -and $install -ne "n")

  if($install -eq "n"){
    exit 1
  }
  write-host "`nInstalling create-react-app" -ForegroundColor Green
  npm i create-react-app -g
}

write-host "Checking for create-react-app update`n" -NoNewline -ForegroundColor Green
npm up create-react-app -g

if(!(test-path $path)){
  new-item -ItemType Directory -Force -Path $path | out-null
}

$path = $(Resolve-Path -Path $path)
$pwd = $(pwd)
$buildRicroApp = ".\node_modules\ricro-app-template\src\demo\build-ricro-app"

write-host "`nBuilding app`n" -NoNewline -ForegroundColor Green
create-react-app $path
if($lastExitCode -ne 0){
  exit 1
}

if(test-path $path\README.old.md){
  Move-Item -LiteralPath $path\README.md -Destination $path\README.create-react-app.md
  Move-Item -LiteralPath $path\README.old.md -Destination $path\README.md
}

cd $path
write-host "`nInstalling ricro-app-template" -ForegroundColor Green
npm i ricro-app-template --save

copy-item .\src\registerServiceWorker.js .\registerServiceWorker.js
remove-item .\src\*

copy-item $buildRicroApp\public\* .\public
copy-item $buildRicroApp\src\* .\src

copy-item .\registerServiceWorker.js .\src\registerServiceWorker.js
remove-item .\registerServiceWorker.js

write-host "`nStarting dev environment" -NoNewline -ForegroundColor Green
start npm start
start npm test

cd $pwd
