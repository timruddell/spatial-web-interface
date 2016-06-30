class FeatureSet {
    constructor (entity = {}, features = []) {
        var defaults = {
            visible: true,
            features: features
        }

        return _.defaults(entity, defaults);
    }
}

module.exports = FeatureSet;