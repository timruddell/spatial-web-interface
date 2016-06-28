const classnames = require("classnames");

// Detail pane tab for FeatureSet information.
const FeatureSetView = ({
    featureSet,
    showChildFeatures,

    // Callbacks
    onSelected,
    toggleFeatureSetVisible,
    locateFeatureSet
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
                        <i className="menu-icon fa fa-download" style={{ float: "right", marginLeft: "10px", marginTop: "1px", cursor: "pointer" }}></i>
                        <i className="menu-icon fa fa-pencil" style={{ float: "right", marginLeft: "12px", cursor: "pointer" }}></i>
                        <i onClick={ () => locateFeatureSet(featureSet.id) } className="menu-icon fa fa-map-marker" style={{ float: "right", marginLeft: "12px", cursor: "pointer" }}></i>
                        {
                            <i onClick={ () => toggleFeatureSetVisible(featureSet.id) } className={classnames("menu-icon", "fa", {"fa-eye": featureSet.visible, "fa-eye-slash": !featureSet.visible })} style={{ float: "right", marginLeft: "10px", cursor: "pointer" }}></i>
                        }                                    
                    </span>
                </div>
            </div>
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
    );
}

module.exports = FeatureSetView;