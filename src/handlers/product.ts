import {Request,Response} from 'express'
import { body, check , validationResult } from 'express-validator'
import Product from '../models/Product.model'


export const createProduct= async (req:Request ,res:Response )=>{
    //validacion((
    // await check('name').notEmpty().withMessage('El nombre dekl producto no puede ir vacio').run(req)
    // await check('price').isNumeric().withMessage('Valor no valido').notEmpty().withMessage('El precio no puede estar vacio').custom(value=> value>0).withMessage('Precio no valido ').run(req)

    // let errors= validationResult(req)
    // if(!errors.isEmpty()){  
    //     return res.status(400).json({errors: errors.array()})
    // }
    try {
        const product=await  Product.create(req.body)
        res.status(201).json({data:product})
        
    } catch (error) {
        console.log(error)
    }
}


export const getProducts= async (require:Request,res:Response)=>{

    try {
        const products= await Product.findAll({
            order:[['id','DESC']]
        }) 
        res.json({data:products})
    } catch (error) {
        
    }

}

export const getProductById=async (req:Request,res:Response)=>{
    try {
        const  id  = Number(req.params.id)
        const product =  await Product.findByPk(id)
        if(!product){
            return res.status(400).json({error:'Producto no encontrado'})
        }
        res.json({data:product})
    } catch (error) { 
        console.log(error)
    }
}

export const updateProduct=async (req:Request,res:Response)=>{
    try {
        // controlid
        const id=Number(req.params.id)
        const product= await Product.findByPk(id)
        if(!product){
            return res.status(400).json({error:'Producto no encontrado'})
        }
        await product.update(req.body)

        // await product.save()
        res.json({data:product})


    } catch (error) {
        console.log(error)
    }
}

export const updateAvailability=async (req:Request,res:Response)=>{
    try {
        const id=Number(req.params.id)
        const product=await Product.findByPk(id)
        if(!product){
            return res.status(404).json({error:'No hay resuiltados para ese producto'})
        }
        product.availability= !product.dataValues.availability
        product.save()
        res.json({data:product})

    } catch (error) {
        
    }
}
 export const deleteById= async (req:Request,res:Response)=>{
    const id= Number(req.params.id)
    const product=await Product.findByPk(id)
    if(!product){
        return res.status(404).json({error:'No se encontro el producto'})
    }
    
    await product.destroy() 

    res.json({data:'Producto deleteado'})

 }