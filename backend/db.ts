import postgres from 'postgres'

const sql = postgres("postgres://postgres:321@localhost:5432/careercanvasai") // todo move password to env

export default sql