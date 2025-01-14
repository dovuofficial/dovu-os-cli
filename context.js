const {
  tasks
} = require('./src');

const config = require('./config')();

(async () => {

  const name = process.argv[2]

  if (! name) {
    throw new Error("Name of context required")
  }

  config.update(`context.name`, name);
})()

