'use strict'

// TODO: putting initial states here doesn't seem like a good idea.

var initialMapState = {
    sourceType: "sat",
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
    sets: [],
    selectedSet: null,
    selectedSetAction: null,

    loadRequired: true
}

const features = (state = initialFeaturesState, action) => {
    switch (action.type) {
        case "LOAD_FEATURES_REQUIRED":
            return Object.assign({}, state, { loadRequired: true, sets: [] });

        case "LOAD_FEATURES_DONE":
            return Object.assign({}, state, { loadRequired: false, sets: action.sets });

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