'use strict'

const DebugListView = ({
    onDebug_fetchFeatures,
    onDebug_fetchFeatureSets
}) => {
    return (
        <li className="treeview">
            <a href="#">
                <i className="fa fa-map-marker"></i>Features<i className="fa fa-angle-left pull-right"></i>
            </a>
            <ul className="treeview-menu">
                <li className={"treeview"}> 
                    <a href="#"  onClick={ onDebug_fetchFeatureSets }>
                        <i className="fa fa-map-o"></i> Fetch remote FeatureSets
                    </a>
                </li>
                <li className={"treeview"}> 
                    <a href="#"  onClick={ onDebug_fetchFeatures }>
                        <i className="fa fa-map"></i> Fetch remote Features
                    </a>
                </li>
            </ul>
        </li>
    )
};

module.exports = DebugListView;