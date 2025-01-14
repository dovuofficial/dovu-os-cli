'use strict';

const fs = require('fs');
const path = require('path');

// Paths and constants
const CONFIG_FILE = path.resolve(__dirname, 'artefacts/config.json');
const ARTEFACTS_DIR = path.resolve(__dirname, 'artefacts');
const CONTEXT_DIR = path.resolve(ARTEFACTS_DIR, 'context');
const DEFAULT_CONTEXT = 'default';

// Default config structure
var config = {
  context: {
    name: null,
  },
  workflow_key: 'elv_workflow',
  users: {
    standard_registry: {},
    supplier: {},
    verifier: {},
  },
};

// Ensure `artefacts` and `context` directories exist
const ensureDirectories = () => {
  if (!fs.existsSync(ARTEFACTS_DIR)) {
    fs.mkdirSync(ARTEFACTS_DIR, { recursive: true });
    console.log('Created artefacts directory.');
  }

  if (!fs.existsSync(CONTEXT_DIR)) {
    fs.mkdirSync(CONTEXT_DIR, { recursive: true });
    console.log('Created context directory.');
  }
};

// Load the global configuration
const loadConfig = () => {
  ensureDirectories();

  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const fileData = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      config = { ...config, ...fileData }; // Merge with default structure
      console.log('Configuration loaded:', config);
    } catch (err) {
      console.error('Error loading configuration file:', err);
    }
  } else {
    saveConfig(); // Save default config if file doesn't exist
  }
};

// Check or create a context folder and files
const checkContext = () => {
  const contextName = config.context.name || DEFAULT_CONTEXT;
  const contextFolder = path.join(CONTEXT_DIR, contextName);

  if (!fs.existsSync(contextFolder)) {
    fs.mkdirSync(contextFolder, { recursive: true });
    console.log(`Created context folder: ${contextFolder}`);
  }

  const contextFile = path.join(contextFolder, 'config.json');

  fs.writeFileSync(contextFile, JSON.stringify(config, null, 2), 'utf-8');
};

// Save the global configuration to file
const saveConfig = (file = CONFIG_FILE) => {
  try {
    fs.writeFileSync(file, JSON.stringify(config, null, 2), 'utf-8');
    console.log('Configuration saved to file.');
    checkContext();
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

  saveConfig(); // Persist the updated configuration
};

// Pull a schema into the context folder
const addSchemaToContext = (schemaName, content) => {
  const contextName = config.context.name || DEFAULT_CONTEXT;
  const contextFolder = path.join(CONTEXT_DIR, contextName);

  if (!fs.existsSync(contextFolder)) {
    console.error('Context folder does not exist. Please set the context first.');
    return;
  }

  const schemaFile = path.join(contextFolder, `${schemaName}.json`);
  try {
    fs.writeFileSync(schemaFile, JSON.stringify(content, null, 2), 'utf-8');
    console.log(`Schema file added: ${schemaFile}`);
  } catch (err) {
    console.error('Error writing schema file:', err);
  }
};

// Expose configuration and utilities
module.exports = () => {
  loadConfig();

  return {
    ...config, // Export the default configuration structure
    update,
    addSchemaToContext, // Utility to add schema files to a context
  };
};
