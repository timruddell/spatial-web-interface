const { createAction } = require("redux-act");

const actions = {
    setLocalProjects: createAction(
        "Set the local collection of projects onto the state",
        projects => projects
    ),

    // TODO: should be Project ID
    setSelectedProject: createAction(
        "Set the selected Project context",
        project => project
    )
}

module.exports = actions;