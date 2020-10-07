const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const middlewares = require('./middlewares');
const controllers = require('./controllers');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(`${__dirname}/assets/`));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/admin', middlewares.auth(), (req, res) => res.render('admin/home', { user: req.user }));

app.get('/recipes/new',middlewares.auth(), controllers.recipesController.registerForm);
app.post('/recipes',middlewares.auth(), controllers.recipesController.register);
app.get('/', middlewares.auth(false), controllers.recipesController.listAll);
app.get('/recipes/:id',middlewares.auth(false), controllers.recipesController.show);
app.get('/recipes/:id/delete',middlewares.auth(), controllers.recipesController.dropForm);
app.post('/recipes/:id/delete',middlewares.auth(), controllers.recipesController.drop);

app.get('/register', controllers.userController.registerForm);
app.post('/register', controllers.userController.register);

app.get('/login', controllers.userController.loginForm);
app.get('/logout', controllers.userController.logout);
app.post('/login', controllers.userController.login);

app.listen(3000);
