const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require("webpack");
const path = require("path");

module.exports = {
    optimization: {
        minimize: true,
    },
    entry: {
        login: './src/admin-site/login/index.jsx',
        main: './src/admin-site/main/index.jsx',
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/",
        filename: "[name].entry.js"
    },
    node: {
        __dirname: false,   // if you don't put this is, __dirname
        __filename: false,  // and __filename return blank or /
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: ["/node_modules", "/server"],
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {minimize: true}
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    devServer: {
        historyApiFallback: true
    },
    resolve: {
        extensions: ['.js', '.jsx', '.html', '.css']
    },
    plugins: [
        new HtmlWebPackPlugin({
            inject: true,
            chunks: ["login"],
            template: './src/admin-site/login/index.html',
            filename: './login.html'
        }),
        new HtmlWebPackPlugin({
            inject: true,
            chunks: ["main"],
            template: './src/admin-site/main/index.html',
            filename: './main.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new webpack.DefinePlugin({
            SERVER_URL: JSON.stringify(process.env.SERVER_URL)
        })
    ]
};
