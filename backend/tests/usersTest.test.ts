const request = require('supertest');
const app = require('../server');
import postgres, { RowList } from "postgres";
import sql from "../db"

describe('Get Endpoints', () => {
  it('gets data about the first user correct', async () => {
    const res = await request(app)
      .get('/api') 
    // ahh. res.body is the users i am retrieving
    let first_user = res.body[0] as User
    expect(first_user.username).toEqual("dimash")
    expect(first_user.first_name).toEqual("Dimash")
    expect(first_user.last_name).toEqual("Tabay")
    expect(first_user.age).toEqual(14)
    expect(first_user.email).toEqual("tabay.d@nisa.edu.kz")
    expect(first_user.password).toEqual("nishackpass321")
    expect(first_user.profession_id).toEqual(1)
    expect(res.statusCode).toEqual(200)
  })
})

beforeAll(done => {
  done()
})

afterAll(done => {
  sql.end().then(
    done()
  )
})