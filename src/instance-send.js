'use strict';

const { tasks, logger } = require('./helpers');
const config = require('./config')();

module.exports = async ({ key, tag = 'default' }) => {
  // Validate the key and block instance
  const blockInstances = config.block_instance[key];
  if (!blockInstances) {
    const availableKeys = Object.keys(config.block_instance).join(', ');
    logger.warn(`*** Block key [${key}] not found in configuration. ***`);
    logger.hint(`Available keys: [${availableKeys}]`);
    return;
  }

  // Resolve the parent tag
  const parentTag = tag.includes(':') ? tag.split(':').slice(0, -1).join(':') : 'default' || 'root';

  console.log(parentTag);
  const parentBlockId = config.blocks.find(block => block.key === key).parent_id;

  // Implies first block in wf
  if (parentBlockId) {

    console.log(parentBlockId);
    const parentBlockKey = config.blocks.find(block => block.id === parentBlockId).key;

    console.log(config.block_instance[parentBlockKey])

    const parentInstanceId = parentTag ? config.block_instance[parentBlockKey][parentTag] : null;

    if (parentTag && !parentInstanceId) {
      logger.warn(`*** Parent tag [${parentTag}] not found for key [${key}]. ***`);
      logger.hint(`Ensure the parent tag exists before adding a child instance.`);
      return;
    }
  }


  // Resolve the block instance ID
  const blockInstanceId = blockInstances[tag] || blockInstances.default || blockInstances.root;

  if (!blockInstanceId) {
    logger.warn(`*** No block instance found for tag [${tag}] under key [${key}]. ***`);
    logger.hint('Specify a valid tag or create a default instance.');
    return;
  }

  // Fetch block metadata and user
  const block = config.blocks.find((b) => b.key === key);
  if (!block) {
    logger.warn(`*** Metadata for block key [${key}] not found in configuration. ***`);
    return;
  }

  const actor = Object.values(config.users).find((user) => user.role_id === block.role_id);

  if (!actor) {
    logger.warn(`*** No actor found for block key [${key}]. ***`);
    return;
  }

  // Prepare the payload
  const payload = block.schema_id
    ? config.importSchema(key)
    : { approve: 'approved' };

  if (!payload) {
    logger.warn(`*** Missing payload for block key [${key}] ***`);
    logger.info('Generate or edit the schema using the configuration files.');
    return;
  }

  // Submit the payload
  try {
    const token = await config.reauthenticateActor(actor.is_owner ? 'owner' : actor.role);
    const response = await tasks.instance(token).send({
      workflow_block_instance_id: blockInstanceId,
      payload,
    });

    if (!response) {
      logger.warn('*** Unable to process block instance. ***');
      return;
    }

    logger.info('Block instance processed successfully.');
    console.log(response);

    // Add the next block instance if available
    if (response.child_id) {
      const nextBlock = config.blocks.find((b) => b.id === response.child_id);
      if (!nextBlock) {
        logger.warn('*** Unable to find metadata for the next block instance. ***');
        return;
      }

      const nextInstanceId = response.next_block_instance_id;

      // Add the next block instance to the configuration
      config.update(`block_instance.${nextBlock.key}.${tag}`, nextInstanceId);
      config.update(`block_instance.${key}.${tag}`, response.id);

      logger.info(`Next block instance added: [key: ${nextBlock.key}, tag: ${tag}]`);
    }
  } catch (error) {
    logger.error('Error processing block instance:', error.message);
  }
};
