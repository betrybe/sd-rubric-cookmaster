const { v4: uuid } = require('uuid');
const { SESSIONS } = require('../middlewares/auth');

const userModel = require('../models/userModel');

const loginForm = (req, res) => {
  const { token = '' } = req.cookies || {};

  if (SESSIONS[token]) return res.redirect('/');

  return res.render('admin/login', {
    message: null,
    redirect: req.query.redirect,
  });
};

const login = async (req, res, next) => {
  const { email, password, redirect } = req.body;

  if (!email || !password) {
    return res.render('admin/login', {
      message: 'Preencha o email e a senha',
      redirect: null,
    });
  }

  const user = await userModel.findByEmail(email);
  if (!user || user.password !== password) {
    return res.render('admin/login', {
      message: 'Email ou senha incorretos',
      redirect: null,
    });
  }
  
  const token = uuid();
  SESSIONS[token] = user.id;
  res.cookie('token', token, { httpOnly: true, sameSite: true });
  res.redirect(redirect || '/admin');
};

const logout = (req, res) => {
  res.clearCookie('token');
  if (!req.cookies || !req.cookies.token) return res.redirect('/login');
  return res.render('admin/logout');
};

const registerForm = (req, res) => {
  return res.render('register', {
    message: null,
    redirect: req.query.redirect,
  });
};

const namesIsValid = (first, last) => {
  const regeNum = /[0-9]/;
  let msg = '';

  if (!first || first.length < 3 || regeNum.test(first))
    return msg = 'O primeiro nome deve ter, no mínimo, 3 caracteres, sendo eles apenas letras' 

  if (!last || last.length < 3 || regeNum.test(last))
    return msg = 'O segundo nome deve ter, no mínimo, 3 caracteres, sendo eles apenas letras'
  return msg;
}

const passwordIsValid = (password, confPassword) => {
  let msg = '';

  if (!password || password.length < 6) return msg = 'A senha deve ter pelo menos 6 caracteres';

  if (password != confPassword) return msg = 'As senhas tem que ser iguais';
  return msg;
}

const emailIsValid = (email) => {
  const regEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  let msg = '';

  if (!email || !email.match(regEmail)) return msg = 'O email deve ter o formato email@mail.com';
  return msg;
}

const register = async (req, res) => {
  const { email, password, confPassword, name, lastName } = req.body;
  let message = '';
  
  message = emailIsValid(email);
  if (message !== '') res.render('register', { message });

  message = passwordIsValid(password, confPassword);
  if (message !== '') res.render('register', { message });

  message = namesIsValid(name, lastName);
  if (message !== '') res.render('register', { message });

  const user = await userModel.register(req.body);
  if (!user) res.render('register', { message: 'Falha ao gravar no banco !' });
  
  return res.render('register', { message: 'Cadastro efetuado com sucesso!' });
};

module.exports = {
  login,
  loginForm,
  logout,
  registerForm,
  register,
};
