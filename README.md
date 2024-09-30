# CAML 

A simple verification service and Discord bot to search against the US FINCEN AML List. 

## Project structure
Below is a basic overview of the project structure:

```
├── env.sample -> sample .env file
├── src/app.ts      -> main entrypoint for app
├── src/server -> server handlers and middlewares
├── src/utils    -> utility functions and enums
├── src/services -> core services for business logic
├── data-sources -> sources AML SDN list for tests
├── package.json
├── README.md
└── .gitignore
```

## Development 

For discord bot documentation follow instructions [here](./docs/discord-bot.md).

### Prerequisites

- Requires [NodeJS](https://nodejs.org/en/) >= 16

### Run the app locally

First clone the project:
```
git clone https://github.com/container23/caml.git
```

Then navigate to its directory and install dependencies:
```
cd caml
npm install
```

After dependencies are installed, go ahead and run the app:

```
make start
```
or use Docker

### Docker 

**Build Docker Image**

```
make docker-image
```

**Run Docker Image**

```
make docker-run
```

### Run tests

```
make test
```

### Deploy to Prod
* use the nginx/default config ( create a sym link in /etc/nginx/sites-enabled )

* serve with pm2
``` 
pm2 start --name=caml dist/app.js -i 2
```

## AML List Checks

### Data Refresh

By default the AML list is automatically updated on our live server instance every 24 hours, from U.S Department Of The Treasury source file [sdnlist.txt](https://www.treasury.gov/ofac/downloads/sdnlist.txt). The downloaded `sndlist.txt` SHA-256 checksum is also verified with the OFAC [hash values list](https://home.treasury.gov/policy-issues/financial-sanctions/specially-designated-nationals-list-sdn-list/hash-values-for-ofac-sanctions-list-files).

The AML [refresh script](./scripts/refresh-aml-list.sh) can also be manually trigger by running below command on your envionment.

```
make refresh-aml-list
```

## Contacts 

For more information about AML or KYC services, please contact us at [dev@container.com](mailto:dev@container.com).

## Disclaimers

Read our [license terms](./license.txt) for usage rights.

