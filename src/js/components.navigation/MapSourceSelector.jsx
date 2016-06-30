/** @jsx React.DOM */

'use strict'

const MapSourceSelectorView = require("../components.views/navigation/MapSourceSelectorView");
const mapActions = require("../components.state/actions/mapActions");

const { connect } = require("react-redux");

const mapStateToProps = (state) => {
    return {
        sourceType: state.map.sourceType
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onInputChanged: (sourceType) => dispatch(mapActions.changeSource(sourceType))
    }
}

var MapSourceSelector = connect(
    mapStateToProps,
    mapDispatchToProps
)(MapSourceSelectorView);

module.exports = MapSourceSelector;