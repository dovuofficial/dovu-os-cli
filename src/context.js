const fs = require('fs');
const path = require('path');
const { logger } = require('./helpers');

const config = require('./config')();

// Paths and constants
const CONTEXT_DIR = path.resolve(__dirname, '../artefacts/context');

module.exports = async ({ name }) => {
  if (!name) {
    logger.error('Context name is required. Please specify a valid context name.');
    return;
  }

  const contextFolder = path.join(CONTEXT_DIR, name);
  const contextFile = path.join(contextFolder, 'config.json');

  // Ensure context folder exists
  if (!fs.existsSync(CONTEXT_DIR)) {
    fs.mkdirSync(CONTEXT_DIR, { recursive: true });
    logger.info('Created base context directory.');
  }

  if (fs.existsSync(contextFile)) {
    try {
      // Load existing context configuration
      const contextData = JSON.parse(fs.readFileSync(contextFile, 'utf-8'));

      // Update the root-level configuration with the loaded context
      config.update('context.name', name);
      Object.entries(contextData).forEach(([key, value]) => {
        if (key !== 'name') {
          config.update(key, value);
        }
      });

      logger.info(`Switched to existing context: ${name}`);
    } catch (err) {
      logger.error(`Error loading context configuration: ${err.message}`);
    }
  } else {
    // Create a new context configuration
    const newContext = {
      workflow_key: null,
      users: {
        owner: {},
        supplier: {},
        verifier: {},
      },
      blueprint: {},
      blocks: [],
      schema: {},
      instance: {},
      status: {},
    };

    // Ensure the context folder exists
    fs.mkdirSync(contextFolder, { recursive: true });
    fs.writeFileSync(contextFile, JSON.stringify(newContext, null, 2), 'utf-8');

    config.update('context.name', name);

    logger.info(`Created and switched to new context: ${name}`);


    logger.warn("*** CLEARING ALL CURRENT BLOCKS, SCHEMAS, STATUS AND OTHER STATE ***")

    config.update('status', {})
    config.update('blocks', [])
    config.update('blueprint', {})
    config.update('instance', {})
    config.update('schema', {})
  }
};
