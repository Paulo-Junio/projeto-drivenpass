import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app, { init } from "../../src";
import { createUser } from "../factories/user-factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
    await init()
    await cleanDb();
});
  
beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("POST: /sign-up", ()=>{

    const validBody ={
        email: faker.internet.email(),
        password: faker.internet.password(10)
    }

    it("Se não for enviado um body, deve responder com 400", async ()=> {
        const response = await server.post("/sign-up");

        expect(response.status).toBe(400);
    })

    it("Se for enviado um body inválido, deve responder com 400", async ()=> {
        const invalidBody ={
            email: faker.internet.email()
        }

        const response = await server.post("/sign-up").send(invalidBody);

        expect(response.status).toBe(400);
    })

    it("Se for enviado um body válido, deve responder com 200 e o usuário criado", async ()=> {

        const response = await server.post("/sign-up").send(validBody);

        expect(response.body).toEqual(expect.objectContaining(
            {
                email: expect.any(String),
                id: expect.any(Number)
            }
        ));
    })

    it("Se for enviado um body válido, mas o e-mail já existir, deve responder com 409", async ()=> {
        await createUser(validBody)
        const response = await server.post("/sign-up").send(validBody);

        expect(response.status).toBe(409);
    })
})

describe("POST: /sign-in", ()=>{
    const validBody ={
        email: faker.internet.email(),
        password: faker.internet.password(10)
    }

    it("Se não for enviado um body, deve responder com 400", async ()=> {
        const response = await server.post("/sign-in");

        expect(response.status).toBe(400);
    })

    it("Se for enviado um body inválido, deve responder com 400", async ()=> {
        const invalidBody ={
            email: faker.internet.email()
        }

        const response = await server.post("/sign-in").send(invalidBody);

        expect(response.status).toBe(400);
    })

    it("Se for enviado um body de um usuário que não existe, deve responder com 400", async ()=> {
        const inexistUser ={
            email: faker.internet.email(),
            password: faker.internet.password(10)
        }

        const response = await server.post("/sign-in").send(inexistUser);

        expect(response.status).toBe(400);
    })

    it("Se for enviado um body válido, mas com a senha incorreta, deve responder com 401", async ()=> {
       const user =  await createUser(validBody)

        const response = await server.post("/sign-in").send({...validBody, password: faker.internet.password(10)});

        expect(response.status).toBe(401);
    })

    it("Se for enviado um body válido, deve responder com 200 e um token", async ()=> {
        const user = await createUser(validBody)

        const response = await server.post("/sign-in").send(validBody);

        expect(response.body).toEqual(expect.objectContaining(
            {
                token: expect.any(String)
            }
        ));
    })
})