'use strict'

const { createReducer } = require("redux-act");
const a = require("../actions/featureActions");

var initialState = {
    // Features available to the system.
    items: [],
    isEditingFeature: false,

    featureSets: [],
    selectedFeatureSetId: null,

    // TODO: this should be a property of each feature. Create and work with Feature.js entities.
    modifiedFeatures: []
}


const reducer = createReducer({

    [a.setLocalFeatureSets]: (state, featureSets) => Object.assign({}, state, { featureSets }),

    [a.setLocalFeatures]: (state, features) => Object.assign({}, state, { items: features }),
    [a.setLocalFeature]: (state, feature) => {
        var featureIndex = _.findIndex(state.items, (f) => f.id === feature.id);

        if (featureIndex === -1) {
            return Object.assign({}, state, { items: [ ...state.items, feature ] });
        }
        else {
            return Object.assign({}, state, { items: [
                ...state.items.slice(0, featureIndex),
                feature,
                ...state.items.slice(featureIndex + 1)
            ]});
        }
    },

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
                    return Object.assign({}, set, { isVisible: !set.isVisible });
                }

                return set;
            })
        });
    },

    [a.setFeatureSetLabelVisible]: (state, payload) => {
        return Object.assign({}, state, {
            featureSets: _.map(state.featureSets, (set) => {
                if (set.id === payload.featureSetId) {
                    return Object.assign({}, set, { labelsVisible: payload.visible });
                }

                return set;
            })
        });
    },

    [a.setSelectedFeatureSet]: (state, featureSetId) => Object.assign({}, state, { selectedFeatureSetId: featureSetId }),

    [a.flagIsEditingFeature]: (state, isEditingFeature) => Object.assign({}, state, { isEditingFeature }),

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

    [a.flagFeatureAsSelected]: (state, { featureId, isSelected }) => {
        var featureIndex = _.findIndex(state.items, (f) => f.id === featureId)

        return Object.assign({}, state, { items: [
            ...state.items.slice(0, featureIndex),
            Object.assign({}, state.items[featureIndex], { isSelected }),
            ...state.items.slice(featureIndex + 1)
        ] });
    },

    [a.clearFeatureSelectedFlags]: (state) => {
        return Object.assign({}, state, { items: [
            ..._.map(state.items, (f) => Object.assign({}, f, { isSelected: false }))
        ]});
    },

    [a.flagFeatureSetHover]: (state, { featureSetId, isHoverContext }) => {
        var featureSetIndex = _.findIndex(state.featureSets, (fs) => fs.id === featureSetId)

        return Object.assign({}, state, { featureSets: [
            ...state.featureSets.slice(0, featureSetIndex),
            Object.assign({}, state.featureSets[featureSetIndex], { isHoverContext }),
            ...state.featureSets.slice(featureSetIndex + 1)
        ] });
    }

}, initialState);


module.exports = reducer;