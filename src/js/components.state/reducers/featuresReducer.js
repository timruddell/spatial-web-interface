'use strict'

const { createReducer } = require("redux-act");
const a = require("../actions/featureActions");

var initialState = {
    // TODO: features should be stored as a single list in the state instead of against their set. Sets requiring 
    // filetered features can resolve their own features via a selector.

    //features: [],

    sets: [],

    // TODO: this should be an ID. Actual set can be deduced from state when required.
    selectedSet: null,
    selectedSetAction: null,

    loadRequired: true,

    // TODO: this should be a property of each feature. Create and work with Feature.js entities.
    modifiedFeatures: [],
    // Whether or not the application requires the modified features to be persisted.
    persistModified: false
}


const reducer = createReducer({
    [a.featureLoadRequired]: (state) => Object.assign({}, state, { loadRequired: true, sets: [] }),

    [a.flagFeatureLoadCompleted]: (state, featureSets) => Object.assign({}, state, { loadRequired: false, sets: featureSets }),

    [a.updateFeatureSet]: (state, featureSet) => {
        var setIndex = _.findIndex(state.sets, (s) => s.id === featureSet.id);

        return Object.assign({}, state, { 
            sets: [
                ...state.sets.slice(0, setIndex),
                featureSet,
                ...state.sets.slice(setIndex + 1)
            ]
        });
    },

    [a.toggleFeatureSetVisibility]: (state, featureSetId) => {
        return Object.assign({}, state, {
            sets: _.map(state.sets, (set) => {
                if (set.id === featureSetId) {
                    return Object.assign({}, set, { visible: !set.visible });
                }

                return set;
            })
        });
    },

    [a.setSelectedFeatureSet]: (state, featureSet) => Object.assign({}, state, { selectedSet: 
        featureSet, selectedSetAction: null }),

    [a.setFeatureSetActionState]: (state, actionState) => Object.assign({}, state, { selectedSetAction: actionState }),

    [a.flagFeatureAsModified]: (state, payload) => {
        // TODO: signs that your immutable state tree might not quite be optimally structured...

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
        if (!!payload.newGeometry) {
            var set = _.find(state.sets, (s) => s.id === state.selectedSet.id);
            var setIndex = _.findIndex(state.sets, (s) => s.id === state.selectedSet.id);
            var featureIndex = _.findIndex(set.features, (f) => f.id === payload.featureId);

            // TODO: good example of why featuers should be stored on the state independent of their feature sets.
            // Here we are having to modify the set as well as the feature being changed... whereas the feature change
            // should be independent of the set.
            return Object.assign({}, newState, { sets: [
                ...state.sets.slice(0, setIndex),
                Object.assign({}, set, { 
                    features: [
                        ...set.features.slice(0, featureIndex),
                        Object.assign({}, set.features[featureIndex], { geometry: payload.newGeometry }),
                        ...set.features.slice(featureIndex + 1)
                    ]}),
                ...state.sets.slice(setIndex + 1)
                ] });
        } else {
            return newState;
        }
    },

    [a.clearModifiedFeatures]: (state) => {
        if (state.modifiedFeatures.length > 0) {
            return Object.assign({}, state, { modifiedFeatures: [] });
        }
        else {
            return state;
        }
    },

    [a.flagModifiedFeaturesForUpdating]: (state, shouldPersist) => Object.assign({}, state, { persistModified: shouldPersist })

}, initialState);


module.exports = reducer;