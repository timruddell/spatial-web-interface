'use strict'

const classnames = require("classnames");

// TODO: different types of details should be deferred to different components.
const DetailPaneView = ({
    // Whether or not this pane should be opened
    isOpen,
    // Assuming info is a project for now
    selectedProject,
    featureSets,

    // Callbacks
    toggleFeatureSetVisible
}) => {
    return (
        <aside className={classnames("control-sidebar", "control-sidebar-dark", { "control-sidebar-open": isOpen })}>
            { !selectedProject ? <p>No content selected</p> : renderProjectInfoPane(selectedProject, featureSets, toggleFeatureSetVisible) }
        </aside>
    );
}

const renderProjectInfoPane = (project, featureSets, toggleFeatureSetVisible) => {

    return (
        <div>
        { /* Tab list for top of pane view */ }
        <ul className="nav nav-tabs nav-justified control-sidebar-tabs">
            <li className="active">
                <a href="#control-sidebar-project-info-tab" data-toggle="tab">
                    <i className="fa fa-info"></i>
                </a>
            </li>
            <li>
                <a href="#control-sidebar-project-featuresets-tab" data-toggle="tab">
                    <i className="fa fa-map-marker"></i>
                </a>
            </li>
            <li>
                <a href="#control-sidebar-project-data-tab" data-toggle="tab">
                    <i className="fa fa-table"></i>
                </a>
            </li>
            <li>
                <a href="#control-sidebar-project-attachments-tab" data-toggle="tab">
                    <i className="fa fa-paperclip"></i>
                </a>
            </li>
        </ul>

        { /* Tab content panes. TODO: style properly. */ }
        <div className="tab-content" style={{ padding: "10px 15px" }}>
            { /* Project info tab content */ }
            <div className="tab-pane active" id="control-sidebar-project-info-tab">
                <h1 className="control-sidebar-heading">{ project.name }</h1>
                <p>{ project.description }</p>

                <h5 className="control-sidebar-heading" style={{ paddingBottom: 0, marginBottom: 0 }}>Contacts:</h5>
                <ul className="control-sidebar-menu">
                    <li>
                        <a href="javascript:void(0)">
                            <i style={{ marginTop: "7px" }} className="menu-icon fa fa-user bg-green"></i>
                            <div className="menu-info">
                                <h4 className="control-sidebar-subheading"><b>John Doe</b></h4> 
                                <p><b>Project manager</b></p>
                                <p>Mobile: +64(22)555-1234</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0)">
                            <i style={{ marginTop: "8px" }} className="menu-icon fa fa-user bg-blue"></i>
                            <div className="menu-info">
                                <h4 className="control-sidebar-subheading"><b>Alice Wright</b></h4> 
                                <p><b>Site manager</b></p>
                                <p>Mobile: +64(22)555-1234</p>
                            </div>
                        </a>
                    </li>
                </ul>

                <h5 className="control-sidebar-heading" style={{ marginBottom: 0 }}>Site information:</h5>
                <ul className="control-sidebar-menu">
                    <li>
                        <a href="javascript:void(0)">
                            <i className="menu-icon fa fa-location-arrow bg-blue"></i>
                            <div className="menu-info">
                                <p>RD1 Farmville Road, Newfarmland 1052</p>
                            </div>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0)">
                            <i className="menu-icon fa fa-exclamation bg-orange"></i>
                            <div className="menu-info">
                                <p>All site access to be authorized by site manager</p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>

            { /* Project feature sets tab content */ }
            <div className="tab-pane" id="control-sidebar-project-featuresets-tab" style={{ margin: "0 -7px 0 -7px" }}>
            {
                _.map(featureSets, (set) => {
                    return (
                        <div key={ set.id } className="info-box bg-light-blue" style={{ minHeight: "65px" }}>
                            <span className="info-box-icon" style={{ width: "36px", height: "65px" }}>
                                <i className="menu-icon fa fa-map-marker" style={{ fontSize: "60%", float: "left", marginLeft: "10px", marginTop: "19px" }}></i>
                            </span>

                            <div className="info-box-content" style={{ marginLeft: "36px" }}>
                            <span className="info-box-text">{ set.name }</span>

                            <div className="progress">
                                <div className="progress-bar" style={{width: "0%"}}></div>
                            </div>
                                <span className="progress-description" style={{ paddingTop: "4px" }}>
                                    {
                                        <i onClick={ ()=> toggleFeatureSetVisible(set.id) } className={classnames("menu-icon", "fa", {"fa-eye": set.visible, "fa-eye-slash": !set.visible })} style={{ float: "right", marginLeft: "10px", cursor: "pointer" }}></i>
                                    }
                                    <i className="menu-icon fa fa-pencil" style={{ float: "right", marginLeft: "12px", cursor: "pointer" }}></i>
                                    <i className="menu-icon fa fa-download" style={{ float: "right", marginLeft: "10px", marginTop: "1px", cursor: "pointer" }}></i>
                                </span>
                            </div>
                        </div>
                    );
                })
            }
            </div>

            { /* Project data tab content */ }
            <div className="tab-pane" id="control-sidebar-project-data-tab">
            </div>

            { /* Project notes tab content */ }
            <div className="tab-pane" id="control-sidebar-project-attachments-tab">
            </div>
        </div>
        </div>
    );
}

module.exports = DetailPaneView;