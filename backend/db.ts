import dotenv from 'dotenv';
dotenv.config();
import postgres from 'postgres'

const sql = postgres("postgres://postgres:" + process.env.POSTGRES_PASS + "@localhost:5432/careercanvasai") // todo move password to env

export default sql