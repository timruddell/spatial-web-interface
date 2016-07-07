const classnames = require("classnames");

const FeatureContainer = require("../../../components.content/detail/Feature");

// Detail pane tab for FeatureSet information.
const FeatureSetView = ({
    featureSet,
    features,

    showChildFeatures,

    // Callbacks
    onSelected,
    onFeatureSelected,

    toggleFeatureSetVisible,
    onToggleFeatureLabelVisible,
    onLocateFeatureSet,

    onMouseEnterContext
}) => {
    return (
        <div>
            <div key={ featureSet.id } 
                    className={classnames("info-box", {"bg-light-blue": featureSet.isVisible, "bg-gray": !featureSet.isVisible })} 
                    style={{ minHeight: "65px" }}
                    onMouseEnter={ () => showChildFeatures ? {} : onMouseEnterContext(featureSet.id, true) }
                    onMouseLeave={ () => showChildFeatures ? {} : onMouseEnterContext(featureSet.id, false) }>
                <span className="info-box-icon" style={{ width: "36px", height: "65px" }}>
                    <i className="menu-icon fa fa-cubes" style={{ fontSize: "40%", float: "left", marginLeft: "7px", marginTop: "24px" }}></i>
                </span>

                <div className="info-box-content" style={{ marginLeft: "36px" }}>
                    <span onClick={ () => onSelected(featureSet) } className="info-box-text" style={{ cursor: "pointer" }}>
                        { featureSet.name }
                        <span className={classnames("label", { "bg-blue": features.length > 0, "bg-gray": features.length === 0 })} 
                            style={{ float: "right", marginTop: "3px" }}>
                                { features.length }
                            </span>
                    </span>

                    <div className="progress">
                        <div className="progress-bar" style={{width: "0%"}}></div>
                    </div>
                    <span className="progress-description"
                            style={{ display: featureSet.isHoverContext || showChildFeatures ? "inherit" : "none", paddingTop: "4px" }}>
                        <i onClick={ () => onLocateFeatureSet(featureSet.id) } className="menu-icon fa fa-location-arrow" style={{ float: "right", marginLeft: "12px", cursor: "pointer" }}></i>
                        {
                            <i onClick={ () => toggleFeatureSetVisible(featureSet.id) } 
                                className={classnames("menu-icon", "fa", {"fa-eye": featureSet.isVisible, "fa-eye-slash": !featureSet.isVisible })} 
                                style={{ float: "right", marginLeft: "10px", cursor: "pointer" }}></i>
                        }
                    </span>
                </div>
            </div>
            <div style={{ marginLeft: "-8px", marginRight: "-8px" }} >
                {
                    (showChildFeatures) ? (
                        <ul className="sidebar-menu">
                            <li className="treeview active">
                                <ul className="treeview-menu menu-open">
                                    <li><a href="#"><i className="fa fa-plus"></i> <span>Add a feature</span></a></li>
                                    <li><a href="#"><i className="fa fa-download"></i> <span>Download feature set</span></a></li>
                                    {
                                        featureSet.hasLabels 
                                            ? <li onClick={ onToggleFeatureLabelVisible } ><a href="#"><i className="fa fa-tag"></i> <span>{featureSet.labelsVisible ? "Turn off labels" : "Turn on labels"}</span></a></li>
                                            : ""
                                    }
                                </ul>
                            </li>
                        </ul>
                    ) : ''
                }
                {
                    !showChildFeatures ? '' : (
                        <ul className="sidebar-menu">
                            <li className="header" style={{ marginBottom: "10px" }} >FEATURES</li>
                            {
                                _.map(_.sortBy(features, "name"), (f) => {
                                    return (
                                        <li key={ f.id } onClick={ () => onFeatureSelected(f.id) } style={{ margin: "0px 16px 0px 16px" }} ><FeatureContainer entity={f} /></li>
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