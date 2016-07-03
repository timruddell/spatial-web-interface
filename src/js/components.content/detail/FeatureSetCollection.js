'use strict'

const { connect } = require("react-redux");
const FeatureSetCollectionView = require("../../components.views/content/detail/FeatureSetCollectionView");

const featureActions = require("../../components.state/actions/featureActions");

const mapStateToProps = (state) => {
    return {
        featureSets: state.features.featureSets
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleFeatureSetVisible: (setId) => {
            dispatch(featureActions.toggleFeatureSetVisibility(setId));
        }
    }
}

var FeatureSetCollection = connect(mapStateToProps, mapDispatchToProps)(FeatureSetCollectionView);

module.exports = FeatureSetCollection;