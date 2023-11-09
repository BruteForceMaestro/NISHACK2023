class User {
    username: string
    first_name: string
    last_name: string
    age: number
    email: string
    password: string
    profession_id: number
    
    constructor(userObject){
        this.username = userObject.username,
        this.first_name = userObject.first_name,
        this.last_name = userObject.last_name,
        this.age = userObject.age,
        this.email = userObject.email,
        this.password = userObject.password,
        this.profession_id = userObject.profession_id
    }

}