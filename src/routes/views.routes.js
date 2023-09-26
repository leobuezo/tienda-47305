import { Router } from "express";
import { productsService } from "../persistence/index.js";

const router = Router();

router.get('/', async (req, res) => {
    const products = await productsService.getProducts();
    console.log('products', products);
    res.render('home', {products});
});

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts');
});

export { router as viewsRouter };