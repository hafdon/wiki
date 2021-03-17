# recursively remove directories modified more than x days ago

`find . -type d -mtime +30 -exec rm -rf {} +`

https://stackoverflow.com/questions/13868821/shell-script-to-delete-directories-older-than-n-days
