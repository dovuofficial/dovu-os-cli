const {
  tasks
} = require('./src');

const config = require("./config");

(async () => {

  const key = config.workflow_key

  const elv = await tasks.getWorkflowByKey(key)

  console.log(elv);

  /**
   * Tomorrow:
   * - register/login users (class to store)
   * -
   */

})()

