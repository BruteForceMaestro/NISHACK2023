// THIS IS NOT CONFIRMED TO BE WORKING! i will solve migrations but for now i want to sleep

require('dotenv').config()
import postgres from 'postgres'

const sql = postgres("postgres://postgres:"+ process.env.POSTGRES_PASS +"@localhost:5432/postgres") 

async function createDb(){
    const db = await sql`
        CREATE DATABASE careercanvasai; 
        CREATE TABLE professions (
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(250) NOT NULL
        );
        CREATE TABLE users (
            id BIGSERIAL PRIMARY KEY NOT NULL,
            username VARCHAR(100) NOT NULL,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            age INT NOT NULL,
            email VARCHAR(250),
            password VARCHAR(100) NOT NULL,
            profession_id INT NOT NULL,
            CONSTRAINT fk_profession
                FOREIGN KEY (profession_id)
                    REFERENCES professions(id)
        );
        INSERT INTO professions (name) values ('Software Engineer');
        INSERT INTO USERS (username, first_name, last_name, age, email, password, profession_id) VALUES ('dimash', 'Dimash', 'Tabay', 14, 'tabay.d@nisa.edu.kz', 'nishackpass321' );
    `.simple()
    
    return db
}

createDb().then(
    console.log("Succesfully created mock database.")
)
