'use strict'

var initialMapState = {
    sourceType: "sat"
};

const map = (state = initialMapState, action) => {
    if (action.type == "MAP_CHANGE_SOURCE") {
        return Object.assign({}, state, { sourceType: action.sourceType });
    }
    else {
        return state;
    }
}

// Combine all component specific reducers into a single top-level reducer function.
var reducers = Redux.combineReducers({
    map
});

module.exports = reducers;