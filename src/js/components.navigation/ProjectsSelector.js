'use strict'

var ProjectsSelectorView = require("../components.views/navigation/ProjectsSelectorView");

const { connect } = require("react-redux");

const recursiveProjectCount = (projects) => {
    return _.reduce(
        projects, 
        function (memo, project) {
            return project.type === "group" ? 
                recursiveProjectCount(project.children) 
                : memo + 1 
        }, 0);
}

const mapStateToProps = (state) => {
    return {
        projects: state.projects.items,
        projectCount: recursiveProjectCount(state.projects.items)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onProjectSelected: (project) => {
            dispatch({
                type: "PROJECT_SELECTION_CHANGED",
                value: project
            });

            // Open the project info pane.
            dispatch({
                type: "LAYOUT_DETAIL-PANE_SET_OPEN",
                value: true
            });   
        }
    }
}

var ProjectsSelector = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectsSelectorView);

module.exports = ProjectsSelector;