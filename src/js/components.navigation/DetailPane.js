'use strict'

const DetailPaneView = require("../components.views/navigation/DetailPaneView");
const { connect } = require("react-redux");

const mapStateToProps = (state) => {
    return {
        isOpen: state.layout.detailPaneIsOpen,
        selectedProject: state.projects.selected
    }
}

var DetailPane = connect(mapStateToProps)(DetailPaneView);

module.exports = DetailPane;