import {Router} from 'express';
import ProductsManager from '../persistence/files/ProductsManagerFiles.js';

const router = Router();

const pm = new ProductsManager('assets/products.json');

// middleware de endpoint
const userRole = 'admin';
const isAdmin = (req, res, next) => {
    console.log("middleware de endpoint POST /api/products/")
    if(userRole === "user") {
        res.send("No tiene pernisos porque no es admin");
    } else {
        req.isAdmin = true;
        next();
    }
};

// GET /api/products
router.get("/", async (req, res) => {
    console.log('queryparam', req.query);
    const limit = parseInt(req.query.limit);
    const productsList = await pm.getProducts();
    if(limit) {
        const limitedList = productsList.slice(0, limit);
        res.send(limitedList);
    } else {
        res.send(productsList);
    }
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
    console.log('path param - ID:', req.params.pid);
    const id = parseInt(req.params.pid);
    const prod = await pm.getProductById(id);
    if(prod) {
        res.send(prod);
    } else {
        res.send(`Product with id:${id} can't be found.`);
    }
});

// POST /api/products
router.post("/", isAdmin, async (req, res) => {
    const productInfo = req.body;
    console.log("POST producttInfo", productInfo);
    await pm.addProduct(productInfo);
    res.json({ message: "Product was created." });
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const product = req.body;
    console.log("PUT product", product);
    await pm.updateProduct(id, product);
    res.json({ message: "Product was updated." });
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    console.log("DELETE product ID:", id);
    await pm.deleteProduct(id);
    res.json({ message: "Product was deleted." });
});

export { router as productsRouter };
