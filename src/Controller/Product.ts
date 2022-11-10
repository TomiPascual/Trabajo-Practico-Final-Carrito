import { Request, Response } from "express";
import productModel from "../Models/Product";

const productController = {
    //Creamos el get para mostrar la lista de productos que estan cargados en la base de datos
    get: async (req: Request, res: Response) => {
        try{
            const findProducts = await productModel.find()
            res.status(200).send(findProducts)
        }
        catch (error){
            res.status(500).send(error)
        }
    },
    //Usamos getunique para poder buscar un producto especifico
    getunique: async (req: Request, res: Response) => {
        try{
            const findProductsUnique = await productModel.findOne({... req.params})
            if(findProductsUnique?.Name_Product != undefined){
                res.status(200).send(findProductsUnique)
            }
            else{
                res.status(404).send(`El producto no existe.`)
            }
        }
        catch (error){
            res.status(500).send(error)
        }
    },
    //Creamos el add para agregar un nuevo producto a la base de datos de productos
    add: async (req: Request, res: Response) => {
        try{
            //Ponemos los parametros del prducto que queremos agregar
            const existProduct = await productModel.findOne({Name_Product: req.body.Name_Product})
            //Si el producto que queremos agregar ya existe, enviamos mensaje diciendo que ya se encuentra cargado en la base de datos
            if(existProduct){
                res.status(400).send(`El producto ${existProduct.Name_Product} ya se encuentra en la base de datos`)
            }
            //Si no se encuentra cargado lo agregamos
            else{
                const AddProduct = new productModel({... req.body})
                //Creamos esta condicion para verificar que los valores de los parametros esten bien
                if(AddProduct.Amount > 0 && AddProduct.Name_Product != "" && AddProduct.Price >= 0){
                    //Guardamos el nuevo producto
                    await AddProduct.save()
                    res.status(200).send(AddProduct)
                }
                else{
                    res.status(400).send(`No se puede agregar este producto`)
                }
            }
        }
        catch (error){
            res.status(500).send(error)
        }
    },
    //Creamos el delete para eliminar un producto de la base de datos de productos
    delete: async (req: Request, res: Response) => {
        try{
            //Buscamos el producto que queremos eliminar
            const findProducts = await productModel.findOne({... req.params});
            //Si el producto existe lo eliminamos
            if(findProducts?.Name_Product != undefined || findProducts?.Name_Product != null){
                const productName = await productModel.findOneAndDelete({... req.params});
                res.status(200).send(`Se elimino ${productName?.Name_Product}`);
            }
            else{
                res.status(404).send(`El producto ${req.params.Name_Product} no existe.`)
            }
        }
        catch (error){
            res.status(500);
        }
    },
}

export default productController