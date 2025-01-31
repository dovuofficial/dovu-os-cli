const {
  tasks,
  logger
} = require('./helpers');

const config = require('./config')();

module.exports = async ({
  force = false,
}) => {

  const { instance, blueprint, users } = config;

  if (! blueprint ) {
    logger.warn('*** Unable to find selected blueprint in configuration context ***')
    logger.hint('Run "dovu help blueprints" for more information')
    return
  }

  const owner = users.owner

  if (! owner) {
    logger.warn('*** Unable to find a user that can be an owner of the workflow ***')
    logger.hint('Run "dovu help create-user" for more information.');
    logger.info('Or: to generate a set of users use');
    logger.hint('"make create-all-users"');

    return;
  }

  if (!! Object.keys(instance).length && ! force) {
    logger.warn('*** Instance has already been published, unable to republish blueprint with force***')
    logger.info('To force a new instance of the blueprint');
    logger.hint('"dovu publish-blueprint -f"');

    return
  }

  const token = await config.reauthenticateActor('owner')

  const instancePublished = await tasks.workflows(token).publish(blueprint)

  config.update('instance', instancePublished.workflow_instance_id);

  logger.info('Started publishing of blueprint use the command below to get a status:');
  logger.hint('"dovu instance-status"');

  config.update('block_instance', {});
  config.update(`block_instance.${instancePublished.workflow_block.key}.root`, instancePublished.id);


  logger.info('Removing attached status for all users');
  Object.keys(config.users).forEach(role =>  config.update(`users.${role}.attached`, false))

};
