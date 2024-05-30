const newRouterProducts = require('./products');
const newRouterUser = require('./users')
const newRouterCategory = require('./category');
const newRouterMail = require('./mail');
const newWPtoLark = require('./wp-lark.js');
const newLarktoWP = require('./lark-wp.js')
const newRouterGPT = require('./gpt.js')

function route(app) {
  app.use('/category', newRouterCategory);
  app.use('/products', newRouterProducts);
  app.use('/users', newRouterUser);
  app.use('/email', newRouterMail);
  app.use('/wp-lark', newWPtoLark);
  app.use('/lark-wp', newLarktoWP);
  app.use('/gpt', newRouterGPT);
  app.use('/', (req, res) => {res.render('home')});

}

module.exports = route;