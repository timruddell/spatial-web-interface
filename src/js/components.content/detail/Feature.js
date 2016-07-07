'use strict'

const { connect } = require("react-redux");
const FeaturesManager = require("../../entities/entity.features-manager");
const FeatureDetailView = require("../../components.views/content/detail/view.feature.detail");

const mapActions = require("../../components.state/actions/mapActions");
const featureActions = require("../../components.state/actions/featureActions");

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
        onSelectFeatureSet: () => dispatch(featureActions.setSelectedFeatureSet(ownProps.entity.featureSetId)),
        onEditFeature: () => dispatch(featureActions.flagIsEditingFeature(true)),

        onDiscardEdits: () => {
            var featuresManager = new FeaturesManager(dispatch);
            featuresManager.fetchRemoteFeatures(ownProps.entity.id);

            dispatch(featureActions.flagIsEditingFeature(false));
        }
    }
}

const FeatureContainer = connect(mapStateToProps, mapDispatchToProps)(FeatureDetailView);
module.exports = FeatureContainer;