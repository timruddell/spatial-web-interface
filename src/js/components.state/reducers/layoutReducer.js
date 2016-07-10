const { createReducer } = require("redux-act");

const a = require("../actions/layoutActions");

const initialState = {
    detailPaneIsOpen: false,
    activeDetailTab: "project"
}

const reducer = createReducer({
    [a.openDetailPane]: (state) => Object.assign({}, state, { detailPaneIsOpen: true }),
    [a.closeDetailPane]: (state) => Object.assign({}, state, { detailPaneIsOpen: false }),
    [a.toggleDetailPaneOpen]: (state) => Object.assign({}, state, { detailPaneIsOpen: !state.detailPaneIsOpen }),
    [a.setActiveDetailTab]: (state, tab) => Object.assign({}, state, { activeDetailTab: tab, detailPaneIsOpen: true })

}, initialState);

module.exports = reducer;