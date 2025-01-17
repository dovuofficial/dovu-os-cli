const {
  tasks
} = require('./helpers');

const config = require('./config')();
const Table = require('cli-table3');

const listBlueprintTableView = (blueprints) => {

  const keys = Object.keys(blueprints[0]);

  const table = new Table({ head: keys });

  blueprints.forEach((elem) => {
    table.push(Object.values(elem));
  })

  console.info(table.toString());
}

module.exports = async ({ key }) => {

  if (!key) {
    const blueprints = await tasks.getWorkflows();

    listBlueprintTableView(blueprints.data);

    return;
  }

  const trimmed_key = key.trim();
  const blueprint = await tasks.getWorkflowByKey(trimmed_key);

  if (! blueprint) {
    console.warn(`Workflow key ${key} not found in blueprints list`);
    return;
  }

  config.update(`workflow_key`, trimmed_key);
  config.update(`blueprint`, blueprint);

  const blocks = await tasks.getWorkflowBlocks(blueprint);

  config.update(`blocks`, blocks);

  blocks.forEach(async (elem) => {

    const { schema_id } = elem;

    if (! schema_id) {
      return
    }

    const fields = await tasks.schema().fields(schema_id);

    config.update(`schema.${elem.key}`, fields);
  })
};
