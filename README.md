# Overview

This is the 3rd generation of webstart, a project starter for web development that orchestrates several 
open-source tools together into a cohesive workflow. This iteration concentrates on reducing complexity, 
abstractions and dependencies of the previous versions making this version easier to maintain.

## Whats under the hood?

* [Webpack](https://webpack.github.io/) - The module bundler for client-side code, configuration files can be found in 
`config/webpack.config*.js`.
* [Babel](https://babeljs.io/) - Transpiles ES6+ standards back to ES5 compliant code to run in all browsers, 
configuration files can be found in `.babelrc`.
* [TypeScript](https://www.typescriptlang.org/) - TypeScript is supported in the pipeline if you leverage *.ts or *.tsx files
in your project. By default TypeScript is set to target ES2017 and then Babel will transpile to ES5 for consistency. 
Configuration files can be found in `config/tsconfig.json`.
* [Express](https://expressjs.com/) - The framework for the server-side code used for hosting the client-side code and
also optionally for server-side API and/or rendering.
* [RAML](http://raml.org/) - API design and modeling with code and documentation generation. Hooks are already provided 
in both the client and server code of this project to handle this. The example RAML definitions are found in `raml/api.v1.raml` and
`server/api.js` will automatically find this and mount a mock server with validation. You can dynamically hook into the mock server with 
the matching `server/api.v1.js` file.
* [Karma](https://karma-runner.github.io) - The runner for unit testing the application in a browser, configuration files can be found in
`config/karma*.config.js`. This will read all the spec files in your project via `client/spec.js`.
* [Protractor](http://www.protractortest.org) - The runner for end-to-end testing the application in a browser, configuration files can be found in 
`config/protractor.config.js`. Example file can be found in `client/e2e.js`.
* [Istanbul](https://istanbul.js.org/) - The code coverage tool used to test coverage of both Karma and Protractor.
* [Jasmine](http://jasmine.github.io/) - The default expectation framework used for both Karma and Protractor.
* [ESLint](http://eslint.org/) - The linter for ES code, configuration files can be found in `.eslintrc`.
* [ESDoc](https://esdoc.org/) - The documenter for ES code, configuration files can be found in `config/esdoc.config.js`.
* [i18next](http://i18next.com/) - The localization framework, configuration files can be found in `config/i18next.config.js`.
* [Bootstrap](https://v4-alpha.getbootstrap.com/) - UI framework, configuration files can be found in `client/bootstrap`.
* [Fontgen](https://github.com/DragonsInn/fontgen-loader) - An SVG->Font generator loader for webpack. Import SVG files and generate fonts and stylesheet automatically.
Example file located in `client/icons/fonts.js`. Loader is setup in `config/webpack.config.js` and matches any file named `font.(js|jsx|ts|tsx)` that is imported in the app.
* [Autoprefixer](https://github.com/postcss/autoprefixer) - A CSS post-processer that automatically appends required browser prefixes to your CSS. Configuration is set in `config/webpack.config.js`.
* [Docker](https://www.docker.com/) - A container system used for standardizing the applications runtime for deployment.

## Setup

### Automatic (Docker)

Ensure docker is installed then refer to the [docker](./docker) section. This will ensure your entire 
environment is setup correctly via a container.

### Manual (No Docker)

Preferably, install [NVM](https://github.com/creationix/nvm) then restart your terminal and run 
the following from your project directory:

```
nvm install && nvm use
```

This will install and link the correct version of NodeJS locally for 
the project. You should always ensure you are running the correct 
version when working on the project.

If not using NVM, alternatively install the correct version
of NodeJS specified in [.nvmrc](./.nvmrc).

# Running for development

```
npm install
npm start
```

This will start the express server that will watch for changes and rebuild
as necessary. This has sever some core features:

* Host statically compiled from "dist" directory (see `Prebuild statically compiled files`)
* Host dynamically compiled files on-demand from webpack (disabled if only running `npm install --production`)
* Host RAML NodeJS validation + mock server with user defined API hooks
* Watch client source files with webpack hot module support and force reload fallback
* Watch server source files with server restart via nodemon

# Running for production

## Prebuild statically compiled files

```
npm install
npm run build
```

This will compile all files to the `dist` directory optimized for production. You could now deploy 
the contents of this application to run on a remote server, or use the commands below to 
use the built-in express server to host your production application.

## Run the application

```
npm install --production
node server
```

This will install the minimal number of dependencies to run the 
express app and start the server. This means that webstart can act as a fully functional
stand-alone web server for your application, using the same server you use for 
development purposes but its now targeting precompiled client assets optimized 
for production use.

All watch and dynamic on-demand compilation features are disabled in this mode, but all
other functionality remains just like running for development.

# Further reading

* [Working with Docker](./docker)
* [Client-Side Code](./client)
* [Server-Side Code](./server)
* [Configuration](./config)
* [Scaffolding](./scaffold)
* [RAML API](./raml)
* [Test Reports](./reports)
* [Documentation](./docs)
