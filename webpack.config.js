module.exports = {
    entry: "./src/js/components/Root.jsx",
    output: {
        filename: "bundle.js",
        publicPath: "http://localhost:8090/js"
    },
    module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                loader: "jsx-loader?insertPragma=React.DOM&harmony"
            }
        ]
    },
    externals: {
        // Exclude these packages from being bundled, and instead access them through the global var.
        "react": "React",
        "react-dom": "ReactDOM",
        "redux": "Redux"
    },
    resolve: {
        extensions: ["", ".js", ".jsx"]
    }
}