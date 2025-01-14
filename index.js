const {
  tasks
} = require('./src');

const config = require("./config")();

(async () => {

  const key = config.workflow_key

  console.log(config);

  const workflow = await tasks.getWorkflowByKey(key)

  config.update(`workflow`, workflow);



  const schemas = await tasks.getWorkflowSchemas(workflow)

  config.update(`schemas`, schemas.data);






  // console.log(elv);

  /**
   * Tomorrow:
   * - register/login users (class to store)
   * -
   */

})()

