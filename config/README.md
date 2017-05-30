This directory contains all the configuration files for the various tools
and frameworks used in this application.

# app.config.js

This is the base configuration options for the application. This file may be imported
into either the client or server base code. When the application is run or built, it
will use passed in command line arguments and environment variables to modify the 
configuration as necessary. You can modify this file to add your own custom 
application configuration settings.

# esdoc.config.json

This is the base configuration for ESDoc which generates source code documentation. 
See https://esdoc.org/manual/configuration/config.html for more information.

# i18next.config.js

This is the base configuration for i18next which controls localization in the app.
See http://i18next.com/docs/options/ for more information.

# karma.config.js

This is the base configuration for karam which is used for running unit tests.
See http://karma-runner.github.io/1.0/config/configuration-file.html for more information.

# karam.watch.config.js

Same as above, but modified for continuous testing rather than 1 time run.

# protractor.config.js 

This is the base configuration for protractor which is used for running end-to-end tests.
See https://github.com/angular/protractor/blob/master/lib/config.ts for more information.

# scaffold.config.js

This is the base configuration for scaffolds using the `npm run scaffolds` command. 
See [scaffold](../scaffold) for more information.

# tsconfig.json

This is the base configuration for TypeScript compilation in the application.
See https://www.typescriptlang.org/docs/handbook/tsconfig-json.html for more information.

# webpack.config.js

This is the base configuration for webpack which is used for code bundling and transformation.
See https://webpack.github.io/docs/configuration.html for more information.

# webpack.config.hot.js

Same as above, contains overrides for use with hot module swapping.
See https://webpack.github.io/docs/hot-module-replacement-with-webpack.html for more information.

# webpack.config.karma.js

Same as above, but contains overrides for use when running in karma.