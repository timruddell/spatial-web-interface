'use strict'

// TODO: putting initial states here doesn't seem like a good idea.
// TODO: rethink action names, and consolidate actions into separate files/functions.

var initialMapState = {
    sourceType: "AerialWithLabels",
    view: {
        fittedExtent: null,
        fittedFeatureSetId: null
    }
}

const map = (state = initialMapState, action) => {
    switch (action.type) {
        case "MAP_CHANGE_SOURCE":
            return Object.assign({}, state, { sourceType: action.sourceType });

        // Fitting actions nullify all other fitted values. Fitted actions are chained until they 
        // are reduced to a fitted extent, i.e. MAP_VIEW_FIT_FEATURESET -> MAP_VIEW_FIT_EXTENT.
        // TODO: Dont' need to chain these together. Have a single selector that takes several different
        // types of objects and resolves the extent to be fit. Have one action MAP_VIEW_FIT_ITEM.
        case "MAP_VIEW_FIT_EXTENT":
            return Object.assign({}, state, 
                { view: Object.assign({}, initialMapState.view, { fittedExtent: action.value }) });

        case "MAP_VIEW_FIT_FEATURESET":
            return Object.assign({}, state, 
                { view: Object.assign({}, initialMapState.view, { fittedFeatureSetId: action.value }) });

        default:
        	return state;
    }
}

var initialFeaturesState = {
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

const features = (state = initialFeaturesState, action) => {
    switch (action.type) {
        case "LOAD_FEATURES_REQUIRED":
            return Object.assign({}, state, { loadRequired: true, sets: [] });

        case "LOAD_FEATURES_DONE":
            return Object.assign({}, state, { loadRequired: false, sets: action.sets });

        case "UPDATE_FEATURE_SET":
            var setIndex = _.findIndex(state.sets, (s) => s.id === action.value.id);

            return Object.assign({}, state, { 
                sets: [
                    ...state.sets.slice(0, setIndex),
                    action.value,
                    ...state.sets.slice(setIndex + 1)
                ]
            });

        case "TOGGLE_FEATURESET_VISIBILITY":
            return Object.assign({}, state, {
                sets: _.map(state.sets, (set) => {
                    if (set.id === action.id) {
                        return Object.assign({}, set, { visible: !set.visible });
                    }

                    return set;
                })
            });

        case "FEATURES_SET_SELECTED_SET":
            return Object.assign({}, state, { selectedSet: action.value, selectedSetAction: null });

        case "FEATURES_SET_FEATURESET_SELECTED_ACTION":
            return Object.assign({}, state, { selectedSetAction: action.value });

        // TODO: rewrite this reducer once the state tree is tidied up (I.e. sets/features separated).
        case  "FEATURES_FLAG_MODIFIED_FEATURE":

            // TODO: signs that your immutable state tree might not quite be optimally structured...

            var newState = {};
            // Only change state if the feature is not already flagged as being modified.
            if (_.indexOf(state.modifiedFeatures, action.value) === -1) {
                newState = Object.assign({}, state, {
                    // Concatenate the new Feature ID.
                    modifiedFeatures: [
                        ...state.modifiedFeatures,
                        action.value
                    ]
                });
            } else {
                newState = state;
            }

            // Update the feature state's geometry.
            if (!!action.geometry) {
                var set = _.find(state.sets, (s) => s.id === state.selectedSet.id);
                var setIndex = _.findIndex(state.sets, (s) => s.id === state.selectedSet.id);
                var featureIndex = _.findIndex(set.features, (f) => f.id === action.value);

                // TODO: good example of why featuers should be stored on the state independent of their feature sets.
                // Here we are having to modify the set as well as the feature being changed... whereas the feature change
                // should be independent of the set.
                return Object.assign({}, newState, { sets: [
                    ...state.sets.slice(0, setIndex),
                    Object.assign({}, set, { 
                        features: [
                            ...set.features.slice(0, featureIndex),
                            Object.assign({}, set.features[featureIndex], { geometry: action.geometry }),
                            ...set.features.slice(featureIndex + 1)
                        ]}),
                    ...state.sets.slice(setIndex + 1)
                    ] });
            } else {
                return newState;
            }

        case "FEATURES_CLEAR_MODIFIED":
            if (state.modifiedFeatures.length > 0) {
                return Object.assign({}, state, { modifiedFeatures: [] });
            }
            else {
                return state;
            }

        case "FEATURES_SET_PERSIST_MODIFIED":
            return Object.assign({}, state, { persistModified: action.value });

        default:
        	return state;
    }
}

var initialProjectsState = {
    items: [],
    selected: null
}

const projects = (state = initialProjectsState, action) => {
    switch (action.type) {
        case "PROJECT_LOCAL_SET":
            return Object.assign({}, state, { items: action.items });
        case "PROJECT_SELECTION_CHANGED":
            return Object.assign({}, state, { selected: action.value });
        default:
            return state;
    }
}

var initialLayoutState = {
    detailPaneIsOpen: false
}

const layout = (state = initialLayoutState, action) => {
    switch (action.type) {
        case "LAYOUT_DETAIL-PANE_SET_OPEN":
            return Object.assign({}, state, { detailPaneIsOpen: action.value })
        default:
            return state;
    }
}

// Combine all component specific reducers into a single top-level reducer function.
var reducers = Redux.combineReducers({
    map,
    features,
    projects,
    layout
});

module.exports = reducers;