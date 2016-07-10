'use strict'

const ApplicationView = require("../components.views/application/ApplicationView");
const applicationReducer = require('../components.state/reducers');

const layoutActions = require("../components.state/actions/layoutActions");

const FeaturesManager = require("../entities/entity.features-manager");

// Create the top-level application store for use by child components.
var store = Redux.createStore(applicationReducer);

// TODO: can we react-redux bind this even if the Provider hasn't been set up? Might need to do some more
// nesting of sub components for this.
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