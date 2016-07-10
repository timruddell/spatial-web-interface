const { createReducer } = require("redux-act");
const a = require("../actions/projectActions");

const initialState = {
    items: [],

    // TODO: move.
    ownerships: [],

    // TODO: should be a member of each project item.
    selectedProjectId: null
}

const reducer = createReducer({
    [a.setLocalProjects]: (state, projects) => Object.assign({}, state, { items: projects }),
    [a.setLocalOwnerships]: (state, ownerships) => Object.assign({}, state, { ownerships }),

    [a.setSelectedProject]: (state, projectId) => Object.assign({}, state, { selectedProjectId: projectId })

}, initialState);

module.exports = reducer;