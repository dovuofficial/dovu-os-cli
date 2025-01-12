'use strict';

const fs = require('fs');
const path = require('path');

// Path to the configuration file
const CONFIG_FILE = path.resolve(__dirname, 'artefacts/config.json');

// Config gets updated in realtime.
var config = {
  workflow_key: 'elv_workflow',
  users: {
    standard_registry: {},
    supplier: {},
    verifier: {},
  },
};

// Load the configuration from file
const loadConfig = () => {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const fileData = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      config = { ...config, ...fileData }; // Merge with default structure to ensure missing keys are filled
      console.log('Configuration loaded:', config);
    } catch (err) {
      console.error('Error loading configuration file:', err);
    }
  } else {
    saveConfig(); // Save default config if file doesn't exist
  }
};

// Save the configuration to file
const saveConfig = () => {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    console.log('Configuration saved to file.');
  } catch (err) {
    console.error('Error saving configuration file:', err);
  }
};

// Update configuration at runtime
const update = (path, value) => {
  const keys = path.split('.');
  let current = config;

  while (keys.length > 1) {
    const key = keys.shift();
    if (!current[key]) current[key] = {};
    current = current[key];
  }
  current[keys[0]] = value;
  // config[keys[0]] = value;

  saveConfig(); // Persist the updated configuration
};

// Expose configuration and utilities
module.exports = () => {

  loadConfig();

  return {
    ...config, // Export the default configuration structure
    update,
  }
};
