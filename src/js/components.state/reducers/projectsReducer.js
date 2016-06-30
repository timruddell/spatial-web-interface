const { createReducer } = require("redux-act");
const a = require("../actions/projectActions");

const initialState = {
    items: [],
    selected: null
}

const reducer = createReducer({
    [a.setLocalProjects]: (state, projects) => Object.assign({}, state, { items: projects }),

    [a.setSelectedProject]: (state, project) => Object.assign({}, state, { selected: project })

}, initialState);

module.exports = reducer;