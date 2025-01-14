const {
  tasks
} = require('./src');

const config = require('./config')();

(async () => {

  const role = process.argv[2]

  if (! role) {
    throw new Error("Role/Name required for user")
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

  // Register a new user
  const user = await tasks.user(config.users).register(userData);

  const token = await tasks.user(config.users).login(userData);

  config.update(`users.${role}`, { ...userData, ...user, ...token });

})()

