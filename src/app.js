import express from 'express';
import { __dirname } from './utils.js';
import path from 'path';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { viewsRouter } from './routes/views.routes.js';
import { productsService } from './persistence/index.js';

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
app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//Products socket server
io.on('connection', async socket => {
	console.log('client connected.');
	const realTimeProductsList = await productsService.getProducts();
    io.emit('rtpList', realTimeProductsList);

    socket.on('productAdded', async data => {
        console.log('Product added: ', data);
		await productsService.addProduct(data);
		const realTimeProductsListAdded = await productsService.getProducts();
        io.emit('rtpAdded', realTimeProductsListAdded);
    });

    socket.on('productRemoved', async data => {
        console.log('Product removed ID: ', data);
		await productsService.deleteProduct(data);
		const realTimeProductsListRemoved = await productsService.getProducts();
        io.emit('rtpRemoved', realTimeProductsListRemoved);
    });

	socket.on('disconnect', () => {
        console.log('Client disconected.');
    });
});