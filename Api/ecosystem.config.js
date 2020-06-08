module.exports = {
    apps: [{
      script: "server.js",
      watch: true,
      ignore_watch : ["node_modules", "uploads", "sessions"],
      watch_options: {
        "followSymlinks": false
      }
    }]
  }