const UsersHandler = require('./handler');
const routes = require('./routes');
const AddUserUseCase = require('../../../../Applications/use_case/AddUserUseCase');

module.exports = {
  name: 'users',
  register: async (server, { container }) => {
    const addUserUseCase = container.getInstance('AddUserUseCase');
    const usersHandler = new UsersHandler({ addUserUseCase });
    server.route(routes(usersHandler));
  },
};
