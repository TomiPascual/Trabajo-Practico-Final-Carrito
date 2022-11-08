import { Request, Response } from "express";
import { readSync } from "fs";
import cartModel from "../Models/Cart";
import productModel from "../Models/Product";

const cartController = {
    get: async( req: Request, res: Response) => {
        try{
            const findProducts = await cartModel.find()
            // Para poder mostrar la lista de productos en el cart.
            res.status(200).send(findProducts)
        }
        catch (error){
            res.status(500).send(error)
        }
    },
    add: async (req: Request, res: Response) => {
        try{
            const findProducts = await productModel.findOne({Name_Product: req.body.Name_Product});
            //Revisa si existe el producto antes de agregar uno
            if(findProducts?.Name_Product != undefined || findProducts?.Name_Product != null){
                const OperationsCart = {Amount: req.body.Amount, Price: findProducts.Price}
                if(OperationsCart.Amount <= findProducts.Amount){
                    //Si es true, agrega el producto y se elimina la Amount de  Model Product
                    const TotalPrice = OperationsCart.Price * OperationsCart.Amount;
                    //Se guardara el nuevo Price total en el carrito
                    const AddProduct = new cartModel({Name_Product: findProducts?.Name_Product, Amount: req.body.Amount, Price: TotalPrice});
                    await AddProduct.save();
                    //Usamos el save para actualizar los productos
                    const TotalStock = findProducts.Amount - OperationsCart.Amount;
                    //Usamos esta variable para guardar el stock total que quedo en la base de datos de products
                    if(TotalStock == 0){
                        //Si es true la cantidad de productos
                        findProducts.delete();
                    }
                    else{
                        findProducts.Amount = TotalStock;   
                        findProducts.In_Cart = true;
                        findProducts.save();
                    }
                    res.status(200).send(AddProduct);
                }
                else{
                    res.status(400).send(`No es posible agregar el producto ya que ${findProducts.Name_Product} no tiene el stock suficiente.`);
                }
            }
            else{
                res.status(404).send(`El producto ${findProducts?.Name_Product} no existe.`)
            }
        }
        catch(error){
            res.status(500).send(error);
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            //Buscamos el producto que queremos eliminar
            const findProduct = await cartModel.findOne({Name_Product: req.params.Name_Product})
            //Conectamos a la base de datos
            const Product = await productModel.findOne({... req.params})
            //Creamos un if para comprobar que el producto que queremos eliminar existe
            if(findProduct?.Name_Product != undefined && Product?.Name_Product != undefined){
                //Creamos un stock carrito para mostrar el stock del producto
                const StockCart = {Amount: findProduct?.Amount}
                //Guardamos el stock
                const StockProduct = {Amount: findProduct?.Amount}
                //Creamos una variable para guardar el stock del producto en la base de datos + el stock del producto del carrito
                const TotalStock = StockCart.Amount + StockProduct.Amount
                //Guardamos el nuevo estock en la base de datos de Products
                const productName = await cartModel.findOneAndDelete({Name_Product: req.params.Name_Product})
                Product.Amount = TotalStock;
                Product.save()
                res.status(200).send(`El producto ${findProduct.Name_Product} se  elimino con exito del carrito`)
            //Creamos esta condicion para controlar que si el producto existe en la base de datos de Cart pero no en la Products
            }
            else if(findProduct?.Name_Product != undefined && Product?.Name_Product == undefined && findProduct.Price != undefined){
                const OperationsCart = {Amount: findProduct.Amount, Price: findProduct.Price}
                const priceProduct = OperationsCart.Price / OperationsCart.Amount;
                //Creamo nuevamente el product en la base de datos
                const newProduct = new productModel({Name_Product: findProduct.Name_Product, Amount: findProduct.Amount, Price: findProduct.Price, In_Cart: false});
                //Guardamos el nuevo Product
                newProduct.save()
                //Borramos el Product del Cart y lo devolvemos a la base de datos
                findProduct.delete();
                res.status(200).send(`El producto ${findProduct.Name_Product} se elimino del carrito`)
            }
            else{
                res.status(404).send(`El producto ${findProduct} no existe`)
            }
        }
        catch(error){
            res.status(500).send(error);
        }
    }
}

export default cartController;