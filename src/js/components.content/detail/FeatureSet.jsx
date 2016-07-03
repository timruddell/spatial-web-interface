'use strict'

const { connect } = require("react-redux");
const { createSelector } = require("reselect");

const fetchRemote = require("../../utilities/restClient");
const FeatureSetView = require("../../components.views/content/detail/FeatureSetView");

const FeaturesManager = require("../../entities/entity.features-manager");
const FeatureSet = require("../../entities/FeatureSet");

const mapActions = require("../../components.state/actions/mapActions");
const featureActions = require("../../components.state/actions/featureActions");


const mapStateToProps = (state, ownProps) => {
    return {
        activeSetAction: state.features.selectedSetAction,
        features: _.filter(state.features.items, (f) => f.featureSetId === ownProps.featureSet.id)
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
            var featuresManager = new FeaturesManager(dispatch);

            // Fetch the set and it's features from the server to reset.
            featuresManager.fetchRemoteFeatureSets(setId);
            featuresManager.fetchRemoteFeatures(setId);

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