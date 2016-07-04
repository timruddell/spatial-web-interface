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
        features: _.filter(state.features.items, (f) => f.featureSetId === ownProps.featureSet.id),
        modifiedFeatures: state.features.modifiedFeatures
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // Hack to access dispatcher in mergeProps.
        getDispatch: () => dispatch,

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
        }
    }
}

// We're having to use mergeProps here in order to access state properties for callbacks. This seems less than
// ideal but is the recommended way currently: https://github.com/reactjs/react-redux/issues/237
const mergeProps = (stateProps, dispatchProps, ownProps) => {

    // Return the default merge logic, with the extra callback.
    return Object.assign({}, ownProps, stateProps, dispatchProps, {

        persistModifiedFeatures: (setId) => {    
            // Get the modified features from the state props.
            var modifiedIds = stateProps.modifiedFeatures;
            var features = _.filter(stateProps.features, (f) => _.indexOf(modifiedIds, f.id) !== -1);

            if (features.length > 0) {
                var featuresManager = new FeaturesManager(dispatchProps.getDispatch());
                featuresManager.updateRemoteFeatures(features);
            }
        }
    });
}

const FeatureSetContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(FeatureSetView);
module.exports = FeatureSetContainer;