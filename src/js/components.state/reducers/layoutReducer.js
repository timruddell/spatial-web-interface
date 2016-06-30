const { createReducer } = require("redux-act");

const a = require("../actions/layoutActions");

const initialState = {
    detailPaneIsOpen: false
}

const reducer = createReducer({
    [a.openDetailPane]: (state) => Object.assign({}, state, { detailPaneIsOpen: true }),
    [a.closeDetailPane]: (state) => Object.assign({}, state, { detailPaneIsOpen: false }),
    [a.toggleDetailPaneOpen]: (state) => Object.assign({}, state, { detailPaneIsOpen: !state.detailPaneIsOpen })

}, initialState);

module.exports = reducer;