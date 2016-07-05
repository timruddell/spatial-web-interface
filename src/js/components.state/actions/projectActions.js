const { createAction } = require("redux-act");

const actions = {
    setLocalProjects: createAction(
        "Set the local collection of projects onto the state",
        projects => projects
    ),

    setSelectedProject: createAction(
        "Set the selected Project context",
        projectId => projectId
    )
}

module.exports = actions;