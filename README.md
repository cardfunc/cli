# PayFunc Card Tokenizing CLI
Command line interface for PayFunc Card Tokenizing.

# Installing
Install using NPM in the global scope:
```
npm install -g @payfunc/cli-card
```

# Usage
Assuming that the `payfunc-card` command is installed in your path as done above.
## Version
To learn which version you have installed use:
```
payfunc-card version
```
## Help 
### List Modules
To get an index of all help commands:
```
payfunc-card help
```
### Module Help
Help for a specific module can be gotten by:
```
payfunc-card help <module>
```
### Command Help
```
payfunc-card help <module> <command>
```
## Server
### Add Server
#### Adding a Server
```
payfunc-card server add <name> <private key> <public key>
```
#### With Admin User and Password
```
payfunc-card server add <name> <private key> <public key> <admin> <password>
```
#### Storage
Added servers are stored in the `~/.payfunc-card` directory in cleartext.

### List Server
```
payfunc-card server list
```
### Using Server
To use a particular server use the `--server` flag:
```
payfunc-card --server <server name> <module> <command> <...arguments>
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
payfunc-card --url <url> <module> <command> <...arguments>
```

## Authorization
### Create
To create an authorization use:
```
payfunc-card authorization create <amount> <currency> <pan> <expires> <pares>
```
## Test
### All Tests
To run all tests invoce:
```
payfunc-card test
```
### Standard
A test that runs a standard authorization 
```
payfunc-card test standard
```
### Cancel
```
payfunc-card test cancel
```
