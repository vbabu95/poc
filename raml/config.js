/**
 * Default configuration properties
 * @type {{port: number, proxy: string}}
 */
const CONFIG = {
    mocks: 'examples',                          //examples or json-server, examples === RAML examples, json-server === json-server
    port: process.env.PORT || 8080,             //port to run mock server on
    proxy: ''                                   //proxy server to check if service exists on, 'https://some.other.domain.com/dir'
};

/**
 * Overrides for specific targets, use as a command-line argument. All options are examples, you can add
 * as many targets as you like and whatever the proxy domain may be that you want to set for that target.
 *
 * @type {{production: {proxy: string}, development: {proxy: string}, qa: {proxy: string}, uat: {proxy: string}, mock: {}}}
 *
 * @example
 * npm start -- development
 *
 * @example
 * node server development
 */
const TARGET_CONFIG = {
    production: {
        proxy: 'https://prod.example.com'
    },
    development: {
        proxy: 'http://dev.example.com:8080'
    },
    qa: {
        proxy: 'https://example.com:8888/qa'
    },
    uat: {
        proxy: 'http://devsrv8.cynergysystems.com/fleet-portal-uat'
    },
    mock: {

    }
};

//assign overrides based on command line targets (ie --mock)
console.log(process.argv);
process.argv.forEach(arg => {
    arg = arg.replace('--', '');
    if (TARGET_CONFIG.hasOwnProperty(arg)) {
        Object.assign(CONFIG, TARGET_CONFIG[arg]);
    }
});

console.log(JSON.stringify(CONFIG, null, 2));

module.exports = CONFIG;