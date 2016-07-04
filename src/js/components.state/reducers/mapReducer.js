'use strict'

const { createReducer } = require("redux-act");

const a = require("../actions/mapActions");

const initialState = {
    sourceType: "AerialWithLabels",
    view: {
        // Content that is fitted to the current map view.
        fittedContent: null
    }
}

const reducer = createReducer({
    [a.changeSource]: (state, sourceType) => Object.assign({}, state, { sourceType: sourceType }),

    [a.fitContentToView]: (state, content) => Object.assign({}, state, { 
        view: Object.assign({}, initialState.view, { fittedContent: content }) })

}, initialState);

module.exports = reducer;