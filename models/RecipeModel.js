const conn = require('./connection');

const getAllRecipes = async () => {
  try {
    const db = await conn();
    const stmt = await db.getTable('recipes').select(['user', 'name']).execute();
    const rows = await stmt.fetchAll();
    return rows.map(([user, recipe]) => ({ user, recipe }));
  } catch (error) {
    return false;
  }
};

module.exports = { getAllRecipes, };
