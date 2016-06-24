'use strict'

const DebugListView = ({
    onDebug_mapLayerRefresh
}) => {
    return (
        <li className="treeview">
            <a href="#">
                <i className="fa fa-globe"></i>Map debug<i className="fa fa-angle-left pull-right"></i>
            </a>
            <ul className="treeview-menu">
                <li className={"treeview"}> 
                    <a href="#"  onClick={ onDebug_mapLayerRefresh }>
                        <i className="fa fa-map-o"></i> refresh map layers
                    </a>
                </li>
            </ul>
        </li>
    )
};

module.exports = DebugListView;