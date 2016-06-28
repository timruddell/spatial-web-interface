'use strict'

const { connect } = require("react-redux");

const FeatureSetView = require("../../components.views/content/detail/FeatureSetView");

const mapDispatchToProps = (dispatch) => {
    return {
        onSelected: (set) => {
            dispatch({
                type: "FEATURES_SET_SELECTED_SET",
                value: set
            });
        },

        toggleFeatureSetVisible: (setId) => {
            dispatch({
                type: "TOGGLE_FEATURESET_VISIBILITY",
                id: setId
            });
        },

        locateFeatureSet: (setId) => {
            dispatch({
                type: "MAP_VIEW_FIT_FEATURESET",
                value: setId
            });
        }
    }
}

var FeatureSet = connect(null, mapDispatchToProps)(FeatureSetView);

module.exports = FeatureSet;