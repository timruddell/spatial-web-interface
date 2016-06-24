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
                type: "MAP_FEATURES_LOAD"
            });
        }
    }
}

var Debug = connect(
    mapStateToProps,
    mapDispatchToProps
)(DebugListView);

module.exports = Debug;