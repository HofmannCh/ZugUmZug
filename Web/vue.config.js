module.exports = {
    outputDir: "dist",
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "@/custom.sass"`
            }
        }
    },
    configureWebpack: {
        devtool: 'source-map',
    }
}