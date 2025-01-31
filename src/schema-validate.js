const { tasks, logger } = require('./helpers');
const Table = require("cli-table3");
const config = require('./config')();

/**
 * Module to validate and/or generate schema specifications for a given key.
 * @param {Object} options - The options object.
 * @param {string} options.key - The key representing the schema to validate or generate.
 * @param {boolean} options.generate - Flag to indicate schema generation mode.
 * @param {boolean} options.force - Flag to overwrite existing writable schema files.
 */
module.exports = async ({ key, generate = false, force = false }) => {
  const schema = config?.schema?.[key];

  if (!schema) {
    const availableSchemas = Object.keys(config?.schema || {});
    logger.warn(`*** Unable to find schema for key: [${key}] ***`);
    if (availableSchemas.length > 0) {
      logger.hint(`Available schemas: [${availableSchemas.join(', ')}]`);
    } else {
      logger.hint('No schemas available in the configuration.');
    }
    return;
  }

  if (generate) {
    logger.info(`*** Generating schema specification for key: [${key}] ***`);
  }

  // Load payload from context or use an empty object for generation
  const payload = generate ? {} : config.importSchema(key) || {};

  // Validate schema using tasks
  const validationRes = await tasks.schema().validate({
    schemaId: schema[0].schema_id,
    payload,
  });

  // Handle generation mode
  if (generate || force || !!!Object.keys(payload).length) {
    const requiredKeys = Object.keys(validationRes?.data || {});
    config.addSchemaToContext(key, requiredKeys, force);
    logger.info(`*** Schema specification for [${key}] generated successfully ***`);
    return;
  }

  if (validationRes) {
    // Handle validation result
    logger.info('*** Schema validation completed successfully ***');
    logger.info(`Validation result:`);

    listValidationTableView(validationRes.data)

    return
  }

  logger.hint(`No errors found in validation for [${key}]`);

};

const listValidationTableView = (validation_errs) => {

  const table = new Table();

  Object.keys(validation_errs).forEach((key) => {
    table.push([ key, JSON.stringify(validation_errs[key]) ]);
  })

  console.info(table.toString());
}
