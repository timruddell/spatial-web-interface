'use strict'

const DetailPaneView = require("../components.views/navigation/DetailPaneView");
const { connect } = require("react-redux");

const mapStateToProps = (state) => {
    return {
        isOpen: state.layout.detailPaneIsOpen,
        selectedProject: state.projects.selected,
        featureSets: state.features.sets
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleFeatureSetVisible: (setId) => {
            dispatch({
                type: "TOGGLE_FEATURESET_VISIBILITY",
                id: setId
            });
        }
    }
}

var DetailPane = connect(mapStateToProps, mapDispatchToProps)(DetailPaneView);

module.exports = DetailPane;