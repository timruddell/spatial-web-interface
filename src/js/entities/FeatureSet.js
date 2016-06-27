class FeatureSet {
    constructor (entity = {}) {
        var defaults = {
            visible: true
        }

        return _.defaults(entity, defaults);
    }
}

module.exports = FeatureSet;