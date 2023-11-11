import sql from "./db"
import { User } from "./models/user"

export async function getUsers(numberOfUsers: number) {
    const users = await sql<User[]>`
        SELECT
        *
        FROM
        users
    `

    return users
}

export async function insertUser(user: User) {
    const users = await sql<User[]>`
        INSERT INTO users
            (username, first_name, last_name, age, email, password, profession_id)
        VALUES
            (${user.username}, ${user.first_name}, ${user.last_name}, ${user.age}, ${user.email}, ${user.password}, ${user.profession_id} )
        RETURNING *
    `
    return users
}

