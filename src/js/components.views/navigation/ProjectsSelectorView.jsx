'use strict'

const renderProjectGroup = (projectGroup, onProjectSelected) => {
    return (
        <li key={projectGroup.id}>
            <a href="#">
                <i className="fa fa-folder"></i> 
                <span>{projectGroup.name}</span>
                <i class="fa fa-angle-left pull-right"></i>
            </a>
            <ul className="treeview-menu">
                {
                    _.map(projectGroup.children, (project) => {
                        return project.type === "group" ? renderProjectGroup(project, onProjectSelected) : 
                            renderProjectItem(project, onProjectSelected);
                    })
                }
            </ul>
        </li>
    );
}

const renderProjectItem = (project, onProjectSelected) => {
    return (
        <li key={project.id}><a href="#" onClick={ () => onProjectSelected(project) }><i className="fa fa-map-marker"></i> {project.name}</a></li>
    );
}

const ProjectSelectorView = function ({
    projects,
    projectCount,
    onProjectSelected
}) {
    return (
        <li className="treeview">
            <a href="#">
                <i className="fa fa-clipboard"></i>
                <span>Projects</span>
                <span className="label label-primary pull-right">{projectCount}</span>
            </a>
            <ul className="treeview-menu">
               {
                    _.map(projects, (project) => {
                        return project.type === "group" ? renderProjectGroup(project, onProjectSelected) : 
                            renderProjectItem(project, onProjectSelected);
                    })
               }
            </ul>
        </li>
    );
}

module.exports = ProjectSelectorView;