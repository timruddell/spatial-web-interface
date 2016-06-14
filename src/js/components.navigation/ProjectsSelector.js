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
            alert ("" + project.name + " was selected!");
        }
    }
}

var ProjectsSelector = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectsSelectorView);

module.exports = ProjectsSelector;