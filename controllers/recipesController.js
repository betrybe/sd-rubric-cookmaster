const UserModel = require('../models/userModel');
const RecipeModel = require('../models/RecipeModel');

const listAll = async (req, res) => {
  try {
    const recipes = await RecipeModel.getAllRecipes();
    return res.render('home', { data: recipes, user: req.user });
  } catch (error) {
    return res.render('home', { data: null, user: req.user });
  }
};

const show = async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.id);
    return res.render('recipe', { data: recipe, user: req.user });
  } catch (error) {
    return res.render('recipe', { data: null, user: req.user });
  }
};

const dropForm = (req, res) => res.render('recipeDrop', { data: req.params.id, user: req.user, message: null });

const drop = async(req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if(user.password !== req.body.password)
      return res.render('recipeDrop', { data: req.params.id, user: req.user, message: 'Senha Incorreta.' });

    const result = await RecipeModel.drop(req.params.id);
    if(result) return res.redirect('/');

    return res.render('recipeDrop', { data: null, user: req.user, message: 'Erro ao deletar !' })

  } catch (error) {
    return res.render('recipeDrop', { data: null, user: req.user, message: 'Erro ao deletar !' })
  }
};

const registerForm = (req, res) => res.render('recipeRegister', { data: null, user: req.user, message: null });

const register = async(req, res) => {
  try {
    const { nameRecipe, ingredients, mode } = req.body;
    const result = await RecipeModel.register(req.user.id, req.user.name, nameRecipe, ingredients, mode);

    if(result) return res.redirect('/');

    return res.render('recipeRegister', { data: null, user: req.user, message: 'Erro ao cadastar !' })

  } catch (error) {
    return res.render('recipeRegister', { data: null, user: req.user, message: 'Erro ao cadastrar !' })
  }
};

module.exports = { listAll, show, dropForm, drop, registerForm, register };
