# CardFunc CLI
Command line interface for CardFunc.

# Installing
Install using NPM in the global scope:
```
npm install -g @cardfunc/cli
```

# Usage
Assuming that the `cardfunc` command is installed in your path as done above.
## Version
To learn which version you have installed use:
```
cardfunc version
```
## Help 
### List Modules
To get an index of all help commands:
```
cardfunc help
```
### Module Help
Help for a specific module can be gotten by:
```
cardfunc help <module>
```
### Command Help
```
cardfunc help <module> <command>
```
## Server
### Add Server
#### Adding a Server
```
cardfunc server add <name> <private key> <public key>
```
#### With Admin User and Password
```
cardfunc server add <name> <private key> <public key> <admin> <password>
```
#### Storage
Added servers are stored in the `~/.cardfunc` directory in cleartext.

### List Server
```
cardfunc server list
```
### Using Server
To use a particular server use the `--server` flag:
```
cardfunc --server <server name> <module> <command> <...arguments>
```
### Default Server
The server with the name `default` is used by default when no `--server` flag is used.

### Env Server
The server name `env` is reserved and when used the following enviroment variables are used for server credentials:
- `privateKey`
- `publicKey`
-	`adminUser`
- `adminPassword`

### URL Override
To override the URL used to connect to the server use the `--url` flag:
```
cardfunc --url <url> <module> <command> <...arguments>
```

## Authorization
### Create
To create an authorization use:
```
cardfunc authorization create <amount> <currency> <pan> <expires> <pares>
```
## Test
### All Tests
To run all tests invoce:
```
cardfunc test
```
### Standard
A test that runs a standard authorization 
```
cardfunc test standard
```
### Cancel
```
cardfunc test cancel
```
