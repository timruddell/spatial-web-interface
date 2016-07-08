const MapView = () => {

    styleMapFixedContainer = {
        width: "100%",
        height: "100%",
        position: "fixed"
    }

    return (
        <div id={"map-content-root"} style={styleMapFixedContainer} className={"map"}></div>
    );
}

module.exports = MapView;