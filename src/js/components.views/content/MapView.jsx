const MapView = () => {

    styleMapFixedContainer = {
        width: "100%",
        height: "100%",
        position: "fixed"
    }

    // The rotation control is a temporary hack due to the map container layout's
    // interaction with the panes.
    styleRotationControl = {
        position: "absolute",
        left: "84px",
        zIndex: 1000
    }

    return (
        <div style={styleMapFixedContainer}>
            <div id={"map-content-root"} className={"map"}></div>
            <div id="ol-control-rotate-custom" style={styleRotationControl}></div>
        </div>
    );
}

module.exports = MapView;