After cloning this repository, you will need to create a file name server/config/dbconnect.js and add the connection parameters for your MySQL database:

For local database:

```
module.exports = {
dbconnect: {
host: "localhost",
user: "youruser",
password: "yourpassword",
database: "yourdatabase",
},
};
```

For AWS:

```
module.exports = {
dbconnect: {
host: process.env.RDS_HOSTNAME,
user: process.env.RDS_USERNAME,
password: process.env.RDS_PASSWORD,
port: process.env.RDS_PORT,
database: "ebdb", // replace ebdb with name of your AWS RDS Instance
},
};
```

https://git-codecommit.us-east-2.amazonaws.com/v1/repos/wegrowapp

/etc/nginx/conf.d/websocketupgrade.conf:
mode: "000755"
owner: root
group: root
content: |
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
