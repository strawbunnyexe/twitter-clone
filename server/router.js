const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);

  // login
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  // signup
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // logut
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // homepage
  app.get('/maker', mid.requiresLogin, controllers.Post.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Post.makePost);

  // settings for user/account
  app.get('/settings', mid.requiresLogin, controllers.Account.settingsPage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  // 404 page
  app.use((req, res) => {
    res.status(404).render('404');
  });
};

module.exports = router;
