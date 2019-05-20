#! /usr/bin/python3 -Wd

import sys
from datetime import datetime
import os
import tarfile
import shutil

app = sys.argv[1]
now = datetime.now()
dt = now.strftime('%Y%m%d%H%M%S');
fdt = now.strftime('%m/%d/%Y %H:%M:%S')

# Relative paths do not play nice. Use absolute.
userFileRoot = '/home/cwis607'
logFilePath = userFileRoot+'/deploy/logs/codeship/'+app+'.log'
newBuildPath = userFileRoot+'/deploy/tmp/codeship-build-'+app+'.tar.gz'  
backupPath = userFileRoot+'/deploy/backups/build-'+app+'-'+dt+'.tar.gz'  

# Web paths to the root of the apps
webroot = userFileRoot+'/public_html'
appPaths = {
        'demo': webroot + '/__dev/demo'
}

if len(sys.argv) != 2:
	print('Error: Must supply a valid app type as the first arg')    
	print('      usage: '+sys.argv[0]+' <appType>')
	sys.exit(-1)

if app not in appPaths:
	print('Error: Invalid app type: '+app)
	print('       Valid Types: [', ', '.join(apps), ']')
	sys.exit(-1)

logFile = open(logFilePath, 'a+')
logFile.write('['+fdt+'] Starting Deployment of `'+app+'`\n')

# Make sure the path to the app exists, if not create it
if not os.path.isdir(appPaths[app]):
	os.mkdirs(appPaths[app])

# Tar the old version and send them to ~/deploy/backups
if len(os.listdir(appPaths[app])) > 2:
	with tarfile.open(backupPath, 'w:gz') as tar:
		tar.add(appPaths[app], arcname=os.path.basename(appPaths[app]))

# Empty the directory to prepare for extraction of new version
# this deletes everything including the root folder
shutil.rmtree(appPaths[app])
os.mkdir(appPaths[app])

# Extract new build to new file location
newBuild = tarfile.open(newBuildPath)
newBuild.extractall(appPaths[app])
newBuild.close()

# Remove new build
os.remove(newBuildPath)

logFile.write('['+fdt+'] Deployment of `'+app+'` successful!\n')
logFile.close()
