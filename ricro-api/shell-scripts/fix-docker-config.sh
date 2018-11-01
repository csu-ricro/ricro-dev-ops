#! /bin/bash

headerColor="\033[92m"
resetColor="\033[0;39m"

echo -e $headerColor
echo "##################     ADDING NANO     ##################"
echo -e $resetColor
apt-get update
apt-get update
apt-get install nano -y --fix-missing

echo -e $headerColor
echo "################## FIXING MYSQL CONFIG ##################"
echo -e $resetColor
sqldConfig=/etc/mysql/mysql.conf.d/mysqld.cnf
sed -i 's/^bind-address/# bind-address/' $sqldConfig
echo $sqldConfig
cat $sqldConfig | grep -n bind-address
echo
sqlyMyCnf=/etc/mysql/my.cnf
printf "\n[mysqld_safe]\n[mysqld]\nsecure-file-priv = \"\"\n" >> $sqlMyCnf
cat $sqldConfig

echo -e $headerColor
echo "##################  RESTARTING APACHE  ##################"
echo -e $resetColor
service apache2 restart

echo
