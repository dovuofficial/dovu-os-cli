const {
  tasks,
  logger
} = require('./helpers');

const config = require('./config')();

module.exports = async () => {

  const { blueprint, users } = config;

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

  const token = await config.reauthenticateActor('owner')

  const instance = await tasks.workflows(token).publish(blueprint)

  config.update('instance', instance);

  logger.info('Started publishing of blueprint use the command below to get a status:');
  logger.hint('"dovu instance-status"');

};
