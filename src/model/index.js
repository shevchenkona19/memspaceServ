const {Pool} = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123123123@localhost:5432/memspacetest';
const pool = new Pool({
    connectionString: connectionString,
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};