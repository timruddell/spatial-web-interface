'use strict'

const classnames = require("classnames");

const view = ({
    // The core entity.feature instance to drive the view.
    entity,
    isEditingFeature,
    // The feature set corresponding to the feature entity.
    featureSet,

    // Whether or not to show detailed feature information. False shows the simple info-box datum.
    showDetail,

    onLocateFeature,
    onSelectFeatureSet,

    onEditFeature,
    onDiscardEdits,
    onSaveEdits
}) => {
    return (
        <div>
        <div key={ entity.id } 
                className={classnames("info-box", { "bg-light-blue": !entity.isSelected, "bg-blue": entity.isSelected })} 
                style={{ minHeight: "32px", cursor: "pointer" }}>
            <span className="info-box-icon" style={{ width: "36px", height: "32px" }}>
                <i className="menu-icon fa fa-map-marker" style={{ fontSize: "35%", float: "left", marginLeft: "13px", marginTop: "8px" }}></i>
            </span>

            <div className="info-box-content" style={{ marginLeft: "36px" }}>
                <span>
                    { entity.name }
                </span>
            </div>
        </div>
        {
            !isEditingFeature && showDetail ? (
                <div>
                    <p>Feature belonging to <span style={{ fontStyle: 'italic', fontWeight: 'bold' }}>{featureSet.name}</span> set.</p>
                    <div style={{ marginLeft: "-8px", marginRight: "-8px" }} >
                        <ul className="sidebar-menu">
                            <li className="treeview active">
                                <ul className="treeview-menu menu-open">
                                    <li onClick={ onLocateFeature }><a href="#"><i className="fa fa-location-arrow"></i> <span>Locate feature</span></a></li>
                                    <li onClick={ onSelectFeatureSet }><a href="#"><i style={{ marginLeft: "-2px", marginRight: "2px" }} className="fa fa-cubes"></i> <span>{ featureSet.name }</span></a></li>
                                    <li onClick={ onEditFeature }><a href="#"><i className="fa fa-pencil-square-o"></i> <span>Edit feature</span></a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            ) : ''
        }
        {
            isEditingFeature && showDetail ? <p style={{ fontSize: "90%" }} >{"Drag the feature's edges/corners to modify"}</p> : ''
        }
        {
            isEditingFeature && showDetail ? (
                <ul className="sidebar-menu" style={{ marginLeft: "-8px", marginRight: "-8px" }}>
                    <li className="treeview active">
                        <a href="#">
                            <i className="fa fa-pencil-square-o"></i>
                            <span>Editing feature...</span>
                        </a>
                        <ul className="treeview-menu menu-open">
                            <li onClick={ onSaveEdits }><a href="#"><i className="fa fa-check"></i> <span>Save changes</span></a></li>
                            <li onClick={ onDiscardEdits }><a href="#"><i className="fa fa-ban"></i> <span>Discard changes</span></a></li>
                        </ul>
                    </li>
                </ul>
            ) : ''
        }
        </div>
    );
}

module.exports = view;