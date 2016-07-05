'use strict'

const { createReducer } = require("redux-act");

const a = require("../actions/mapActions");

const initialState = {
    sourceType: "AerialWithLabels",
    view: {
        // Content that is fitted to the current map view.
        fittedContent: null,
        // Content type string of fitted content. 
        fittedContentType: null
    }
}

const reducer = createReducer({
    [a.changeSource]: (state, sourceType) => Object.assign({}, state, { sourceType: sourceType }),

    [a.fitContentToView]: (state, payload) => Object.assign({}, state, { 
        view: Object.assign({}, initialState.view, { fittedContent: payload.content, fittedContentType: payload.contentType }) })

}, initialState);

module.exports = reducer;