const axios = require('axios');

const domain = 'https://test-os.dovu.earth/api/v1/'

const generateHeader = (token) => ({
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${token}`,
  },
})

const get = async ({
  resource,
  token = null
}) => {
  const result = await axios.get(
    domain + resource,
    generateHeader(token),
  );

  return result.data;
}

const post = async ({
  resource,
  payload = {},
  token = null
}) => {
  const result = await axios.post(
    domain + resource,
    payload,
    generateHeader(token)
  );

  return result.data;
}

module.exports = {
  get,
  post
}
