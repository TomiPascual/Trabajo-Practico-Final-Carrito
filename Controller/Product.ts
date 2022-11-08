import { Request, Response } from "express";
import productModel from "../Models/Product";

const productController = {
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
    add: async (req: Request, res: Response) => {
        try{
            const existProduct = await productModel.findOne({Name_Product: req.body.Name_Product})
            if(existProduct){
                res.status(400).send(`El producto ${existProduct.Name_Product} ya se encuentra en la base de datos`)
            }
            else{
                const AddProduct = new productModel({... req.body})
                if(AddProduct.Amount > 0 && AddProduct.Name_Product != "" && AddProduct.Price >= 0){
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
    delete: async (req: Request, res: Response) => {
        try{
            const findProducts = await productModel.findOne({... req.params});
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