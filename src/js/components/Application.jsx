'use strict'

var ApplicationView = require("../components.views/application/ApplicationView");
var applicationReducer = require('../components.reducers/reducers');

// Create the top-level application store for use by child components.
var store = Redux.createStore(applicationReducer);

// TODO: can we react-redux bind this even if the Provider hasn't been set up? Might need to do some more
// nesting of sub components for this.
class Application extends React.Component {

    render () {
        var state = store.getState();

        return (
            <ApplicationView 
                detailPaneIsOpen={ state.layout.detailPaneIsOpen } 
                toggleDetailPaneOpen={ toggleDetailPaneOpen } 
                store={ store } />
        )
    }
}

const toggleDetailPaneOpen = () => {
    var isOpen = store.getState().layout.detailPaneIsOpen;

    store.dispatch({
        type: "LAYOUT_DETAIL-PANE_SET_OPEN",
        value: !isOpen
    }); 
}

module.exports = Application;