const classnames = require("classnames");

const FeatureSet = require("../../../components.content/detail/FeatureSet");

// Detail pane tab for FeatureSet information.
const FeatureSetDetailPaneView = ({
    featureSets
}) => {
    return (
        <div>
        <h4 style={{ marginBottom: "20px" }}>Feature sets</h4>
        <ul>
        {
            _.map(_.sortBy(featureSets, "renderOrder").reverse(), (set) => {
                return (
                    <li key={set.id}>
                        <FeatureSet featureSet={set} showChildFeatures={false} />
                    </li>
                );
            })
        }
        </ul>
        </div>
    );
}

module.exports = FeatureSetDetailPaneView;