'use strict'

const { connect } = require("react-redux");

const FeatureSetCollectionView = require("../../components.views/content/detail/FeatureSetCollectionView");

const mapStateToProps = (state) => {
    return {
        featureSets: state.features.sets
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
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
        },

        featureSetSelected: (setId) => {

        }
    }
}

var FeatureSetCollection = connect(mapStateToProps, mapDispatchToProps)(FeatureSetCollectionView);

module.exports = FeatureSetCollection;