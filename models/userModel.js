const conn = require('./connection');

/**
 * Busca um usuário através do seu email e, se encontrado, retorna-o.
 * @param {string} email Email do usuário a ser encontrado
 */
const findByEmail = async (email) => {
  try {
    const db = await conn();
    const stmt = await db
      .getTable('users')
      .select(['id', 'email', 'password', 'first_name', 'last_name'])
      .where('email = :email')
      .bind('email', email)
      .execute();
    const row = await stmt.fetchOne();
    const [id, _email, password, name, lastName] = row;

    return ({ id, email: _email, password, name, lastName });
  } catch (error) {
    return false;
  }
};

/**
 * Busca um usuário através do seu ID
 * @param {string} id ID do usuário
 */
const findById = async (id) => {
  try {
    const db = await conn();
    const stmt = await db.getTable('users')
    .select(['id', 'email', 'password', 'first_name', 'last_name'])
    .where('id = :id')
    .bind('id', id)
    .execute();

    const row = await stmt.fetchOne();
    const [_id, login, password, name, lastName] = row;

    return ({ id: _id, email: login, password, name, lastName });
  } catch (error) {
    return false;
  }
};

const register = async ({ email, password, name, lastName }) => {
  try {
    const db = await conn();
    const stmt = await db.getTable('users')
    .insert(['email', 'password', 'first_name', 'last_name'])
    .values(email, password, name, lastName)
    .execute();
    return stmt.getAffectedRowsCount();
  } catch (error) {
    return false;
  }
};

module.exports = {
  findByEmail,
  findById,
  register,
};
