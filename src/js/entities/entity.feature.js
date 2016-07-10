class FeatureEntity {
    constructor (entity = {}) {
        var overrides = {
            // Parse the string data.
            data: !!entity.data && entity.data.length > 0 ? JSON.parse(entity.data): null
        }

        var extensions = {
            isSelected: false
        }

        return Object.assign({}, entity, overrides, extensions);
    }
}

module.exports = FeatureEntity;