'use strict'

var ApplicationView = require("../components.views/application/ApplicationView");
var applicationReducer = require('../components.reducers/reducers');

// Create the top-level application store for use by child components.
var store = Redux.createStore(applicationReducer);

class Application extends React.Component {

    render () {
        return (
            <ApplicationView store={store} />
        )
    }
}

module.exports = Application;