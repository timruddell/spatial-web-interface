const { createAction } = require("redux-act");

const actions = {
    setLocalProjects: createAction(
        "Set the local collection of projects onto the state",
        projects => projects
    ),

    // TODO: move.
    setLocalOwnerships: createAction(
        "Set the local collection of projects onto the state",
        ownerships => ownerships
    ),

    setSelectedProject: createAction(
        "Set the selected Project context",
        projectId => projectId
    )
}

module.exports = actions;