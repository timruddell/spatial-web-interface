'use strict'

const DetailPaneView = require("../../components.views/content/detail/DetailPaneView");
const { connect } = require("react-redux");

const featureActions = require("../../components.state/actions/featureActions");

const mapStateToProps = (state) => {
    return {
        isOpen: state.layout.detailPaneIsOpen,
        selectedProject: state.projects.selected,
        selectedFeatureSet: state.features.selectedSet
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dismissSelectedFeatureSet: () => {
            dispatch(featureActions.setSelectedFeatureSet(null));
        }
    }
}

var DetailPane = connect(mapStateToProps, mapDispatchToProps)(DetailPaneView);

module.exports = DetailPane;