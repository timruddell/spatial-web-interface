const { createReducer } = require("redux-act");
const a = require("../actions/projectActions");

const initialState = {
    items: [],
    selectedProjectId: null
}

const reducer = createReducer({
    [a.setLocalProjects]: (state, projects) => Object.assign({}, state, { items: projects }),

    [a.setSelectedProject]: (state, projectId) => Object.assign({}, state, { selectedProjectId: projectId })

}, initialState);

module.exports = reducer;