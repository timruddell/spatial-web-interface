const MapView = () => {

    styleMapFixedContainer = {
        width: "100%",
        height: "100%",
        position: "fixed"
    }

    return (
        <div style={styleMapFixedContainer} className={"map"}></div>
    );
}

module.exports = MapView;