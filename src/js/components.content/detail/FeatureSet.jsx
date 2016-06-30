'use strict'

const { connect } = require("react-redux");
const fetchRemote = require("../../utilities/restClient");

const FeatureSetView = require("../../components.views/content/detail/FeatureSetView");
const FeatureSet = require("../../entities/FeatureSet");

// TODO: the following two functions should be part of a class extending React.Component so
// they can access the context store and don't need so many arguments passed.

// Fetch and create the FeatureSet entity.
const restoreFeatureSet = (setId, receiver) => {
    Promise.all([
        fetchRemote('/api/feature-sets/' + setId),
        fetchRemote('/api/feature-sets/' + setId + '/features')
    ]).then(
        ([set, features]) => {
            var featureSet = new FeatureSet(set.entity, features.entity);
            receiver(featureSet);
        });
}

const persistModifiedFeatures = (modifiedFeatures) => {

}

const mapStateToProps = (state) => {
    return {
        activeSetAction: state.features.selectedSetAction
    }
}

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
        },

        setFeatureSetAction: (action) => {
            dispatch({
                type: "FEATURES_SET_FEATURESET_SELECTED_ACTION",
                value: action
            });
        },

        resetFeatureSet: (setId) => {
            // Fetch the set and it's features from the server to reset.
            restoreFeatureSet(setId, (featureSet) => dispatch({
                type: "UPDATE_FEATURE_SET",
                value: featureSet
            }));

            // Reset the feature set action, since we shouldn't be in a actioning state.    
            dispatch({
                type: "FEATURES_SET_FEATURESET_SELECTED_ACTION",
                value: null
            });

            // Clear values flagged as modified.
            // TODO: best place to do this? Possibly in the same place that the set is fetched/added to state?
            dispatch({
                type: "FEATURES_CLEAR_MODIFIED"
            });
        },

        persistModifiedFeatures: (setId) => {
            dispatch({
                type: "FEATURES_SET_PERSIST_MODIFIED",
                value: true
            });
        }
    }
}

const FeatureSetContainer = connect(mapStateToProps, mapDispatchToProps)(FeatureSetView);
module.exports = FeatureSetContainer;