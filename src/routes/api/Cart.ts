import { Router } from "express";
import cartController from "../../Controller/Cart";

//Invocamos la ruta de express
const router = Router();

router.get("/", cartController.get)

router.post("/", cartController.add)

router.delete("/:Name_Product", cartController.delete)

export default router;