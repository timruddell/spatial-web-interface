'use strict'

const { createSelector } = require("reselect");
const featureActions = require("../../components.state/actions/featureActions");

// Handles flushing selection interactions to the application state.
// Avoids rendering or changing feature styles (handled by another trigger from state).
const buildSelector = (map, dispatch) => {

    // Interaction for actioning selected features to the app state.
    var selectToState = new ol.interaction.Select();

    selectToState.on("select", (event) => {
        // Clear all selected features.
        dispatch(featureActions.clearFeatureSelectedFlags());

        var feature = _.first(event.selected);
        if (feature) {
            // Set a blank style.
            feature.setStyle([]);
            dispatch(featureActions.flagFeatureAsSelected(feature.getId(), true));
        }
    });

    map.getInteractions().push(selectToState);

    //
    // Build and return selector.
    //
    return createSelector([
        (state) => state.features.isEditingFeature
    ], 
    (isEditingFeature) => {
        // If the UI context is currently editing a feature, don't allow selection changes.
        selectToState.setActive(!isEditingFeature);
    });
}

module.exports = buildSelector;
 