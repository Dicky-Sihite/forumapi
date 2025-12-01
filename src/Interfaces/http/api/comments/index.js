const routes = require('./routes');

module.exports = {
  name: 'comments',
  register: async (server, { container }) => {
    server.route(routes(container));
  },
};
