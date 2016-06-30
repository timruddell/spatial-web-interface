'use strict'

const { createReducer } = require("redux-act");

const a = require("../actions/mapActions");

const initialState = {
    sourceType: "AerialWithLabels",
    view: {
        fittedExtent: null,
        fittedFeatureSetId: null
    }
}

const reducer = createReducer({
    [a.changeSource]: (state, sourceType) => Object.assign({}, state, { sourceType: sourceType }),

    [a.fitExtentToView]: (state, extent) => Object.assign({}, state, { 
        view: Object.assign({}, initialState.view, { fittedExtent: extent }) }),

    [a.fitFeatureSetToView]: (state, featureSetId) => Object.assign({}, state, { 
        view: Object.assign({}, initialState.view, { fittedFeatureSetId: featureSetId }) })

}, initialState);

module.exports = reducer;