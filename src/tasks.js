'use strict';

const api = require('./api');

const getWorkflows = () => api.get('workflows')

const getWorkflowByKey = async (key) => {
  const workflows = await getWorkflows()

  return workflows.data.find(workflow => workflow.key === key)
}

const getWorkflowSchemas = ({ id }) => api.get(`workflows/${id}/schemas`)

const user = () => {

  const register = async (user) => api.post('register', user)

  const login = async ({ email, password }) => {
    const response = await api.post('login', { email, password })

    return response.data;
  }

  return {
    register,
    login,
  }
}

module.exports = {
  // Workflows as-object
  getWorkflows,
  getWorkflowByKey,
  getWorkflowSchemas,
  user
}
