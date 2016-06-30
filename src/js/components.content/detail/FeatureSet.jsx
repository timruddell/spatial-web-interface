'use strict'

const { connect } = require("react-redux");
const fetchRemote = require("../../utilities/restClient");

const FeatureSetView = require("../../components.views/content/detail/FeatureSetView");
const FeatureSet = require("../../entities/FeatureSet");

const mapActions = require("../../components.state/actions/mapActions");
const featureActions = require("../../components.state/actions/featureActions");

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
        onSelected: (set) => dispatch(featureActions.setSelectedFeatureSet(set)),

        toggleFeatureSetVisible: (setId) => {
            dispatch(featureActions.toggleFeatureSetVisibility(setId));
        },

        locateFeatureSet: (setId) => {
            dispatch(mapActions.fitFeatureSetToView(setId));
        },

        setFeatureSetAction: (action) => dispatch(featureActions.setFeatureSetActionState(action)),

        resetFeatureSet: (setId) => {
            // Fetch the set and it's features from the server to reset.
            restoreFeatureSet(setId, (featureSet) => dispatch(featureActions.updateFeatureSet(featureSet)));

            // Reset the feature set action, since we shouldn't be in a actioning state.    
            dispatch(featureActions.setFeatureSetActionState(null));

            // Clear values flagged as modified.
            // TODO: best place to do this? Possibly in the same place that the set is fetched/added to state?
            dispatch(featureActions.clearModifiedFeatures());
        },

        persistModifiedFeatures: (setId) => {
            dispatch(featureActions.flagModifiedFeaturesForUpdating(true));
        }
    }
}

const FeatureSetContainer = connect(mapStateToProps, mapDispatchToProps)(FeatureSetView);
module.exports = FeatureSetContainer;