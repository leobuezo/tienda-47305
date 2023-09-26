import ProductsManagerFiles from './files/ProductsManagerFiles.js';
import CartsManagerFiles from './files/CartsManagerFiles.js';
import { __dirname } from '../utils.js';
import path from 'path';

export const productsService = new ProductsManagerFiles(path.join(__dirname, '../assets/products.json'));
export const cartsService = new CartsManagerFiles(path.join(__dirname, '../assets/carts.json'))
