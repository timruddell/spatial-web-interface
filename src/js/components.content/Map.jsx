/** @jsx React.DOM */

'use strict'

const { createSelector } = require("reselect");
const $ = require("jquery");
const fetchRemote = require("../utilities/restClient");

const MapView = require("../components.views/content/MapView");

const mapTriggers = require("../components.triggers/mapTriggers");
const mapActions = require("../components.state/actions/mapActions");
const { olSource } = require("../components.consts/MapConsts");

class Map extends React.Component {
    
    // Component mounted to DOM. Initialize the OL map.
    componentDidMount () {
        const { store } = this.context;

        var mapState = store.getState().map;
        var rootNode = ReactDOM.findDOMNode(this);

        // Create a container group for our remote layers.
        var remoteVectorLayerGroup = new ol.layer.Group();
        remoteVectorLayerGroup.set("source", "remote");

        var olMap = new ol.Map({
            target: rootNode,
            controls: [
                new ol.control.Zoom(),
                new ol.control.Rotate({
                    target: $("#ol-control-rotate-custom")[0]
                })],

            // Interactions initially set in the mapInteractionHandler trigger.
            interactions: ol.interaction.defaults(),
            
            layers: [
                new ol.layer.Tile({
                    key: "base-layer",
                    source: olSource
                }),
                remoteVectorLayerGroup
            ],
            
            view: new ol.View({
                center: ol.proj.transform([173.870, -41.151], "EPSG:4326", "EPSG:3857"),
                zoom: 6
            })
        });

        // Subscribe the map triggers to changes to the store.
        new mapTriggers(olMap).subscribeToStore(store);

        // Switch to 'Pointer' cursor when mouse goes over a feature.
        olMap.on("pointermove", function (event) {
            var hit = olMap.hasFeatureAtPixel(event.pixel);
            olMap.getTargetElement().style.cursor = (hit ? 'pointer' : '');
        });

        // HACK: attaching an often used function that gets the map feature corresponding to
        // a passed Feature entity Id.
        olMap.getMapFeatureById = (featureId) => {
            // Get the layer corresponding to the FeatureSet ID, and fit to its extent.
            var layers = remoteVectorLayerGroup.getLayers().getArray();

            var mapFeature = null;
            _.find(layers, (l) => {
                var f = l.getSource().getFeatureById(featureId);
                if (f) {
                    mapFeature = f;
                    return true;
                }
            });

            return mapFeature;
        }

        olMap.getLayerByFeatureSetId = (featureSetId) => {
            var layers = remoteVectorLayerGroup.getLayers().getArray();
            return _.find(layers, (l) => l.get("featureSetId") === featureSetId);
        }

        olMap.getLayerByFeatureId = (featureId) => {
            // Get the layer corresponding to the FeatureSet ID, and fit to its extent.
            var layers = remoteVectorLayerGroup.getLayers().getArray();

            var layer = _.find(layers, (l) => {
                var f = l.getSource().getFeatureById(featureId);
                if (f) {
                    return true;
                }
            });

            return layer;
        }
    }
    
    render () {
        return (
            <MapView />
        );
    }

}

// Opt-in to props passed through context. 
Map.contextTypes = {
    store: React.PropTypes.object
}

module.exports = Map;