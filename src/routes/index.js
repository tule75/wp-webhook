const newRouterProducts = require('./products');
const newRouterUser = require('./users')
const newRouterCategory = require('./category');
const newRouterMail = require('./mail');

function route(app) {
  app.use('/category', newRouterCategory);
  app.use('/products', newRouterProducts);
  app.use('/users', newRouterUser);
  app.use('/email', newRouterMail);
  app.use('/', (req, res) => {res.render('home')});

}

module.exports = route;