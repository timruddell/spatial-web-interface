'use strict'

const classnames = require("classnames");

const FeatureSetCollection = require("../../../components.content/detail/FeatureSetCollection");
const FeatureSet = require("../../../components.content/detail/FeatureSet");

// TODO: different types of details should be deferred to different components.
const DetailPaneView = ({
    // Whether or not this pane should be opened
    isOpen,
    selectedProject,

    selectedFeatureSet,

    // Callbacks
    dismissSelectedFeatureSet,
    onLocateProject

}) => {
    // Render the outer container based on visibility flags.
    const renderProjectInfoContainer = () => (
        <aside className={classnames("control-sidebar", "control-sidebar-dark", { "control-sidebar-open": isOpen })}>
            { !selectedProject ? <p>No content selected</p> : renderProjectInfoPane() }
        </aside>
    );

    // Render the inner Project info container.
    const renderProjectInfoPane = () => {
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
                    <h1 style={{ fontSize: "20px" }} className="control-sidebar-heading">{ selectedProject.name }</h1>
                    <p>{ selectedProject.description }</p>
                    <div style={{ margin: "15px -15px 15px -15px" }} >
                        <ul className="sidebar-menu">
                            <li className="treeview active">
                                <a href="#">
                                    <i className="fa fa-bolt"></i>
                                    <span>Actions</span>
                                </a>
                                <ul className="treeview-menu menu-open">
                                    <li onClick={ () => onLocateProject(selectedProject.id) }><a href="#"><i className="fa fa-map-marker"></i> <span>Locate project</span></a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <h5 className="control-sidebar-heading" style={{ marginBottom: 0 }}>Site information:</h5>
                    <ul className="control-sidebar-menu">
                        <li>
                            <a href="javascript:void(0)">
                                <i style={{ marginTop: "8px" }} className="menu-icon fa fa-user bg-green"></i>
                                <div className="menu-info">
                                    <h4 className="control-sidebar-subheading"><b>Alice Wright</b></h4> 
                                    <p><b>Site manager</b></p>
                                    <p>Mobile: +64(22)555-1234</p>
                                </div>
                            </a>
                        </li>
                    </ul>
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
                    { /* Provide an alternative view when a feature set has been selected. */}
                    {
                        !selectedFeatureSet ? '' : (
                            <a onClick={dismissSelectedFeatureSet} href="#"><p><i className="fa fa-undo text-aqua"></i> Return to list...</p></a>
                        )
                    }
                    {
                        !!selectedFeatureSet ? 
                            <FeatureSet featureSet={selectedFeatureSet} showChildFeatures={true} /> 
                            : <FeatureSetCollection />
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

    // Return the outer container.
    return renderProjectInfoContainer();
}

module.exports = DetailPaneView;