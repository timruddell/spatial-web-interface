'use strict'

const { connect } = require("react-redux");

const fetchRemote = require("../../utilities/restClient");
const FeatureSetView = require("../../components.views/content/detail/FeatureSetView");

const mapActions = require("../../components.state/actions/mapActions");
const featureActions = require("../../components.state/actions/featureActions");


const mapStateToProps = (state, ownProps) => {
    return {
        features: _.filter(state.features.items, (f) => f.featureSetId === ownProps.featureSet.id)
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onSelected: (set) => dispatch(featureActions.setSelectedFeatureSet(set.id)),
        onFeatureSelected: (featureId) => {
            // TODO: combine these two? Could have a flag to optionally clear.
            dispatch(featureActions.clearFeatureSelectedFlags());
            dispatch(featureActions.flagFeatureAsSelected(featureId, true));
        },

        toggleFeatureSetVisible: (setId) => {
            dispatch(featureActions.toggleFeatureSetVisibility(setId));
        },

        onToggleFeatureLabelVisible: (setId) => {
            dispatch(featureActions.setFeatureSetLabelVisible(ownProps.featureSet.id, !ownProps.featureSet.labelsVisible));
        },

        onLocateFeatureSet: (setId) => {
            dispatch(mapActions.fitContentToView(setId, "featureSet"));
        },

        onMouseEnterContext: _.debounce((setId, isEntered) => dispatch(featureActions.flagFeatureSetHover(setId, isEntered)), 50)
    }
}

const FeatureSetContainer = connect(mapStateToProps, mapDispatchToProps)(FeatureSetView);
module.exports = FeatureSetContainer;