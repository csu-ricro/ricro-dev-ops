#! /bin/bash

headerColor="\033[92m"
subheaderColor="\033[93m"
resetColor="\033[0;39m"

echo -e $headerColor
echo "################## CHECKING MYSQL CONFIG ##################"
echo -e $resetColor
restart="false"
sqldConfig=/etc/mysql/mysql.conf.d/mysqld.cnf
if ! $(grep -Fq "# bind-address" $sqldConfig) ; then
  echo -e "$subheaderColor" "################## Removing bind-address"
  echo -e $resetColor
  sed -i 's/^bind-address/# bind-address/' $sqldConfig
  echo $sqldConfig
  cat $sqldConfig | grep -n bind-address
  restart="true"
  echo
fi

sqldMyCnf=/etc/mysql/my.cnf
if ! $(grep -Fq "secure-file-priv" $sqldMyCnf) ; then
  echo -e "$subheaderColor" "################## Adding secure-file-piv"
  echo -e $resetColor
  printf "\n[mysqld_safe]\n[mysqld]\nsecure-file-priv = \"\"\n" >> $sqldMyCnf
  cat $sqldMyCnf
  restart="true"
  echo
fi

if [ $restart == "true" ]; then
  echo -e $headerColor
  echo "##################   RESTARTING APACHE   ##################"
  echo -e $resetColor
  service apache2 restart
fi

sqlBuildPath=/var/lib/mysql-files/clean-build.sql
if [ -f $sqlBuildPath ]; then
  echo -e $headerColor
  echo "##################  BUILDING DATABASE  ##################"
  echo -e $resetColor
  mysql --execute="source $sqlBuildPath"
fi

echo
