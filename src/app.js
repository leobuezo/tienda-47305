import express from 'express';
import { __dirname } from './utils.js';
import path from 'path';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import ProductManager from './ProductManager.js';
import {Router} from 'express';
const pm = new ProductManager('assets/products.json');
const router = Router();

const port = process.env.PORT || 8080;
const app = express();

//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

//http express webserver
const httpServer = app.listen(port, () => console.log("HTTP Server OK"));

//Socket.io server
const io = new Server(httpServer);

app.use(express.urlencoded({ extended: true }));

//Handlebars setup
app.engine('hbs', engine({ extname: '.hbs'}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));

//routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get('/', async (req, res) => {
    const products = await pm.getProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
    const products = await pm.getProducts();
    res.render('home', { products });
});

//Products socket server
let realTimeProductsList = [];
io.on('connection', socket => {
    io.emit('rtpList', realTimeProductsList);
    socket.on('productAdded', data => {
        console.log('Product added: ', data);
        realTimeProductsList.push(data);
        io.emit('rtpAdded', realTimeProductsList);
    });

    socket.on('productRemoved', id => {
        console.log('Product removed ID: ', id);
        realTimeProductsList = realTimeProductsList.filter( prod => prod.id !== id);
        io.emit('rtpRemoved', realTimeProductsList);
    });
});