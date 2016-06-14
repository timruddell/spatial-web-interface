'use strict'

// TODO: putting initial states here doesn't seem like a good idea. How do we initialize a state from an API call?
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

var initialProjectsState = {
    // Dummy data for display. Will come from webservices once available.
    items: [
        {
            id: 103923,
            name: "Project one group",
            type: "group",
            children: [
                {
                    id: 23020,
                    name: "Project one - SW plot",
                    type: "project",
                    description: "SW plot of Project one. Area used for site testing and as a placeholder."
                },
                {
                    id: 93983,
                    name: "Project one - East plot",
                    type: "project",
                    description: "E plot of Project one. Area used for site testing and as a placeholder."
                }
            ]
        },
        {
            id: 721230,
            name: "Project two",
            type: "project",
            description: "Project two combined plot. Area used for site testing and as a placeholder."
        },
        {
            id: 339238,
            name: "Project three",
            type: "project",
            description: "Project three combined plot. Area used for site testing and as a placeholder."
        }
    ]
}

const projects = (state = initialProjectsState, action) => {
    return state;
}

// Combine all component specific reducers into a single top-level reducer function.
var reducers = Redux.combineReducers({
    map,
    projects
});

module.exports = reducers;