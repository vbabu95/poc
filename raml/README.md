# Overview

This is a starter project for working with [RAML](http://raml.org/). It 
provides a stub implementation for starting your API, along with
test,documentation and server options.

This starter includes a built in server that will:

* Validate all incoming requests against RAML definitions and return validation errors for invalid requests.
* Stubs out mock server on `/mock/...` based on either static RAML `examples` (default) or dynamic `json-server` via local JSON database (see config).
* Optionally delegate API requests to a foreign implementation on a different server via a proxy (see config).
* Optionally implement a true backend for any API resource (see api.v1.js).
* Redirect all RAML resource endpoints using the `mock` trait directly to mock implementations.

See [API.md](./API.md) to documentation reference.

## References

* [RAML](http://raml.org/) - A modeling language for designing your API used to generate documentation and code.
* [Express](http://expressjs.com/) - A web framework for NodeJS that is used for our internal server.
* [Osprey](https://github.com/mulesoft/osprey) - A middleware for express generated from source RAML files.
* [json-server](https://github.com/typicode/json-server) - A middleware for express that leverages a JSON data store for the backend allowing dynamic mocks.

# Setup

## NVM

```
nvm install && nvm use
npm install
```

## Manual (if not using NVM)

Install the correct version of NodeJS per `.nvmrc` or `package.json`

```
npm install
```

# Commands

## npm run build

Runs the local tests and generates HTML documentation to the root
directory. This includes HTML and MarkDown files:

`npm run build`

## npm test

Runs the tests for the API for validating the RAML structure as well
as example data against the schemas:

`npm test`

## npm start

Tests and builds the API, then runs a server that hosts the documentation 
as well as a mock server. The mock server performs the following functions:

* Request validation against schema with 4xx response
* Proxy delegation to foreign implementation of API if proxy setup in config
* Dynamic mock fallback if no proxy or proxy unavailable (i.e. `api.v1.js` for `api.v1.raml`)
* Static mock fallback based on example data if no other routes handle the request

`npm start`

# Configuration

There are a few options in `config.js` you may set. You can set 
different configuration values per target and then use command line 
arguments to use one of these targets. An example use case is to set 
different proxies for different targets (ie development) which you 
would then target with:

`npm start -- development`

or 

`node server development`

## config.port

This is the port the server will run on. Default is 8081, so 
http://localhost:8081

## config.proxy

Provide a server to proxy requests to for a foreign API implementation. 
The local server will attempt to direct API calls to this server AFTER 
it does request validation. If the proxied server doesn't appear to be 
available for the request, then the local server will then delegate to 
the mock response. Default is no proxy.

## config.mocks

Control whether to get mocks from static `examples` in the RAML 
definitions or dynamically from a `json-server` backend 
database using the JSON datastore. Default is `examples`, if you
want to use `json-server` set this value in the config and make 
sure to create an entry in the JSON file (ie `api.v1.json`) for 
the endpoint (ie `users`) that contains the entries you wish 
to modify. Json-server can add to, remove from or modify items
in collections in the DB that match the endpoint resource type.