const remote = require("../utilities/restClient");

const FeatureSetEntity = require("./entity.feature-set");
const FeatureEntity = require("./entity.feature");

const featureActions = require("../components.state/actions/featureActions");

// Manages interactions with remote Feature and FeatureSet entities.
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

        return remote(uri).then(
            (response) => {
                if (this._shouldDispatchActions && featureSetId === null) {
                    var sets = _.map(response.entity, (set) => new FeatureSetEntity(set));
                    this._dispatch(featureActions.setLocalFeatureSets(sets));
                }
                else if (this._shouldDispatchActions && featureSetId !== null) {
                    var set = new FeatureSetEntity(response.entity);
                    this._dispatch(featureActions.updateFeatureSet(set));
                }
            });
    }

    // Fetch remote Features async. Optional ID to fetch Features for a single target Feature.
    // Returns a promise to allow caller to chain actions.
    fetchRemoteFeatures (featureId = null) {
        var uri = featureId === null 
            ? '/api/features'
            : '/api/features/' + featureId;

        return remote(uri).then(
            (response) => {
                if (this._shouldDispatchActions) {
                    if(featureId === null) {
                        var featureEntities = _.map(response.entity, (f) => new FeatureEntity(f));
                        this._dispatch(featureActions.setLocalFeatures(featureEntities));
                    }
                    else {
                        this._dispatch(featureActions.setLocalFeature(new FeatureEntity(response.entity)));
                    }
                }
            });
    }

    // Update the remote Feature entities to their states as passed to this function.
    updateRemoteFeatures (features) {
        if (features.length === 0) {
            return;
        }

        var promises = [];

        _.each(features, (f) => {
            promises.push(remote({
                path: '/api/features/' + f.id,
                method: 'PUT',
                headers:{'Content-Type': 'application/json'},
                entity: f
            }));
        });

        return Promise.all(promises);
    }
}

module.exports = FeaturesManager;