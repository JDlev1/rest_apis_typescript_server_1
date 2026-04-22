import {Router} from 'express'
import { createProduct, getProductById, getProducts, updateProduct,updateAvailability, deleteById } from './handlers/product'
import { body, param } from 'express-validator'
import { handleInputErrors } from './middleware'

    const router=Router()
    /** 
    * @swagger
    * components:
    *   schemas:
    *       Product:
    *           type: object
    *           properties:
    *               id:
    *                   type: integer
    *                   description: The Product ID
    *                   example: 1
    *               name:
    *                   type: string
    *                   description: The Product name
    *                   example: Monitor Cruvo de 49Pulgadas
    *               price:
    *                   type: integer
    *                   description: The Product Price
    *                   example: 50 
    *               availability:
    *                   type: boolean
    *                   description: The state availability
    *                   example: true
    */  
    /**
     * @swagger
     * /api/products:
     *      get:
     *          summary: Get a list of products
     *          tags:
     *              - Products
     *          description: Return a list of products
     *          responses:
     *              200:
     *                  description: Sucessful response 
     *                  content:
     *                      application/json:
     *                          schema:
     *                              type: array
     *                              items:
     *                               $ref: '#/components/schemas/Product'  
     * 
     */
 
    router.get('/',getProducts)

    /**
     * @swagger
     * /api/products/{id}:
     *      get:
     *          summary: Get products by id
     *          tags:
     *              - Products
     *          description: Return a porduct on its unique ID
     *          parameters: 
     *            - in: path
     *              name: id
     *              description: The ID od the products to retrieve
     *              required: true
     *              schema:
     *                  type: integer
     *          responses:
     *              200:
     *                  description: Sucessfull Response
     *                  content: 
     *                      application/json:
     *                          schema:
     *                              $ref: '#/components/schemas/Product'
     *              404:
     *                  description: Not found 
     *              400:
     *                  description: Bad Request -Invalid ID
     * 
     */
  
    router.get('/:id',
        param('id').isInt().withMessage('ID  no valido'),
        handleInputErrors,
        getProductById)

    /**
     * @swagger
     * /api/products:
     *      post:
     *          summary: create new produtc
     *          tags:
     *              - Products
     *          description: Returns a new record in the base de datos
     *          requestBody:
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              name:
     *                                  type: string
     *                                  example: "Monitor Curvo led"
     *                              price:
     *                                  type: integer
     *                                  example: 300
     *          responses:
     *              201:
     *                  description: retunr a craete new product
     *                  content:
     *                      application/json:
     *                          schema:
     *                              $ref: '#/components/schemas/Product'
     *                          
     *              400:
     *                  description: bad request Not found
     * 
     */
    

    router.post('/',
        body('name').notEmpty().withMessage('El nombre del Producto no puede ir vacio'), 
        body('price').isNumeric().withMessage('Valor no valido').notEmpty().withMessage('El nombre del Precio no puede ir vacio').custom(valor=>valor > 0),
        handleInputErrors,

        createProduct)
    

    /**
     * @swagger
     * /api/products/{id}:
     *      put:
     *          summary: Updated a un product with user input
     *          tags:
     *              - Products
     *          description: Returns the updated product
     *          parameters:
     *            - in: path
     *              name: id
     *              description: The ID  of product to retrieve
     *              required: true
     *              schema:
     *                  type: integer
     *          requestBody:
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              name:
     *                                  type: string
     *                                  example: "Monitor Curvo 45 pulgadas"
     *                              price:          
     *                                  type: integer
     *                                  example: 550
     *                              availability:
     *                                  type: boolean
     *                                  example: true
     *          responses:
     *              200:
     *                  description: Sucessfull response
     *                  content:
     *                      application/json:
     *                          schema:
     *                              $ref: '#/components/schemas/Product' 
     * 
     *              400:
     *                  description: Bad Request - Invalid ID or Invalid input  data
     *              404:
     *                  description: Product Not found 
     */

    router.put('/:id',
        body('name').notEmpty().withMessage('El nombre del Producto no puede ir vacio'), 
        body('price').isNumeric().withMessage('Valor no valido').notEmpty().withMessage('El nombre del Precio no puede ir vacio').custom(valor=>valor > 0).withMessage('precio irreal'),
        body('availability').isBoolean().withMessage('Valor para disponibilidad no valido'),
        param('id').isInt().withMessage('ID no valido')
        // body('name').notEmpty().withMessage('El nombre del Producto no puede ir vacio'), 
        // body('price').isNumeric().withMessage('Valor no valido').notEmpty().withMessage('El nombre del Precio no puede ir vacio').custom(valor=>valor > 0)
        ,handleInputErrors,updateProduct)
    

    /**
     * @swagger
     *  /api/products/{id}:
     *      patch:
     *          summary: Update Product availability
     *          tags:
     *              - Products
     *          description: Return the updateavailability
     *          parameters:
     *            - in: path
     *              name: id
     *              description: Set ID in this field of product
     *              required: true
     *              schema:
     *                  type: integer
     *          responses:
     *              200:
     *                  description: Sucessfull update properties
     *                  content:
     *                     application/json:
     *                         schema:
     *                             $ref: '#/components/schemas/Product'
     *              400:
     *                  description: Bad Request 
     *              404:
     *                  description: Not found Request            
     * 
     */

    router.patch('/:id',
        param('id').isInt().withMessage('id no encontrado'),

        handleInputErrors,updateAvailability)
    /**
     * @swagger
     * /api/products/{id}:
     *      delete:
     *          summary: Delete a product
     *          tags:
     *              - Products
     *          description: Retunr a confirmation message
     *          parameters:
     *            - in: path
     *              name: id
     *              description: delete permanent by ID
     *              required: true
     *              schema:
     *                  type: integer
     *          responses:
     *              200:
     *                  content:
     *                      application/json:
     *                          schema:
     *                              type: string
     *                              value: 'Producto eliminado'
     *              400: 
     *                  description: Bad Request -Invalid ID
     *              404:
     *                  description: Product not Found 
     *          
     *      
     */

    router.delete('/:id',
        param('id').isInt().withMessage('No es unid Valido'),
        handleInputErrors,deleteById)


export default router