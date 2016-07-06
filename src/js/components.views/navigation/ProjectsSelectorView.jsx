'use strict'

const renderProjectGroupItem = (projectGroupName, projects, onProjectSelected) => {
    return (
        <li key={projectGroupName}>
            <a href="#">
                <i className="fa fa-folder"></i> 
                <span>{projectGroupName}</span>
                <i class="fa fa-angle-left pull-right"></i>
            </a>
            <ul className="treeview-menu">
                {
                    _.map(projects, (project) => renderProjectItem(project, onProjectSelected))
                }
            </ul>
        </li>
    );
}

const renderProjectItem = (project, onProjectSelected) => {
    return (
        <li key={project.id}>
            <a href="#" onClick={ () => onProjectSelected(project) }>
                <i className="fa fa-leaf"></i> 
                {project.name}
            </a>
        </li>
    );
}

// Currently only handles one level of grouping.
const renderProjectList = (projects, onProjectSelected) => {
    if (!projects || projects.length === 0) {
        return;
    }

    var sortedProjects = _.sortBy(projects, 'name');

    // Get a unique list of project groups.
    var projectGroups = _.chain(projects)
        .reject((project) => project.projectGroupId === null)
        .pluck(("projectGroupId"))
        .uniq().sortBy()
        .value();

    // Render groups first.
    var elements = _.map(projectGroups, (projectGroup) => {
        return renderProjectGroupItem(projectGroup, 
            _.filter(sortedProjects, (project) => project.projectGroupId === projectGroup), onProjectSelected)
    });

    // Render non-grouped projects.
    _.chain(sortedProjects)
        .where({ projectGroupId: null })
        .each((project) => elements.push(renderProjectItem(project, onProjectSelected)))
        .value();

    return elements;
}

const ProjectSelectorView = function ({
    projects,
    projectCount,
    onProjectSelected
}) {
    return (
        <li className="treeview">
            <a href="#">
                <i className="fa fa-flag"></i>
                <span>Projects</span>
                <span className="label label-primary pull-right">{projectCount}</span>
            </a>
            <ul className="treeview-menu">
               {
                   renderProjectList(projects, onProjectSelected)
               }
            </ul>
        </li>
    );
}

module.exports = ProjectSelectorView;