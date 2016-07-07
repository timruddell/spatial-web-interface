const { createAction } = require("redux-act");

const actions = {
    openDetailPane: createAction(
        "Opens the page content detail pane"
    ),

    closeDetailPane: createAction(
        "Closes the page content detail pane"
    ),

    toggleDetailPaneOpen: createAction(
        "Toggles the openness of the page contnet detail pane"
    ),

    setActiveDetailTab: createAction(
        "Set the active detail tab",
        tab => tab
    )
}

module.exports = actions;