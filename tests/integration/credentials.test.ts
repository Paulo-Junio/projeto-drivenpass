import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app, { init } from "../../src";
import { prisma } from "../../src/database/db";
import { createCredential } from "../factories/credential-factories";
import { createUser } from "../factories/user-factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
    await init()
    await cleanDb();
});
  
beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("GET: /credential", () => {
    it("Deve responder 401 se não for enviado um token", async () => {
        const response = await server.get("/credential");
    
        expect(response.status).toBe(401);
    });
    
      it("Deve responder 401 se o token enviado não for válido", async () => {
        const token = faker.lorem.word()
        const response = await server.get("/credential").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(401);
    });

    describe("Quando o token é válido",  () => {
        const validCredentialBody ={
            title: faker.internet.email(),
            url: faker.internet.url(),
            username: faker.name.firstName(),
            password: faker.internet.password(10),

        }
        const validUserBody = {
            email: faker.internet.email(),
            password: faker.internet.password()
        }
        it("Deve responder com 200 e os post do usuário", async ()=> {
            const user = await createUser(validUserBody)
            const token = await generateValidToken(user)
            const credential = createCredential(validCredentialBody, user.id)
            const response = await server.get("/credential").set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(Number),
                  title: expect.any(String),
                  username: expect.any(String),
                  password: expect.any(String),
                  url: expect.any(String),
                  userId: expect.any(Number)
                })
              ]));
        })
    
    })

})

describe("GET: /credential/:id", () => {
    it("Deve responder 401 se não for enviado um token", async () => {
        const response = await server.get("/credential/0");
    
        expect(response.status).toBe(401);
    });
    
    it("Deve responder 401 se o token enviado não for válido", async () => {
        const token = faker.lorem.word()
        const response = await server.get("/credential/0").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(401);
    });

    describe("Quando o token é válido",  () => {
        const validCredentialBody ={
            title: faker.internet.email(),
            url: faker.internet.url(),
            username: faker.name.firstName(),
            password: faker.internet.password(10),

        }
        const validUserBody = {
            email: faker.internet.email(),
            password: faker.internet.password()
        }
        it("Deve responder com 400 se o id estiver incorreto", async () => {
            const user = await createUser(validUserBody)
            const token = await generateValidToken(user)
      
            const response = await server.get("/credential/0").set("Authorization", `Bearer ${token}`);
                
            expect(response.status).toBe(400);
          });
      
        it("Deve responder com 401 se a credencial não for do usuário", async () => {
            const user = await createUser(validUserBody)
            const token = await generateValidToken(user)
            const credentialId = createCredential(validCredentialBody, (user.id + 1)) 
        
            const response = await server.get(`/credential/${credentialId}`).set("Authorization", `Bearer ${token}`);
        
            expect(response.status).toBe(401);
        });
        
        it("Deve responder com 200 e os post do usuário se o id for válido", async ()=> {
            const user = await createUser(validUserBody)
            const token = await generateValidToken(user)
            const credentialId = createCredential(validCredentialBody, user.id)
            const response = await server.get(`/credential/${credentialId}`).set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    title: expect.any(String),
                    username: expect.any(String),
                    password: expect.any(String),
                    url: expect.any(String),
                    userId: expect.any(Number)
                })
              ]));
        })
    
    })
})

describe("POST: /credential", () => {
    it("Deve responder 401 se não for enviado um token", async () => {
        const response = await server.get("/credential");
    
        expect(response.status).toBe(401);
    });
    
    it("Deve responder 401 se o token enviado não for válido", async () => {
        const token = faker.lorem.word()
        const response = await server.get("/credential").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(401);
    });

    describe("Quando o token é válido",  () => {
        const validUserBody = {
            email: faker.internet.email(),
            password: faker.internet.password()
        }
        it("Se não for enviado um body, deve responder com 400", async ()=> {
            const response = await server.post("/credential");
    
            expect(response.status).toBe(400);
        })
    
        it("Se for enviado um body inválido, deve responder com 400", async ()=> {
            const user = await createUser(validUserBody)
            const token = await generateValidToken(user)
            const invalidBody ={
                title: faker.internet.email(),
                url: faker.internet.url(),
                username: faker.name.firstName(),
            }
    
            const response = await server.post("/credential").send(invalidBody).set("Authorization", `Bearer ${token}`);
    
            expect(response.status).toBe(400);
        })
        
        it("Se for enviado um body válido, deve responder com 200 e a credential criado",async () => {
            const user = await createUser(validUserBody)
            const token = await generateValidToken(user)
            const validCredentialBody ={
                title: faker.internet.email(),
                url: faker.internet.url(),
                username: faker.name.firstName(),
                password: faker.internet.password(10),
    
            }
            const response = await server.post("/credential").send(validCredentialBody).set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200)
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    title: expect.any(String),
                    username: expect.any(String),
                    password: expect.any(String),
                    url: expect.any(String),
                    userId: expect.any(Number)
                })
              ]));

        })

        it("Se for enviado um body válido, porém, já existir uma credencial com o mesmo titulo deve responder 409",async () => {
            const validCredentialBody ={
                title: faker.internet.email(),
                url: faker.internet.url(),
                username: faker.name.firstName(),
                password: faker.internet.password(10),
    
            }
            const user = await createUser(validUserBody)
            const token = await generateValidToken(user)
            const credentialId = createCredential(validCredentialBody, user.id) 
            const response = await server.post("/credential").send(validCredentialBody).set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(409)
        })
    })
})

describe("DELETE: /credential/:id", () => {
    it("Deve responder 401 se não for enviado um token", async () => {
        const response = await server.get("/credential");
    
        expect(response.status).toBe(401);
    });
    
    it("Deve responder 401 se o token enviado não for válido", async () => {
        const token = faker.lorem.word()
        const response = await server.get("/credential").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(401);
    });

    describe("Quando o token é válido",  () => {
        const validUserBody = {
            email: faker.internet.email(),
            password: faker.internet.password()
        }

        const validCredentialBody ={
            title: faker.internet.email(),
            url: faker.internet.url(),
            username: faker.name.firstName(),
            password: faker.internet.password(10),

        }

        it("Deve responder com 400 se o id estiver incorreto", async () => {
            const user = await createUser(validUserBody)
            const token = await generateValidToken(user)
      
            const response = await server.delete("/credential/0").set("Authorization", `Bearer ${token}`);
                
            expect(response.status).toBe(400);
          });
      
        it("Deve responder com 401 se o credential não for do usuário", async () => {
            const user = await createUser(validUserBody)
            const token = await generateValidToken(user)
            const credentialId = createCredential(validCredentialBody, (user.id + 1)) 
        
            const response = await server.delete(`/credential/${credentialId}`).set("Authorization", `Bearer ${token}`);
        
            expect(response.status).toBe(401);
        });
        
        it("Deve responder com 200  se o id for válido", async ()=> {
            const user = await createUser(validUserBody)
            const token = await generateValidToken(user)
            const credentialId = createCredential(validCredentialBody, user.id) 
            const response = await server.delete(`/credential/${credentialId}`).set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
        })
    
    })
})