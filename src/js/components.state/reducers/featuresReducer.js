'use strict'

const { createReducer } = require("redux-act");
const a = require("../actions/featureActions");

var initialState = {
    // Features available to the system.
    items: [],

    featureSets: [],
    selectedFeatureSetId: null,
    selectedFeatureSetAction: null,

    // TODO: this should be a property of each feature. Create and work with Feature.js entities.
    modifiedFeatures: []
}


const reducer = createReducer({

    [a.setLocalFeatureSets]: (state, featureSets) => Object.assign({}, state, { featureSets }),

    [a.setLocalFeatures]: (state, features) => Object.assign({}, state, { items: features }),

    [a.setLocalFeaturesForSet]: (state, payload) => 
        Object.assign({}, state, { items: [
            // Filter all items NOT in the FeatureSet
            ..._.filter(state.items, (f) => f.featureSetId !== payload.featureSetId),
            // Append the new features from the payload belonging to the set
            ..._.filter(payload.features, (f) => f.featureSetId === payload.featureSetId)
        ] }),

    [a.updateFeatureSet]: (state, featureSet) => {
        var setIndex = _.findIndex(state.featureSets, (s) => s.id === featureSet.id);

        return Object.assign({}, state, { 
            featureSets: [
                ...state.featureSets.slice(0, setIndex),
                featureSet,
                ...state.featureSets.slice(setIndex + 1)
            ]
        });
    },

    [a.toggleFeatureSetVisibility]: (state, featureSetId) => {
        return Object.assign({}, state, {
            featureSets: _.map(state.featureSets, (set) => {
                if (set.id === featureSetId) {
                    return Object.assign({}, set, { visible: !set.visible });
                }

                return set;
            })
        });
    },

    [a.setSelectedFeatureSet]: (state, featureSetId) => Object.assign({}, state, { selectedFeatureSetId: 
        featureSetId, selectedFeatureSetAction: null }),

    [a.setFeatureSetActionState]: (state, actionState) => Object.assign({}, state, { selectedFeatureSetAction: actionState }),

    [a.flagFeatureAsModified]: (state, payload) => {

        var newState = {};
        // Only change state if the feature is not already flagged as being modified.
        if (_.indexOf(state.modifiedFeatures, payload.featureId) === -1) {
            newState = Object.assign({}, state, {
                // Concatenate the new Feature ID.
                modifiedFeatures: [
                    ...state.modifiedFeatures,
                    payload.featureId
                ]
            });
        } else {
            newState = state;
        }

        // Update the feature state's geometry.
        var featureIndex = _.findIndex(state.items, (f) => f.id === payload.featureId);

        newState = Object.assign({}, newState, { 
            items: [
                ...state.items.slice(0, featureIndex),
                Object.assign({}, state.items[featureIndex], { geometry: payload.newGeometry }),
                ...state.items.slice(featureIndex + 1)
            ]});

        return newState;
    },

    [a.clearModifiedFeatures]: (state) => {
        if (state.modifiedFeatures.length > 0) {
            return Object.assign({}, state, { modifiedFeatures: [] });
        }
        else {
            return state;
        }
    }

}, initialState);


module.exports = reducer;