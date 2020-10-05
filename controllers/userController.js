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

const stringIsValid = str => {
  const regeNum = /[0-9]/;

  if (str.length < 3 || regeNum.test(str)) 
    return false

  return true;
}

const register = async (req, res) => {
  const { email, password, redirect, confPassword, name, lastName } = req.body;
  const regeEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  if (!email || !password || !confPassword || !name || !lastName) {
    return res.render('register', {
      message: 'Preencha os campos obrigatórios(*)',
      redirect: null,
    });
  }
  
  if (!email.match(regeEmail)) {
    return res.render('register', {
      message: 'O email deve ter o formato email@mail.com',
      redirect: null,
    });
  }

  if (password.length < 6) {
    return res.render('register', {
      message: 'A senha deve ter pelo menos 6 caracteres',
      redirect: null,
    });
  }

  if (password !== confPassword) {
    return res.render('register', {
      message: 'As senhas tem que ser iguais',
      redirect: null,
    });
  }

  if (!stringIsValid(name)) {
    return res.render('register', {
      message: 'O primeiro nome deve ter, no mínimo, 3 caracteres, sendo eles apenas letras',
      redirect: null,
    });
  }

  if (!stringIsValid(lastName)) {
    return res.render('register', {
      message: 'O segundo nome deve ter, no mínimo, 3 caracteres, sendo eles apenas letras',
      redirect: null,
    });
  }

  const user = await userModel.register(req.body);
  if (!user) {
    return res.render('register', {
      message: 'Falha ao gravar no banco !',
      redirect: null,
    });
  }

  return res.render('register', { message: 'Cadastro efetuado com sucesso!' });
};

module.exports = {
  login,
  loginForm,
  logout,
  registerForm,
  register,
};
