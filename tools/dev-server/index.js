/**
 * Mock RESTful webservice backend.
 * 
 * The file structure in the ./data directory determines the available top-level services.
 * 
 * Service endpoint data is loaded from disk once when the application is run.
 * Changes applied to the endpoints will be saved in memory for subsequent
 * calls, and lost when the application stops.
 * 
 */

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const SERVICE_PORT = 3000;
const SERVICE_DATA_DIR = path.join(__dirname, "data");

// Generates ids for new entities.
let entityIds = function* generator() {
    let id = 100000;
    while(true) {
        yield id++;
    }
}();

console.log("Starting mock service backend...");

// Container for parsed service data.
let data = { };


//
// Load the data structure content into memory.
//
let fileNames = fs.readdirSync(SERVICE_DATA_DIR)
    .filter(fn => fn.endsWith(".json"));

let routeNames = fileNames.map( fn => fn.replace(".json", ""));

routeNames.forEach(routeName => {        
    console.log("Found endpoint:", routeName);
    data[routeName] = require(path.join(SERVICE_DATA_DIR, routeName + ".json"));
});

//
// Setup and run RESTful HTTP service.
//
const app = express();

app.use((req, res, next) => {
    // Allow requests from pages served by our static dev server.
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
// Enable parsing of JSON content on request body.
app.use(bodyParser.json());

// Join the endpoint names so we can match them exactly in our route.
let routeNamesSelector = routeNames.join("|");

// Match only top-level valid endpoints.
app.get('/api/:endpoint(' + routeNamesSelector + ')', function (req, res) {
    let endpoint = req.params.endpoint;
    res.send(data[endpoint]);
});

// Match top-level valid endpoints with and ID.
app.get('/api/:endpoint(' + routeNamesSelector + ')/:id', function (req, res) {
    let endpoint = req.params.endpoint;
    let id = parseInt(req.params.id, 10);

    let matches = data[endpoint]
        .filter((row) => row["id"] === id);

    // 404 not found.
    if (matches.length === 0) {
        res.status(404).send("Entity not found");
        return;
    }

    res.send(matches[0]);
});

// Allow clients to update individual items into memory.
app.put('/api/:endpoint(' + routeNamesSelector + ')/:id', function (req, res) {
    let endpoint = req.params.endpoint;
    let id = parseInt(req.params.id, 10);

    // Make sure the entity exists.
    let entityIndex = data[endpoint]
        .findIndex((row) => row["id"] === id);

    // 404 not found.
    if (entityIndex === -1) {
        res.status(404).send("Entity not found");
        return;
    }

    data[endpoint].splice(entityIndex, 1);
    data[endpoint].push(req.body);

    res.status(200).send("Entity updated successfully.");
});

// Allow clients to add items into the memory store.
app.post('/api/:endpoint(' + routeNamesSelector + ')', function (req, res) {
    let endpoint = req.params.endpoint;

    // Generate a random ID for the new entity.
    let id = entityIds.next().value;
    let entity = Object.assign({}, req.body, { id });

    data[endpoint].push(entity);

    res.status(200).send(entity);
});

app.listen(SERVICE_PORT, function () {
    console.log('Services running on port', SERVICE_PORT);
});