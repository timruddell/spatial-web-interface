'use strict'

const { connect } = require("react-redux");
const FeaturesManager = require("../../entities/entity.features-manager");
const FeatureDetailView = require("../../components.views/content/detail/view.feature.detail");

const mapActions = require("../../components.state/actions/mapActions");
const featureActions = require("../../components.state/actions/featureActions");
const layoutActions = require("../../components.state/actions/layoutActions");

// Requires 'entity' prop as an entity.feature instance.
const mapStateToProps = (state, ownProps) => {
    return {
        featureSet: _.find(state.features.featureSets, (fs) => fs.id === ownProps.entity.featureSetId),
        isEditingFeature: state.features.isEditingFeature
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onLocateFeature: () => dispatch(mapActions.fitContentToView(ownProps.entity.id, "feature")),
        onSelectFeatureSet: () => {
            dispatch(featureActions.setSelectedFeatureSet(ownProps.entity.featureSetId));
            dispatch(layoutActions.setActiveDetailTab("featureSet"));
        },
        onEditFeature: () => dispatch(featureActions.flagIsEditingFeature(true)),

        onDiscardEdits: () => {
            // Disable feature editing.
            dispatch(featureActions.flagIsEditingFeature(false));

            var featuresManager = new FeaturesManager(dispatch);

            // If we're editing a persisted feature, just re-fetch the feature.
            // Otherwise just remove the created feature from the store.
            if (ownProps.entity.id !== 0) {
                // Re-fetch the feature from the server. Once available, select the feature again.
                featuresManager.fetchRemoteFeatures(ownProps.entity.id).then(
                    () => {
                        dispatch(featureActions.flagFeatureAsSelected(ownProps.entity.id, true));
                    });
            }
            else {
                dispatch(featureActions.removeLocalFeature(0));
            }
        },

        onSaveEdits: () => {
            var featuresManager = new FeaturesManager(dispatch);

            // Create/update.
            if (ownProps.entity.id !== 0) {
                featuresManager.updateRemoteFeatures([ownProps.entity]);
            }
            else {
                featuresManager.createRemoteFeature(ownProps.entity);
                // Remove the temporary feature from the state.
                dispatch(featureActions.removeLocalFeature(0));
            }
            
            dispatch(featureActions.flagIsEditingFeature(false));
        },

        // Update the feature name.
        onFeatureNameUpdate: (value) => {
            dispatch(featureActions.updateFeatureState(ownProps.entity.id, { name: value }));
        }
    }
}

const FeatureContainer = connect(mapStateToProps, mapDispatchToProps)(FeatureDetailView);
module.exports = FeatureContainer;