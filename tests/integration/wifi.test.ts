import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app, { init } from "../../src";
import { createWifi } from "../factories/wifi-factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
    await init()
    await cleanDb();
});
  
beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("GET: /wifi", () => {
    it("Deve responder 401 se não for enviado um token", async () => {
        const response = await server.get("/wifi");
    
        expect(response.status).toBe(401);
    });
    
      it("Deve responder 401 se o token enviado não for válido", async () => {
        const token = faker.lorem.word()
        const response = await server.get("/wifi").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(401);
    });

    describe("Quando o token é válido",  () => {
        const validWifiBody ={
            title: faker.internet.email(),
            network:faker.name.firstName(),
            password: faker.internet.password(10),

        }
        it("Deve responder com 200 e os post do usuário", async ()=> {
            const {token, userId} = await generateValidToken()
            const wifi = createWifi(validWifiBody, userId)
            const response = await server.get("/wifi").set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.status).toEqual(expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(Number),
                  title: expect.any(String),
                  network: expect.any(String),
                  password: expect.any(String),
                  userId: expect.any(Number)
                })
              ]));;
        })
    
    })

})

describe("GET: /wifi/:id", () => {
    it("Deve responder 401 se não for enviado um token", async () => {
        const response = await server.get("/wifi/0");
    
        expect(response.status).toBe(401);
    });
    
    it("Deve responder 401 se o token enviado não for válido", async () => {
        const token = faker.lorem.word()
        const response = await server.get("/wifi/0").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(401);
    });

    describe("Quando o token é válido",  () => {
        const validWifiBody ={
            title: faker.internet.email(),
            network:faker.name.firstName(),
            password: faker.internet.password(10),

        }

        it("Deve responder com 400 se o id estiver incorreto", async () => {
            const token = await generateValidToken();
      
            const response = await server.get("/wifi/0").set("Authorization", `Bearer ${token}`);
                
            expect(response.status).toBe(400);
          });
      
        it("Deve responder com 401 se o wifi não for do usuário", async () => {
            const {token, userId} = await generateValidToken()
            const wifiId = createWifi(validWifiBody, (userId + 1)) 
        
            const response = await server.get(`/wifi/${wifiId}`).set("Authorization", `Bearer ${token}`);
        
            expect(response.status).toBe(401);
        });
        
        it("Deve responder com 200 e os post do usuário se o id for válido", async ()=> {
            const {token, userId} = await generateValidToken()
            const wifiId = createWifi(validWifiBody, userId)
            const response = await server.get(`/wifi/${wifiId}`).set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.status).toEqual(expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(Number),
                  title: expect.any(String),
                  network: expect.any(String),
                  password: expect.any(String),
                  userId: expect.any(Number)
                })
              ]));;
        })
    
    })
})

describe("POST: /wifi", () => {
    it("Deve responder 401 se não for enviado um token", async () => {
        const response = await server.get("/wifi");
    
        expect(response.status).toBe(401);
    });
    
    it("Deve responder 401 se o token enviado não for válido", async () => {
        const token = faker.lorem.word()
        const response = await server.get("/wifi").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(401);
    });

    describe("Quando o token é válido",  () => {

        it("Se não for enviado um body, deve responder com 401", async ()=> {
            const response = await server.post("/wifi");
    
            expect(response.status).toBe(401);
        })
    
        it("Se for enviado um body inválido, deve responder com 400", async ()=> {
            const token = generateValidToken()
            const invalidBody ={
                title: faker.name.firstName(),
                network: faker.name.firstName(),
            }
    
            const response = await server.post("/wifi").send(invalidBody).set("Authorization", `Bearer ${token}`);
    
            expect(response.status).toBe(400);
        })
        
        it("Se for enviado um body válido, deve responder com 200 e o wifi criado",async () => {
            const token = generateValidToken()
            const validBody ={
                title: faker.name.firstName(),
                network: faker.name.firstName(),
                password: faker.internet.password()
            }
            const response = await server.post("/wifi").send(validBody).set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200)
            expect(response.body).toEqual(expect.objectContaining(
                {
                    title: expect.any(String),
                   network: expect.any(String),
                   password: expect.any(String),
                   userId: expect.any(Number)
                }
            ));

        })
    })
})

describe("DELETE: /wifi/:id", () => {
    it("Deve responder 401 se não for enviado um token", async () => {
        const response = await server.get("/wifi");
    
        expect(response.status).toBe(401);
    });
    
    it("Deve responder 401 se o token enviado não for válido", async () => {
        const token = faker.lorem.word()
        const response = await server.get("/wifi").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(401);
    });

    describe("Quando o token é válido",  () => {
        const validWifiBody ={
            title: faker.internet.email(),
            network:faker.name.firstName(),
            password: faker.internet.password(10),

        }

        it("Deve responder com 400 se o id estiver incorreto", async () => {
            const token = await generateValidToken();
      
            const response = await server.delete("/wifi/0").set("Authorization", `Bearer ${token}`);
                
            expect(response.status).toBe(400);
          });
      
        it("Deve responder com 401 se o wifi não for do usuário", async () => {
            const {token, userId} = await generateValidToken()
            const wifiId = createWifi(validWifiBody, userId + 1) 
        
            const response = await server.delete(`/wifi/${wifiId}`).set("Authorization", `Bearer ${token}`);
        
            expect(response.status).toBe(401);
        });
        
        it("Deve responder com 200  se o id for válido", async ()=> {
            const {token, userId} = await generateValidToken()
            const wifiId = createWifi(validWifiBody, userId)
            const response = await server.delete(`/wifi/${wifiId}`).set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
        })
    
    })
})