const config = require('./config')();

(async () => {
  const key = process.argv[2]

  if (! key) {
    throw new Error("Key of blueprint required")
  }

  config.update(`workflow_key`, key);

  // fetch schema data for workflow

})()

