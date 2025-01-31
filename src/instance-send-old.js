const {
  tasks,
  logger
} = require('./helpers');

// TODO: middleware for checking state of conf
const config = require('./config')();

module.exports = async ({
  key,
  tag = 'default',
}) => {

  const block_instance = config?.block_instance?.[key]

  if (! block_instance) {
    const available = Object.keys(config?.block_instance).join(', ')
    logger.warn('*** Unable to find schema to validate***')
    logger.hint(`Available blocks that can receive data or approvals: [${available}]`)
    return
  }

  const block = config?.blocks.find(block => block.key === key)
  const actor = Object.values(config?.users).find(user => user.role_id === block?.role_id)

  if (! actor) {
    logger.warn('*** Unable to find actor in configuration that can process this block***')
    logger.hint(`try: dovu help create-user`)
    return
  }

  const isDataBlock = !! block.schema_id

  // Just a quick hack to run approvals
  const payload = isDataBlock ? config.importSchema(key) : { approve: "approved" }

  if (! payload) {
    logger.warn(`*** Unable to find a payload that been predefined for key [${key}]***`)
    logger.info(`*** You should generate a payload template by using the command below:***`)
    logger.hint(`dovu validate -k ${key}`)
    logger.info(`*** Then editing it within [artefacts/context/${config.workflow_key}/${key}.json]***`)

    return
  }

  logger.info(`***Payload found for key [${key}]***`)

  const checkRole = actor.is_owner ? 'owner' : actor.role
  const token = await config.reauthenticateActor(checkRole)

  const send = await tasks.instance(token).send({
    workflow_block_instance_id: block_instance,
    payload
  })

  if (! send) {
    logger.info("Unable to process block, this is normally related to a validation issue")

    return
  }

  console.log(send);

  if (! send.child_id) {
    logger.info("You have reached the end of the workflow.")

    return
  }


  const blockRef = config.blocks.find(block => block.id === send.child_id)

  // const blockInstanceExists = config?.block_instance?.[blockRef.key]
  const next = send.next_block_instance_id
  // const instanceValue = blockInstanceExists ? [ ...blockInstanceExists, next ] : next

  /**
   * TODO:
   * The big item we need to do here is we need to map block instances to external identifiers
   * so you can map particular workflow instances in a tree manner
   */
  config.update(`block_instance.${blockRef.key}`, next);



};

