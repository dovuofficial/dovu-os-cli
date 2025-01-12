const axios = require('axios');

const domain = 'https://test-os.dovu.earth/api/v1/'

const get = async (resource) => {
  const result = await axios.get(domain + resource);

  return result.data;
}

const post = async (resource, payload) => {
  const result = await axios.post(domain + resource, payload);

  return result.data;
}

module.exports = {
  get,
  post
}
