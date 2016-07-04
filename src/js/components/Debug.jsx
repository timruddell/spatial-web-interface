'use strict'

// Debug component for development.

const DebugListView = require("../components.views/navigation/DebugListView");
const featureActions = require("../components.state/actions/featureActions");

const { connect } = require("react-redux");

const mapStateToProps = (state) => {
    return {
        
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // onDebug_mapLayerRefresh: () => dispatch(featureActions.featureLoadRequired())
    }
}

var Debug = connect(
    mapStateToProps,
    mapDispatchToProps
)(DebugListView);

module.exports = Debug;