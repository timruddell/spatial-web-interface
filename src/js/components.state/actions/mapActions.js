'use strict'

const { createAction } = require("redux-act");

const actions = {
    changeSource: createAction(
        "Change the data source of the base layer map to the specified type", 
        sourceType => sourceType
    ),

    fitExtentToView: createAction(
        "Fit the passed extent to the map's primary view",
        extent => extent
    ),

    fitFeatureSetToView: createAction(
        "Fit the passed FeatureSet ID to the map's primary view",
        featureSetId => featureSetId
    )
}

module.exports = actions;