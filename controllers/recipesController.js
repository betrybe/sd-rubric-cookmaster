const RecipeModel = require('../models/RecipeModel');

const listAll = async (req, res) => {
  try {
    const recipes = await RecipeModel.getAllRecipes();
    return res.render('home', { data: recipes, user: req.user });
  } catch (error) {
    return res.render('home', { data: null, user: req.user });
  }
};

module.exports = { listAll };
