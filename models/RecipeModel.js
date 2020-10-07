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

const getSearchRecipes = async (filter) => {
  try {
    const db = await conn();
    const stmt = await db
      .getTable('recipes')
      .select(['id', 'user', 'name'])
      .where('name like :filter')
      .bind('filter', `%${filter}%`)
      .execute();
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
    const [_id, userId, user, name, ingredients, instructions] = row;
    return ({ id: _id, userId, user, name, ingredients, instructions });
  } catch (error) {
    return false;
  }
};

const drop = async (id) => {
  try {
    const db = await conn();
    const stmt = await db
      .getTable('recipes')
      .delete()
      .where('id = :id')
      .bind('id', id)
      .execute();

    return stmt.getAffectedRowsCount();
  } catch (error) {
    return false;
  }
};

const register = async (id, userName, recipeName, ingredients, mode) => {
  try {
    const db = await conn();
    const stmt = await db.getTable('recipes')
    .insert(['user_id', 'user', 'name', 'ingredients', 'instructions'])
    .values(id, userName, recipeName, ingredients.join(), mode)
    .execute();
    return stmt.getAffectedRowsCount();
  } catch (error) {
    return false;
  }
};

module.exports = { getAllRecipes, findById, drop, register, getSearchRecipes };
