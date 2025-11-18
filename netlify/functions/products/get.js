import { neon } from "@neondatabase/serverless";


export async function handler(event) {
    try {
        const sql = neon(process.env.NETLIFY_DATABASE_URL);
        const products = sql`SELECT id, name, description FROM produtos`;
        return {
            statusCode: 200, // Tudo certo
            body: JSON.stringify(products) // Retorna um json dos produtos
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ errror: err.message }) };
    }
}
