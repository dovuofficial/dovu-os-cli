const {
  tasks,
  logger
} = require('./helpers');

// TODO: middleware for checking state of conf
const config = require('./config')();

module.exports = async () => {

  const { instance, blueprint, users } = config;

  if (! instance || ! blueprint) {
    logger.warn('*** Unable to find an instance to check.***')
    logger.hint('Run "dovu help publish-blueprint" for more information')
    return
  }

  const owner = users.owner

  if (! owner) {
    logger.warn('*** Unable to find a user that can be an owner of the workflow ***')
    logger.hint('Run "dovu help create-user" for more information.');
    logger.info('Or: to generate a set of users use');
    logger.hint('"make create-all-users"');dp1

    return;
  }

  const token = await config.reauthenticateActor('owner')

  const status = await tasks.instance(token).status({
    blueprintId: blueprint.id,
    instanceId: instance
  })

  const state = status.data.status;

  logger.info("Current status of instance")
  logger.hint(state);

  if (state === 'Ready') {
    logger.info("You can start adding users to workflow instance and processing data and approvals")
  }

  config.update('status', status.data);
};

