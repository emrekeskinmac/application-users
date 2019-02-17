## application-users

### Description
User management application with account verification support. Will be updated with new features soon.

### Quick Start Guide

## Installation

```bash
mesg-core service deploy https://github.com/emrekeskinmac/mongodb-service --env DATABASE_NAME="users"
```
```bash
mesg-core service deploy https://github.com/ilgooz/service-http-server
mesg-core service start $id
```
```bash
mesg-core service deploy https://github.com/mesg-foundation/service-email-sendgrid.git
mesg-core service start $id
```

```bash
SENDGRID_APIKEY={SENDGRID_APIKEY} node index.js 
starting => localhost:2300
```


## Example Endpoint
 
#### Create User
```curl
curl -X POST \
  http://localhost:2300/user.create \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@test.com",
    "password": "testing",
	"profile": {"name": "Mesg Core" }    
}'
```


#### Update User
```curl
curl -X POST \
  http://localhost:2300/user.update \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 99cad333-1d2d-402c-b977-5ed585e187ed' \
  -H 'cache-control: no-cache' \
  -d '{
    "email": "test@test.com",
    "password": "testing",
	"profile": {
		"coin": 1000 
	}
}'
```

#### Update User Email
```curl
curl -X POST \
  http://localhost:2300/user.updateEmail \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@test.com",
    "newEmail": "newemail@test.com",
    "password": "testing"
}'
```

#### Create User Password
```curl
curl -X POST \
  http://localhost:2300/user.updatePassword \
  -H 'Content-Type: application/json' \
  -d '{
	"email": "test@test.com",
    "password": "testing",
    "newPassword": "newPassword"
}'
```

#### Create User
```curl
curl -X POST \
  http://localhost:2300/user.create \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@test.com",
    "password": "testing",
	"profile": {"name": "Mesg Core" }    
}'
```

#### User Email Verification
```curl
curl -X POST \
  http://localhost:2300/user.sendEmailVerification \
  -H 'cache-control: no-cache' \
  -d '{
	"email": "test@test.com"
}'
```

#### User Email Verify Update
```curl
curl -X GET \
  'http://localhost:2300/user.verifyEmail?code={verifyCode}' \
  -H 'Content-Type: application/json' \
  -d '{
	"email": "test@test.com"
}'
```


TODO: 
- [] Login   
- [] Logout     
- [] SMS Verify  
