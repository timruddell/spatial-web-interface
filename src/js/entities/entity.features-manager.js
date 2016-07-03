const fetchRemote = require("../utilities/restClient");

const FeatureSet = require("./FeatureSet");
const featureActions = require("../components.state/actions/featureActions");

class FeaturesManager {

    // By passing a dispatch function to this class, all calls to fetch remote
    // objects will dispatch actions. To avoid dispatching actions, pass null. 
    constructor (dispatch) {
        this._shouldDispatchActions = !!dispatch; 
        this._dispatch = dispatch; 
    }

    // Fetch remote FeatureSets async. Optional ID to fetch a single target FeatureSet.
    // Returns a promise to allow caller to chain actions.
    fetchRemoteFeatureSets (featureSetId = null) {
        var uri = featureSetId === null 
            ? '/api/feature-sets'
            : '/api/feature-sets/' + featureSetId;

        return fetchRemote(uri).then(
            (response) => {
                if (this._shouldDispatchActions && featureSetId === null) {
                    var sets = _.map(response.entity, (set) => new FeatureSet(set));
                    this._dispatch(featureActions.flagFeatureLoadCompleted(sets));
                }
                else if (this._shouldDispatchActions && featureSetId !== null) {
                    var set = new FeatureSet(response.entity);
                    this._dispatch(featureActions.updateFeatureSet(set));
                }
            });
    }

    // Fetch remote Features async. Optional ID to fetch Features for a single target FeatureSet.
    // Returns a promise to allow caller to chain actions.
    fetchRemoteFeatures (featureSetId = null) {
        var uri = featureSetId === null 
            ? '/api/features'
            : '/api/feature-sets/' + featureSetId + '/features';

        return fetchRemote(uri).then(
            (response) => {
                if (this._shouldDispatchActions && featureSetId === null) {
                    this._dispatch(featureActions.setLocalFeatures(response.entity));
                }
                else if (this._shouldDispatchActions && featureSetId !== null) {
                    this._dispatch(featureActions.setLocalFeaturesForSet(featureSetId, response.entity));
                }
            });
    }
}

module.exports = FeaturesManager;