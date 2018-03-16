const { Pool } = require('pg')
<<<<<<< HEAD
const connectionString = process.env.DATABASE_URL; 
=======
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123123123@localhost:5432/memspacetest'; 
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
const pool = new Pool({
    connectionString: connectionString,
})

<<<<<<< HEAD
// module.exports = {
//     query: (text, params) => pool.query(text, params)
// }
module.exports = {
    query: (text, params) => { 
        try { 
            pool.query(text, params);
        } catch (err) {
            console.log(err.stack);
        }
        return { };
    }
=======
module.exports = {
    query: (text, params) => pool.query(text, params)
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
}