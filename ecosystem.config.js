module.exports = {
  apps: [
    {
      name: "XRPLDatamartEngine",
      script: "./bin/www",
      // args: '',
      // exec_mode: "cluster",
      // instances:6,
      // autorestart: true,
      // watch: true,
      // max_memory_restart: '1G',
      env: {
        NODE_ENV: "dev",
      },
      env_test: {
        NODE_ENV: "test",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
