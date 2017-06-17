'use strict'

const ApplicationView = require("../components.views/application/ApplicationView");
const applicationReducer = require('../components.state/reducers');

const layoutActions = require("../components.state/actions/layoutActions");
const featureActions = require("../components.state/actions/featureActions");
const mapActions = require("../components.state/actions/mapActions");
const projectActions = require("../components.state/actions/projectActions");

const FeaturesManager = require("../entities/entity.features-manager");

// Create the top-level application store for use by child components.
var store = Redux.createStore(applicationReducer);

/// Dispatch actions at page load to start in a specific state.
/// Currently selects and zooms to Colorado River plots demo (mock project ID 1).
setTimeout(() => {
    // Select the demo project.
    store.dispatch(projectActions.setSelectedProject(1));
    // Zoom the main map view to the extent of the project.
    store.dispatch(mapActions.fitContentToView(1, "project"));
    // Open the right-hand side detail pane with project info.
    store.dispatch(layoutActions.openDetailPane());
}, 200);

// Root application component;
class Application extends React.Component {

    componentDidMount () {
        // Fetch the initial Features and FeatureSets.
        var featuresManager = new FeaturesManager(store.dispatch);

        featuresManager.fetchRemoteFeatureSets();
        featuresManager.fetchRemoteFeatures();
    }

    render () {
        var state = store.getState();

        return (
            <ApplicationView 
                detailPaneIsOpen={ state.layout.detailPaneIsOpen } 
                toggleDetailPaneOpen={ toggleDetailPaneOpen } 
                store={ store } />
        );
    }
}

const toggleDetailPaneOpen = () => {
    var isOpen = store.getState().layout.detailPaneIsOpen;

    store.dispatch(layoutActions.toggleDetailPaneOpen()); 
}

module.exports = Application;