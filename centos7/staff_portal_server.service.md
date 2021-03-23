add scripts you want available to all users in 
` /etc/profile.d/` 

and to source it ?
` source /etc/profile.d `

when changing `/etc/systemd/system` services:  

```bash
Warning: staff_portal_server.service changed on disk. Run 'systemctl daemon-reload' to reload units.
```

show the backing files for a service:
```bash
$ systemctl cat staff_portal_server.service
# /etc/systemd/system/staff_portal_server.service

[Unit]
Description=Staff-Portal RESTful API server
After=network.target
 
[Service]

User=collspec
Group=collspec

ExecStart=/bin/bash /home/collspec/bin/sprint_server_up.sh
Restart=on-failure

# Give a reasonable amount of time for the server to start up/shut down
TimeoutSec=300

[Install]
WantedBy=multi-user.target
```
