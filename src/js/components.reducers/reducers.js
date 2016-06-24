'use strict'

// TODO: putting initial states here doesn't seem like a good idea. How do we initialize a state from an API call?
var initialMapState = {
    sourceType: "sat",
    requiresFeatureLoad: true
};

const map = (state = initialMapState, action) => {
    switch (action.type) {
        case "MAP_CHANGE_SOURCE":
            return Object.assign({}, state, { sourceType: action.sourceType });

        case "MAP_FEATURES_LOAD":
            return Object.assign({}, state, { requiresFeatureLoad: true });

        case "MAP_FEATURES_LOADED":
            return Object.assign({}, state, { requiresFeatureLoad: false });

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
    projects,
    layout
});

module.exports = reducers;