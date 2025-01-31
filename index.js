#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .name('dovu')
  .description('A command-line interface (CLI) for managing workflows, users, and data within the DOVU OS ecosystem. Simplify interactions with the API through streamlined commands for context management, workflow publishing, and data processing.')
  .version('0.1.0');

// Command definition and flow for the creation of assets

// Step 1: Set up a configuration context
program
  .command('set-context')
  .description('Set or switch to a context by name. Creates a new context if it does not exist.')
  .requiredOption('-n, --name <name>', 'Name of the context to set or switch to')
  .action((options) => require('./src/context')(options));


// 2. Create a new user that can be an actor in the creation of ecological assets
program
  .command('create-user')
  .description('Create a new user that can be assigned to the ecological workflow')
  .option('-o,--owner', 'Mark the user as an owner of the configuration and workflow management')
  .requiredOption('-r, --role <role>', 'Role of the user being registered for workflow processing')
  .action((options) => require('./src/create-user')(options));

// 3. List the keys of all available workflow blueprints
program
  .command('blueprints')
  .description('List blueprint keys that exist in the system, so one can be used.')
  .option('-k,--key <key>', 'Select the blueprint key to be stored in configuration, and store all related blocks and schema information.')
  .action((options) => require('./src/blueprint')(options));

// 4. Publish a new workflow instance from a blueprint that has been selected
program
  .command('publish')
  .description('Publish a new instance of the selected blueprint')
  .option('-f, --force', 'Force overwrite of current policy instance, if it exists.')
  .action((options) => require('./src/publish-blueprint')(options));

// 4. Publish a new workflow instance from a blueprint that has been selected
program
  .command('status')
  .description('Return the current status of the workflow instance')
  .action((options) => require('./src/instance-status')(options));

// 4. Attach a user by role into a workflow instance, like a supplier or a verifier
program
  .command('attach')
  .description('Attach a user by role into a workflow instance, like a supplier or a verifier.')
  .requiredOption('-r, --role <role>', 'Role of the user being registered for workflow processing, should be stored previously within configuration.')
  .action((options) => require('./src/instance-attach')(options))

// 5. [WIP] Validate data to be sent to a particular block within a workflow (based on key)
program
  .command('validate')
  .description('Validate that data will conform to the requirements of a block, this will not persist nor effect an instance, but can be used as a sandbox to ensure valid requirements.')
  .requiredOption('-k, --key <schema>', 'Target a key that relates to the schemas you have in your configuration')
  .option('-g, --generate', 'Generates and stores a JSON document that has prefilled required schema values for a block.')
  .option('-f, --force', 'Force complete overwrite of new schemas and previously filled data for new processing')
  .action((options) => require('./src/schema-validate')(options));

// 5. [HIGHEST Priority] Send data or approvals to be sent to a particular block within a workflow
program
  .command('send')
  .description('Send validated data to a workflow instance, the correct role will be automatically picked up, as well as a data source')
  .requiredOption('-k, --key <schema>', 'Target a key that relates to the schemas you have in your configuration')
  .option('-t, --tag <tag>', 'Append a tag to the new data block instance that will be generated after sending data')
  .action((options) => require('./src/instance-send')(options));

program.parse(process.argv);
