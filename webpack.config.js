const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const dotenv = require("dotenv-webpack");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        publicPath: "/",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: "vue-loader"
            },
            {
                test: /\.css$/,
                use: ["vue-style-loader", "css-loader"]
            },
            {
                test: /\.less$/,
                use: ["vue-style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.scss$/,
                use: ["vue-style-loader", "css-loader", "less-loader"]
            }
        ]
    },
    resolve: {
        alias: {
            vue$: "vue/dist/vue.esm.js" // 'vue/dist/vue.common.js' for webpack 1
        }
    },
    plugins: [new VueLoaderPlugin(), new dotenv()],
    mode: "none",
    stats: "errors-warnings",
    watch: true
};
