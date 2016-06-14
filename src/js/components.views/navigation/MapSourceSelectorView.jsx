const Classnames = require("classnames");

const MapSourceSelectorView = ({ 
    sourceType, 
    onInputChanged
}) => {

    // Treeview boostrap .active style override. Used because treeview clears .active on child
    // list items when parent list items are clicked.
    // TODO: investigte framewoks for inlining CSS styles - or react-bootstrap bindings for handling UI state instead of
    //  messing directly with the styles.
    var styleLiActive = {
        color: "white"
    }

    return (

        <li className="treeview">
            <a href="#">
                <i className="fa fa-globe"></i> Base map <i className="fa fa-angle-left pull-right"></i>
            </a>
            <ul className="treeview-menu">
                <li className={"treeview"}> 
                    <a href="#" style={Object.assign({}, sourceType === "osm" && styleLiActive)} onClick={ () => onInputChanged("osm") }>
                        <i className="fa fa-map-o"></i> Open Street Map (OSM)
                    </a>
                </li>
                <li className={"treeview"}>
                    <a href="#" style={Object.assign({}, sourceType === "sat" && styleLiActive)} onClick={ () => onInputChanged("sat") }>
                        <i className="fa fa-camera-retro"></i> Satellite
                    </a>
                </li>
                <li className={"treeview"}>
                    <a href="#" style={Object.assign({}, sourceType === "hyb" && styleLiActive)} onClick={ () => onInputChanged("hyb") }>
                        <i className="fa fa-plus"></i> Hybrid
                    </a>
                </li>
            </ul>
        </li>
    );
}

module.exports = MapSourceSelectorView;