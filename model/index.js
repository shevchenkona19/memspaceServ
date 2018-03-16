const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL; 
const pool = new Pool({
    connectionString: connectionString,
})

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
}