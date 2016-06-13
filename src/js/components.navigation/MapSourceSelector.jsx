/** @jsx React.DOM */

'use strict'

var MapSourceSelectorView = require("../components.views/navigation/MapSourceSelectorView");

const { connect } = require("react-redux");

const mapStateToProps = (state) => {
    return {
        sourceType: state.map.sourceType
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onInputChanged: (sourceType) => {
            dispatch({
                type: "MAP_CHANGE_SOURCE",
                sourceType: sourceType
            });
        }
    }
}

var MapSourceSelector = connect(
    mapStateToProps,
    mapDispatchToProps
)(MapSourceSelectorView);

module.exports = MapSourceSelector;