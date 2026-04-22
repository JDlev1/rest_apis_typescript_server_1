import request from 'supertest'
import server from '../../server'
import { connectDB } from '../../server'
import db from '../../config/db'

describe('POST api/productos',()=>{
    it('should display validation errors',async ()=>{
        const response=await request(server).post('/api/products').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.status).not.toBe(404)

    })
    it('shold validate that the price is greater than 0',async ()=>{
        const response=await request(server).post('/api/products').send({
            name: "Monitor-Curvo",
            price: "0"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)
    })
    it('shold validate that the price is greater is a number than 0',async ()=>{
        const response=await request(server).post('/api/products').send({
            name: "Monitor-Testing",
            price: "hOLA"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)
    })

    it('should create a new product',async ()=>{
        const response=await request(server).post('/api/products').send({
            name: "Mause-Testing",
            price: 100
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('error')
    })
})


describe('GET api/products',() => {
    it('shold check if api/products', async()=>{
        const response=await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })
    it('GET a JSON response with porducts',async ()=>{
        const response=await request(server).get('/api/products')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET api/products/:id',() => {
    it('shloud return a 404 responsefora non-existent product',async () => {
        const productId=2000
        const response=await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error')
        
    })
    it('should check a valid ID inthe URL',async () => {
        const response= await request(server).get('/api/products/not-valid-URL')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID  no valido')
    })
    it('get a JSON response fo a single products',async () => {
        const response= await request(server).get('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PATCH api/products',() => {
    it('should return 404 response for a no-existing product',async ()=>{
        const productoId= 2000
        const response= await request(server).patch(`/api/products/${productoId}`)
        
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('No hay resuiltados para ese producto')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')

    })
    it('should update the product availability',async ()=>{
        const response=await request(server).patch(`/api/products/1`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })  
})

describe('PUT api/products/:id',() => {
    it('should display validation error message when updating a producto',async () => {
        const response= await request(server).put(`/api/products/1`).send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toBe('data')
    })
    it('should validate that the price is greater than 0',async () => {
        const response=await request(server).put('/api/products/1').send({
            name: "Teclado Yama k55",
            price:0,
            availability: true
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('precio irreal')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })
    it('shuold validate url',async () => {
        const response =await  request(server).put('/api/products/no-validate-url').send({
            name: "Teclado Yama k55",
            price:300,
            availability: true
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no valido')

    })
    it('should return a 404 response for a  no-existent product ',async () => {
        const productId=200
        const response=await request(server).put(`/api/products/${productId}`).send({
            name: "Teclado Yama k55",
            price:300,
            availability: true
        })
        expect(response.status).toBe(400)
        expect(response.body.error).toBe('Producto no encontrado')
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })
    it('should update an product existen with valid data ',async () => {
        const productId=1
        const response=await request(server).put(`/api/products/${productId}`).send({
            name: "Teclado Yama k55",
            price:300,
            availability: true
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
    describe('DELETE api/products/:id',()=>{
        it('should check a valid id',async ()=>{
            const productId=1
            const response=await request(server).delete(`/api/products/not-valid-ID`)
            
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('errors')
            expect(response.body.errors[0].msg).toBe('No es unid Valido')
            expect(response.status).not.toBe(200)
            expect(response.body).not.toHaveProperty('data')
        })
        it('should return a 404 response for a non-existent product',async()=>{
            const porductId=2000
            const response= await request(server).delete(`/api/products/${porductId}`)

            expect(response.status).toBe(404)
            expect(response.body.error).toBe('No se encontro el producto')
            expect(response.body).toHaveProperty('error')

            expect(response.status).not.toBe(200)
        })
        it('should delete a product ', async () => {
            const response= await request(server).delete('/api/products/1')
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('data')
            expect(response.body.data).toBe('Producto deleteado')
            expect(response.status).not.toBe(400)
            expect(response.status).not.toBe(404)
        })
    })
})

jest.mock("../../config/db")
describe('connectDB',() => {
    it('should handle database connection error',async () => {
        jest.spyOn(db,'authenticate').mockRejectedValueOnce(new Error('hubo un error al conectar la base de datos X=('))
        const  consoleSpy= jest.spyOn(console,'log')

        await connectDB()
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('hubo un error al conectar la base de datos X=(')
        )
    })
})