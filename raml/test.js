const Ajv = require('ajv');
const parser = require('raml-parser');
const ajv = new Ajv({
    allErrors: true,
    verbose: true
});
const promises = [];
const fs = require('fs');
const path = require('path');
const files = fs.readdirSync(__dirname)
    .filter(f => f.match(/\.raml$/))
    .map(f => path.join(__dirname, f));

let returnCode = 0;

files.forEach(file => {
    promises.push(parser.loadFile(file).then(
        raml => {
            (raml.schemas || []).forEach(schemas => Object.keys(schemas).forEach(key => ajv.addSchema(parseJson(schemas[key], `should be able to parse schema for ${key}`), key)));
            raml.resources.forEach(r => validateResource(r, raml.baseUri || ''));
        },
        error => {
            logError(error);
        }
    ));
});

Promise.all(promises).then(done, error => {
    logError(error);
    done();
});

function done() {
    process.exit(returnCode);
}

function logError(message) {
    console.error(message);
    returnCode = 1;
}

function parseJson(value, message) {
    //TODO: write expectation
    try {
        return JSON.parse(value);
    }
    catch (e) {
        logError(`${message}\n\t${e.toString()}`);
        return {};
    }
}

function validateResource(resource, path = '') {
    const fullpath = path + resource.relativeUri;
    if (resource.methods) {
        resource.methods.forEach(m => {
            validateBody(fullpath, m.method, 'request', m.body);
            Object.keys(m.responses || []).forEach(k => {
                if (m.responses[k] && m.responses[k].body) {
                    validateBody(fullpath, m.method, 'response', m.responses[k].body);
                }
            });
        });
    }
    (resource.resources || []).forEach(r => validateResource(r, fullpath));
}

function validateBody(fullpath, method, requestOrResponse, body) {
    const def = body && body['application/json'];
    let schema = null;
    if (def && def.schema) {
        try {
            schema = parseJson(def.schema, `should be able to parse ${requestOrResponse} schema for [${method}] ${fullpath}`);
            ajv.addSchema(schema);
        }
        catch (e) {
            //schema already added previously
        }
    }
    if (schema && def.example) {
        const example = parseJson(def.example, `should be able to parse ${requestOrResponse} example for [${method}] ${fullpath}`);
        const expectation = `should validate ${requestOrResponse} example data for [${method}] ${fullpath} with schema ${schema.id}`;
        try {
            //TODO: write expectation
            if (!ajv.validate(schema.id, example)) {
                const errors = ajv.errorsText(ajv.errors, {separator: '\n\t'});
                logError(`${expectation}...fail\n\t${errors}`);
            }
            else {
                console.log(`${expectation}...ok`)
            }
            ajv.errors = [];
        }
        catch (e) {
            logError(e);
        }
    }
}
