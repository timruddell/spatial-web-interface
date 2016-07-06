class FeatureSetEntity {
    constructor (entity = {}) {
        var overrides = {
            // Parse the string style into an object.
            style: !!entity.style && entity.style.length > 0 ? JSON.parse(entity.style): null
        }

        var extensions = {
            // Whether or not this set has associated label styles.
            hasLabels: !!overrides.style && !!overrides.style.text,
            
            visible: true,
            labelsVisible: true
        }

        return Object.assign({}, entity, overrides, extensions);
    }
}

module.exports = FeatureSetEntity;