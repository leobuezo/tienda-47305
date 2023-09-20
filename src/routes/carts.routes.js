import {Router} from 'express';
import CartManager from '../CartManager.js';

const router = Router();

const cm = new CartManager('assets/carts.json');

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

// GET /api/carts
router.get("/", async (req, res) => {
    console.log('queryparam', req.query);
    const limit = parseInt(req.query.limit);
    const cartsList = await cm.getCarts();
    if(limit) {
        const limitedList = cartsList.slice(0, limit);
        res.send(limitedList);
    } else {
        res.send(cartsList);
    }
});

// GET /api/carts/:pid
router.get("/:cid", async (req, res) => {
    console.log('path param - ID:', req.params.cid);
    const id = parseInt(req.params.cid);
    const cart = await cm.getCartById(id);
    if(cart) {
        res.send(cart);
    } else {
        res.send(`Cart with id:${id} can't be found.`);
    }
});

// POST /api/carts
// Content-Length: 0
router.post("/", isAdmin, async (req, res) => {
    console.log("POST creating cart");
    console.log("Content-Length:", req.headers['content-length']);
    await cm.addNewCart();
    res.json({ message: "Cart was created." });
});

// POST /api/carts
router.post("/:cid/product/:pid", isAdmin, async (req, res) => {
    console.log("POST add product to cart");
    const idCart = parseInt(req.params.cid);
    const idProduct = parseInt(req.params.pid);
    const cart = await cm.getCartById(idCart);
    if(cart) {
        await cm.addProductToCart(idCart, idProduct);
        res.json({ message: "Item was added to the cart." });
    } else {
        res.send(`Cart with id:${id} can't be found.`);
    }

});

export { router as cartsRouter };
