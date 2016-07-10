'use strict'

const mapReducer = require("./reducers/mapReducer");
const featuresReducer = require("./reducers/featuresReducer");
const projectsReducer = require("./reducers/projectsReducer");
const layoutReducer = require("./reducers/layoutReducer");

// Combine all component specific reducers into a single top-level reducer function.
var reducers = Redux.combineReducers({
    map: mapReducer,
    features: featuresReducer,
    projects: projectsReducer,
    layout: layoutReducer
});

module.exports = reducers;