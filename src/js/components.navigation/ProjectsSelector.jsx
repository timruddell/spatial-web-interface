'use strict'

const { Component } = require("react");
const { connect } = require("react-redux");
const fetchRemote = require("../utilities/restClient");

const ProjectsSelectorView = require("../components.views/navigation/ProjectsSelectorView");

const projectActions = require("../components.state/actions/projectActions");
const layoutActions = require("../components.state/actions/layoutActions");

// Wrapper Project selector component. Provides access to lifecycle hooks for loading data.
class ProjectsSelector extends Component {
    componentDidMount() {
        // Initialize the project information from the remote source.
        this.fetchRemoteData();
    }

    fetchRemoteData() {
        fetchRemote('/api/projects').then(function (response) {
            if (response.status.code === 200) {
                // Set the project list using an action.
                this.props.onProjectDataLoaded(response.entity);
            }
            else {
                console.error("Error loading project information: Status code " + response.status.code)
            }
        }.bind(this));
    }

    render() {
        return <ProjectsSelectorView { ...this.props } />
    }
}

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

            // Hack: use animations instead of delayed dispatches. Callbacks should NOT
            // be responsible for timing UI transitions...

            dispatch(layoutActions.closeDetailPane());

            _.delay(() => {
                dispatch(projectActions.setSelectedProject(project));

                // Open the project info pane.
                dispatch(layoutActions.openDetailPane());
            }, 300);
        },

        onProjectDataLoaded: (items) => dispatch(projectActions.setLocalProjects(items))
    }
}

// Generate a connected container that will manage and render the above. 
const container = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectsSelector);

module.exports = container;