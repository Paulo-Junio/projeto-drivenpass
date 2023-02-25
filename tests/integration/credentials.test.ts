import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app, { init } from "../../src";
import { createCredential } from "../factories/credential-factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
    await init()
    await cleanDb();
});
  
afterEach(async () => {
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
        it("Deve responder com 200 e os post do usuário", async ()=> {
            const {token, userId} = await generateValidToken()
            const credential = createCredential(validCredentialBody, userId)
            const response = await server.get("/credential").set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(Number),
                  title: expect.any(String),
                  username: expect.any(String),
                  password: expect.any(String),
                  userId: expect.any(Number)
                })
              ]));
        })
    
    })

})

describe("GET: /credential/:id", () => {
    it("Deve responder 401 se não for enviado um token", async () => {
        const response = await server.get("/credentiali");
    
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

        it("Deve responder com 400 se o id estiver incorreto", async () => {
            const token = await generateValidToken();
      
            const response = await server.get("/credential/0").set("Authorization", `Bearer ${token}`);
                
            expect(response.status).toBe(400);
          });
      
        it("Deve responder com 401 se a credencial não for do usuário", async () => {
            const {token, userId} = await generateValidToken()
            const credentialId = createCredential(validCredentialBody, (userId + 1)) 
        
            const response = await server.get(`/network/${credentialId}`).set("Authorization", `Bearer ${token}`);
        
            expect(response.status).toBe(401);
        });
        
        it("Deve responder com 200 e os post do usuário se o id for válido", async ()=> {
            const {token, userId} = await generateValidToken()
            const credentialId = createCredential(validCredentialBody, userId)
            const response = await server.get(`/credential/${credentialId}`).set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(Number),
                  title: expect.any(String),
                  username: expect.any(String),
                  password: expect.any(String),
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

        it("Se não for enviado um body, deve responder com 400", async ()=> {
            const response = await server.post("/credential");
    
            expect(response.status).toBe(400);
        })
    
        it("Se for enviado um body inválido, deve responder com 400", async ()=> {
            const token = generateValidToken()
            const invalidBody ={
                title: faker.internet.email(),
                url: faker.internet.url(),
                username: faker.name.firstName(),
            }
    
            const response = await server.post("/credential").send(invalidBody).set("Authorization", `Bearer ${token}`);
    
            expect(response.status).toBe(400);
        })
        
        it("Se for enviado um body válido, deve responder com 200 e a credential criado",async () => {
            const token = generateValidToken()
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
            const {token, userId} = await generateValidToken()
            const credentialId = createCredential(validCredentialBody, userId) 
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
        const validCredentialBody ={
            title: faker.internet.email(),
            url: faker.internet.url(),
            username: faker.name.firstName(),
            password: faker.internet.password(10),

        }

        it("Deve responder com 400 se o id estiver incorreto", async () => {
            const token = await generateValidToken();
      
            const response = await server.delete("/credential/0").set("Authorization", `Bearer ${token}`);
                
            expect(response.status).toBe(400);
          });
      
        it("Deve responder com 401 se o credential não for do usuário", async () => {
            const {token, userId} = await generateValidToken()
            const credentialId = createCredential(validCredentialBody, (userId + 1)) 
        
            const response = await server.delete(`/credential/${credentialId}`).set("Authorization", `Bearer ${token}`);
        
            expect(response.status).toBe(401);
        });
        
        it("Deve responder com 200  se o id for válido", async ()=> {
            const {token, userId} = await generateValidToken()
            const credentialId = createCredential(validCredentialBody, userId) 
            const response = await server.delete(`/credential/${credentialId}`).set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
        })
    
    })
})