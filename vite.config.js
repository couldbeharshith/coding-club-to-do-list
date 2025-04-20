const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

module.exports = defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true  // binds to 0.0.0.0 so network/localhost both work
  }
});
