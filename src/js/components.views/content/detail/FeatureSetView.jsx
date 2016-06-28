const classnames = require("classnames");

// Detail pane tab for FeatureSet information.
const FeatureSetView = ({
    featureSet,
    showChildFeatures,
    activeSetAction,

    // Callbacks
    onSelected,
    toggleFeatureSetVisible,
    locateFeatureSet,
    setFeatureSetAction,
    resetFeatureSet
}) => {
    return (
        <div>
            <div key={ featureSet.id } className={classnames("info-box", {"bg-light-blue": featureSet.visible, "bg-gray": !featureSet.visible })} style={{ minHeight: "65px" }}>
                <span className="info-box-icon" style={{ width: "36px", height: "65px" }}>
                    <i className="menu-icon fa fa-flag" style={{ fontSize: "50%", float: "left", marginLeft: "7px", marginTop: "22px" }}></i>
                </span>

                <div className="info-box-content" style={{ marginLeft: "36px" }}>
                <span onClick={ () => onSelected(featureSet) } className="info-box-text" style={{ cursor: "pointer" }}>{ featureSet.name + " (" + featureSet.features.length + ")"}</span>

                <div className="progress">
                    <div className="progress-bar" style={{width: "0%"}}></div>
                </div>
                    <span className="progress-description" style={{ paddingTop: "4px" }}>
                        <i onClick={ () => locateFeatureSet(featureSet.id) } className="menu-icon fa fa-map-marker" style={{ float: "right", marginLeft: "12px", cursor: "pointer" }}></i>
                        {
                            <i onClick={ () => toggleFeatureSetVisible(featureSet.id) } 
                                className={classnames("menu-icon", "fa", {"fa-eye": featureSet.visible, "fa-eye-slash": !featureSet.visible })} 
                                style={{ float: "right", marginLeft: "10px", cursor: "pointer" }}></i>
                        }                                    
                    </span>
                </div>
            </div>
            {
                activeSetAction === 'EDIT' ? <p style={{ fontSize: "90%" }} >{"Left-click to select a feature on the map, then drag the feature's edges/corners to modify"}</p> : ''
            }
            <div style={{ marginLeft: "-8px", marginRight: "-8px" }} >
                {
                    (showChildFeatures && activeSetAction === null) ? (
                        <ul className="sidebar-menu">
                            <li className="treeview active">
                                <a href="#">
                                    <i className="fa fa-bolt"></i>
                                    <span>Actions</span>
                                </a>
                                <ul className="treeview-menu menu-open">
                                    <li onClick={ () => setFeatureSetAction("EDIT") }><a href="#"><i className="fa fa-pencil-square-o"></i> <span>Add/edit features</span></a></li>
                                    <li><a href="#"><i className="fa fa-download"></i> <span>Download feature set</span></a></li>
                                </ul>
                            </li>
                        </ul>
                    ) : ''
                }
                {
                    (showChildFeatures && activeSetAction === 'EDIT') ? (
                        <ul className="sidebar-menu">
                            <li className="treeview active">
                                <a href="#">
                                    <i className="fa fa-pencil-square-o"></i>
                                    <span>Editing features...</span>
                                </a>
                                <ul className="treeview-menu menu-open">
                                    <li><a href="#"><i className="fa fa-plus"></i> <span>Add a feature</span></a></li>
                                    <li><a href="#"><i className="fa fa-check"></i> <span>Save changes</span></a></li>
                                    <li onClick={ () => resetFeatureSet(featureSet.id) }><a href="#"><i className="fa fa-ban"></i> <span>Discard changes</span></a></li>
                                </ul>
                            </li>
                        </ul>
                    ) : ''
                }
                {
                    !showChildFeatures ? '' : (
                        <ul className="sidebar-menu">
                            <li className="header">FEATURES</li>
                            {
                                _.map(featureSet.features, (f) => {
                                    return (
                                        <li key={ f.id }><a href="#"><i className="fa fa-circle-o text-aqua"></i> <span>{f.name}</span></a></li>
                                    )
                                })
                            }
                        </ul>
                    )
                }
            </div>
        </div>
    );
}

module.exports = FeatureSetView;