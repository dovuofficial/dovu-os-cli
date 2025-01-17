const {
  tasks,
  logger
} = require('./helpers');
const {info} = require("./helpers/logger");

// TODO: middleware for checking state of conf
const config = require('./config')();

module.exports = async ({ role }) => {

  const { instance, users } = config;

  if (! instance) {
    logger.warn('*** Unable to find an instance to check.***')
    logger.hint('Run "dovu help publish-blueprint" for more information')
    return
  }

  const actor = users[role]

  if (! actor) {
    logger.warn(`*** Unable to find a stored user that has the role of [${role}]***`)
    logger.hint('Run "dovu help create-user" for more information.');
    logger.info('Or: to generate a set of users use');
    logger.hint('"make create-all-users"');

    return;
  }

  logger.hint(`Found actor [${actor.name}], with email [${actor.email}] of role [${role}].`);
  logger.info(`Will being process of attaching to instance [${instance.workflow_instance_id}].`);

  // Get token as owner of workflow
  const token = await config.reauthenticateActor('owner')

  await tasks.instance(token).attach({
    workflow_instance_id: instance.workflow_instance_id,
    user_id: actor.id
  })

  // TODO: might required more
  logger.info(`Actor [${actor.name}] is attached to workflow`)

  config.update(`users.${role}.attached`, true);
};

