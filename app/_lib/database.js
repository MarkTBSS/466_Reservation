const Database = require('better-sqlite3');
const { cabins } = require('./data-cabins');

// Function to establish a connection to the SQLite database
function connectToDatabase() {
    // Create a new database connection
    const db = new Database('wild.db',
        //{ verbose: console.log }
    );

    // Create the cabins table if it doesn't exist
    db.exec(`
        CREATE TABLE IF NOT EXISTS cabins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            maxCapacity INTEGER NOT NULL,
            regularPrice INTEGER NOT NULL,
            discount INTEGER NOT NULL,
            image TEXT NOT NULL,
            description TEXT NOT NULL
        )
    `);

    // Check if the cabins table already has data
    const rowCount = db.prepare('SELECT COUNT(*) AS count FROM cabins').get().count;

    if (rowCount === 0) {
        // Insert cabin data into the cabins table
        const insertCabin = db.prepare(`
            INSERT INTO cabins (name, maxCapacity, regularPrice, discount, image, description)
            VALUES (@name, @maxCapacity, @regularPrice, @discount, @image, @description)
        `);

        const insertMany = db.transaction((cabins) => {
            for (const cabin of cabins) {
                insertCabin.run(cabin);
            }
        });

        insertMany(cabins);
    }

    return db;
}

// Export the connection function
module.exports = connectToDatabase;