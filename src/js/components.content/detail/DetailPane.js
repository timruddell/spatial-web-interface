'use strict'

const DetailPaneView = require("../../components.views/content/detail/DetailPaneView");
const { connect } = require("react-redux");

const featureActions = require("../../components.state/actions/featureActions");
const mapActions = require("../../components.state/actions/mapActions");

const mapStateToProps = (state) => {
    return {
        isOpen: state.layout.detailPaneIsOpen,
        selectedProject: _.find(state.projects.items, (p) => p.id === state.projects.selectedProjectId),
        selectedFeatureSet: _.find(state.features.featureSets, (fs) => fs.id === state.features.selectedFeatureSetId)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dismissSelectedFeatureSet: () => {
            dispatch(featureActions.setSelectedFeatureSet(null));
        },
        onLocateProject: (projectId) => {
            dispatch(mapActions.fitContentToView(projectId, "project"));
        }
    }
}

var DetailPane = connect(mapStateToProps, mapDispatchToProps)(DetailPaneView);

module.exports = DetailPane;