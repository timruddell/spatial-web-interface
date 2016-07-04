'use strict'

// Debug component for development.
const FeaturesManager = require("../entities/entity.features-manager");

const DebugListView = require("../components.views/navigation/DebugListView");

const { connect } = require("react-redux");

const mapStateToProps = (state) => {
    return {
        
    }
}

const mapDispatchToProps = (dispatch) => {

    var featuresManager = new FeaturesManager(dispatch);

    return {
        onDebug_fetchFeatureSets: () => featuresManager.fetchRemoteFeatureSets(),
        onDebug_fetchFeatures: () => featuresManager.fetchRemoteFeatures()
    }
}

var Debug = connect(
    mapStateToProps,
    mapDispatchToProps
)(DebugListView);

module.exports = Debug;