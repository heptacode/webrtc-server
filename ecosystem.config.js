module.exports = {
  apps: [
    {
      name: "webrtc-server",
      script: "dist/app.js",
      autorestart: true,
      max_memory_restart: "2G",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
