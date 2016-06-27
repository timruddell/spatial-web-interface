'use strict'

// Debug component for development.

var DebugListView = require("../components.views/navigation/DebugListView");

const { connect } = require("react-redux");

const mapStateToProps = (state) => {
    return {
        
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDebug_mapLayerRefresh: (sourceType) => {
            dispatch({
                type: "LOAD_FEATURES_REQUIRED"
            });
        }
    }
}

var Debug = connect(
    mapStateToProps,
    mapDispatchToProps
)(DebugListView);

module.exports = Debug;