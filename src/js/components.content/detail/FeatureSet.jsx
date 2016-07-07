'use strict'

const { connect } = require("react-redux");

const fetchRemote = require("../../utilities/restClient");
const FeatureSetView = require("../../components.views/content/detail/FeatureSetView");

const mapActions = require("../../components.state/actions/mapActions");
const featureActions = require("../../components.state/actions/featureActions");


const mapStateToProps = (state, ownProps) => {
    return {
        features: _.filter(state.features.items, (f) => f.featureSetId === ownProps.featureSet.id),
        modifiedFeatures: state.features.modifiedFeatures
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        // Hack to access dispatcher in mergeProps.
        getDispatch: () => dispatch,

        onSelected: (set) => dispatch(featureActions.setSelectedFeatureSet(set.id)),

        toggleFeatureSetVisible: (setId) => {
            dispatch(featureActions.toggleFeatureSetVisibility(setId));
        },

        onToggleFeatureLabelVisible: (setId) => {
            dispatch(featureActions.setFeatureSetLabelVisible(ownProps.featureSet.id, !ownProps.featureSet.labelsVisible));
        },

        onLocateFeatureSet: (setId) => {
            dispatch(mapActions.fitContentToView(setId, "featureSet"));
        },

        setFeatureSetAction: (action) => dispatch(featureActions.setFeatureSetActionState(action)),

        onMouseEnterContext: _.debounce((setId, isEntered) => dispatch(featureActions.flagFeatureSetHover(setId, isEntered)), 50)
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