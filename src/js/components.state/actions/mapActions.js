'use strict'

const { createAction } = require("redux-act");

const actions = {
    changeSource: createAction(
        "Change the data source of the base layer map to the specified type", 
        sourceType => sourceType
    ),

    fitContentToView: createAction(
        "Fit the passed content to the map's primary view",
        content => content
    )
}

module.exports = actions;