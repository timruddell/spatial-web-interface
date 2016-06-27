'use strict'

// TODO: putting initial states here doesn't seem like a good idea.

var initialMapState = {
    sourceType: "sat"
}

const map = (state = initialMapState, action) => {
    switch (action.type) {
        case "MAP_CHANGE_SOURCE":
            return Object.assign({}, state, { sourceType: action.sourceType });

        default:
        	return state;
    }
}

var initialFeaturesState = {
    sets: [],
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
            })

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