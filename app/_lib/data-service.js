import connectToDatabase from './database.js';

async function executeQuery(query, params = []) {
    const db = connectToDatabase();
    const stmt = db.prepare(query);
    const data = params.length ? stmt.get(...params) : stmt.all();
    db.close();
    return data;
}

export const getCabins = async function () {
    try {
        const query = `
            SELECT id, name, maxCapacity, regularPrice, discount, image, description
            FROM cabins
            ORDER BY name
        `;
        const data = await executeQuery(query);
        // Simulate a slow network
        //await new Promise((resolve) => setTimeout(resolve, 2000));
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Cabins could not be loaded");
    }
};

export const getCabin = async function (id) {
    try {
        const query = `
            SELECT id, name, maxCapacity, regularPrice, discount, image, description
            FROM cabins
            WHERE id = ?
        `;
        //console.log(`Executing query: ${query} with params: ${id}`);
        const data = await executeQuery(query, [id]);

        // Simulate a slow network
        //await new Promise((resolve) => setTimeout(resolve, 2000));

        if (!data) {
            console.error(`No cabin found with id: ${id}`);
            throw new Error("Cabin not found");
        }
        //console.log(`Cabin data retrieved: ${JSON.stringify(data)}`);
        return data;
    } catch (error) {
        if (error.message === "Cabin not found") {
            throw error;
        }
        console.error(`Error loading cabin with id: ${id}`, error);
        throw new Error("Cabin could not be loaded");
    }
};

export async function getCountries() {
    try {
        const res = await fetch(
            "https://restcountries.com/v2/all?fields=name,flag"
        );
        const countries = await res.json();
        return countries;
    } catch {
        throw new Error("Could not fetch countries");
    }
}