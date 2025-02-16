const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: {
            output: {
                filename: "js/[name].js",
            },
            optimization: {
                runtimeChunk: false,
                splitChunks: {
                    chunks(chunk) {
                        return false;
                    },
                },
            },
        },
        plugins: [
            // Add Lodash noConflict configuration
            new webpack.ProvidePlugin({
                _: ['lodash', 'noConflict']
            })
        ]
    },
    plugins: [
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig }) => {
                    // Find MiniCssExtractPlugin in the plugins array
                    const cssPlugin = webpackConfig.plugins.find(
                        plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
                    );

                    // Only modify if plugin exists
                    if (cssPlugin) {
                        cssPlugin.options.filename = "css/[name].css";
                    }

                    return webpackConfig;
                },
            },
            options: {},
        },
    ],
};
