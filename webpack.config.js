module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-react"]
                }
            },
            {
                test: /\.css$/i,
                exclude: /node-modules/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    },
    watchOptions: {
        poll: true,
        ignored: /node_modules/,
    }
};
