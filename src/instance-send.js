const {
  tasks,
  logger
} = require('./helpers');

// TODO: middleware for checking state of conf
const config = require('./config')();

module.exports = async ({
  key,
}) => {

  const schema = config?.schema?.[key]

  if (! schema) {
    const available = Object.keys(config?.schema)
    logger.warn('*** Unable to find schema to validate***')
    logger.hint(`Available schemas: [${available}]`)
    return
  }


  // const block = config.blocks[0]
  //
  // console.log(block)
  // console.log(config.instance.workflow_block)
  //
  // return
  // const actor =

  // const payload = {}

  // schema.map(elem => payload[elem.name] = "abc" )

  // config.instance.workflow_block.role_id

  // Get token as owner of workflow
  const token = await config.reauthenticateActor('supplier')

  const payload = {
    uuid: "123",
    project_name: "name",
    project_summary: "project_summary",
    classification_cat: "CARBON_AVOIDANCE",
    host_country: "UK",
    benefit_type: "benefit_type",
    vol_standard: "vol_standard",
    project_start_date: "01-01-24",
    methodology_link: [ "abc" ]
  }

  console.log(payload);

  const send = await tasks.instance(token).send({
    workflow_block_instance_id: config.instance.id,
    payload
  })

  console.log(send);

  return

};

