import { Router } from "express";
import productController from "../../Controller/Product";

const router = Router();


//Utilizamos las controladoras creadas para los productos.

router.get("/", productController.get)
//Utilizar parametros para seleccionar un producto único
router.get('/:Name_Product', productController.getunique)

router.post("/", productController.add)

router.delete("/:Name_Product", productController.delete)

export default router;