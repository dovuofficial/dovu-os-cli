'use strict';

const api = require('./api');
const logger = require("./logger");

/**
 * Workflow fetching related api calls.
 */
const getWorkflows = () => api.get({
  resource: 'workflows'
})

const getWorkflowByKey = async (key) => {
  const workflows = await getWorkflows()

  return workflows.data.find(workflow => workflow.key === key)
}

const getWorkflowSchemas = ({ id }) => api.get({
  resource: `workflows/${id}/schemas`
})

const getWorkflowBlocks = ({ id }) => api.get({
  resource: `workflows/${id}/blocks`
})

/**
 *  User or auth related api calls
 */
const user = () => {

  const register = async (user) => api.post({
    resource: 'register',
    payload: user
  })

  const login = async ({ email, password }) => {
    const response = await api.post({
        resource: 'login',
        payload: { email, password }
      }
    )

    return response.data;
  }

  return {
    register,
    login,
  }
}

/**
 *  Authenticated workflow calls
 */
const workflows = (accessToken = null) => {

  const publish = async (blueprint) => {
    try {
      return await api.post({
        resource: `workflows/${blueprint.id}/publish`,
        token: accessToken
      });
    } catch (error) {
      logger.warn('Error publishing workflow:', error.response?.data || error.message);
    }
  }

  return {
    publish,
  }
}

/**
 *  Authenticated workflow calls
 */
const instance = (accessToken = null) => {

  const status = ({ blueprintId, instanceId }) => api.get({
    resource: `workflows/${blueprintId}/instances/${instanceId}`,
    token: accessToken
  })

  const attach = async ({ workflow_instance_id, user_id }) => {

    try {
      const response = await api.post({
        resource: `user-workflow-instances`,
        payload: { workflow_instance_id, user_id },
        token: accessToken
      });

      return response;
    } catch (error) {
      if (error.status === 409) {
        logger.warn(`User [${user_id}] has already been attached to the workflow`);
      }
    }
  }

  const send = async ({ workflow_block_instance_id, payload }) => {

    try {
      const response = await api.post({
        resource: `workflow-block-instances/${workflow_block_instance_id}`,
        payload,
        token: accessToken
      });

      return response;
    } catch (error) {
      console.log(error.response?.data);
      console.log(error.status);
    }
  }

  return {
    status,
    send,
    attach
  }
}

/**
 *  Schema and validation calls
 */
const schema = () => {

  const all = () => api.get({
    resource: `schema`,
  })

  const fields = (schemaId) => api.get({
    resource: `schema/${schemaId}/fields`,
  })

  // TODO: Validation API is broken with ENUM values.
  const validate = async ({ schemaId, payload }) => {
    try {
      const response = await api.post({
        resource: `schema/${schemaId}/validate`,
        payload,
      });


      return response.data
    } catch (error) {
      if (error.status === 422) {
        return {
          status: 422,
          data: error.response?.data
        }
      }

      console.log(`Error validate: ${error.response?.data || error.message}`);
    }
  }

  return {
    all,
    fields,
    validate
  }
}

module.exports = {
  // Workflows as-object
  getWorkflows,
  getWorkflowByKey,
  getWorkflowBlocks,
  getWorkflowSchemas,
  workflows,
  instance,
  schema,
  user
}
