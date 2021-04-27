https://dba.stackexchange.com/questions/196931/how-to-restart-postgresql-server-under-centos-7

`/bin/systemctl restart postgresql-11.service` works if scooter reboots for some reason. i think the service is still tied to -10 which doesn't have a service file anymore.
