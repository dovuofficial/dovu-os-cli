const {
  tasks, logger
} = require('./helpers');

const config = require('./config')();

const validRoles = ['supplier', 'verifier', 'standard_registry'];

module.exports = async ({ role, owner }) => {

  if (!validRoles.includes(role)) {
    console.error(
      `Error: Invalid role '${role}'. Valid roles are: ${validRoles.join(', ')}`
    );
    process.exit(1); // Exit with error
  }

  const password =  Math.random().toString('36')

  // Example user data
  const userData = {
    name: `Test ${role}`,
    email: `${role}@${Math.random().toString()}.com`,
    password,
    password_confirmation: password,
    role,
  };

  const user = await tasks.user(config.users).register(userData);
  const token = await tasks.user(config.users).login(userData);

  const path = !!owner ? 'users.owner' : `users.${role}`

  config.update(path, {
    ...userData,
    ...user,
    ...token,
    is_owner: !!owner
  });
};
