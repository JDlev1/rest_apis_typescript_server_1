import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";


const options:swaggerJSDoc.Options={
    swaggerDefinition:{
        openapi: '3.0.2',
        tags: [
            {
                name: 'Products',
                description:'API operations related to products'
            }
        ],
        info:{
            title: 'REST API Node.js / Express / TypeScript',
            version:"1.0.0",
            description:"API Docst for Products"
        }
    },
    apis: ['./src/router.ts']    
}

const swaggerSpec = swaggerJSDoc(options)

//imagen cambio
    const swaggerUiOptions : SwaggerUiOptions ={
        customCss: `
        .topbar-wrapper .link {

            content: url('https://cdn.freebiesupply.com/logos/large/2x/react-1-logo-png-transparent.png');
            max-height: 80px;
            max-width: auto
            
        }
  
        `,
        customSiteTitle:"Documentacion REST API Express/ Typesript"
    }
//
export default swaggerSpec


//imagen export 
export {
    swaggerUiOptions
}