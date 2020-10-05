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

module.exports = { listAll, show };
