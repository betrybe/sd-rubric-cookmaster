const conn = require('./connection');

const getAllRecipes = async () => {
  try {
    const db = await conn();
    const stmt = await db.getTable('recipes').select(['id', 'user', 'name']).execute();
    const rows = await stmt.fetchAll();
    return rows.map(([id, user, recipe]) => ({ id, user, recipe }));
  } catch (error) {
    return false;
  }
};

const findById = async (id) => {
  try {
    const db = await conn();
    const stmt = await db
      .getTable('recipes')
      .select(['id', 'user_id', 'user', 'name', 'ingredients', 'instructions'])
      .where('id = :id')
      .bind('id', id)
      .execute();

    const row = await stmt.fetchOne();
    const [_id, user_id, user, name, ingredients, instructions] = row;
    return ({ id: _id, user_id, user, name, ingredients, instructions });
  } catch (error) {
    return false;
  }
};

module.exports = { getAllRecipes, findById };
