import expressRoutes, { Router } from "express";
import productRoutes from "./Product";
import cartRoutes from "./Cart";

//Creación de variable para enrutar los distintos modelos 
//Esto serán las rutas donde nos podremos comunicar con la API
const router = Router();

router.use("/product", productRoutes)
router.use("/cart", cartRoutes)


export default router;