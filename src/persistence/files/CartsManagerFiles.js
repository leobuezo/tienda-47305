import fs from 'fs';

export default class CartsManagerFiles {
    #NOT_FOUND = 'Not found';
    constructor(path) {
        this.path = path;
        console.log("file exists: ", this.#fileExists());
        console.log(this.path)
    }

    async getCarts() {
        try {
            if(this.#fileExists()) {
                const info = await fs.promises.readFile(this.path, "utf-8");
                const cm = JSON.parse(info);
                return cm;
            } else {
                return console.log("No es posible leer el cart.");
            }
        } catch(error) {
            throw error;
        }
    }

    async getCartById(id) {
        if(!id) {
            console.log("Debe ingresar un ID válido.");
        }
        const cartList = await this.getCarts();
        let idFound = cartList.find(cart => id == cart.id);
        return idFound ? idFound : this.#NOT_FOUND;
    }

    async addNewCart() {
        try {
            if(this.#fileExists()) {
                const info = await fs.promises.readFile(this.path, "utf-8");
                const cm = JSON.parse(info);
                let newId = (cm.length == 0) ? 1 : (cm.length + 1);
                const newCart = { id: newId, products: [] };
                cm.push(newCart);
                await fs.promises.writeFile(this.path, JSON.stringify(cm, null, '\t'));
                console.log("Nuevo cart creado.");
            } else {
                throw new Error("No es posible crear un nuevo cart.");
            }
        } catch(error) {
            throw error;
        }
    }

    async addProductToCart(idCart, idProduct) {
        try {
            if(!idCart) {
                console.log("Debe ingresar un ID válido.");
            }
            const cartList = await this.getCarts();
            let index = cartList.findIndex(cart => idCart == cart.id);
            if(index == -1) {
                return console.log("El ID del cart no fue localizado.");
            }
            const newProductAdded = { id: idProduct, quantity: 1 };
            let indexProd = cartList[index].products.findIndex(prod => idProduct == prod.id);
            if(cartList[index].products[indexProd]) {
                cartList[index].products[indexProd].quantity += 1;
            } else {
                cartList[index].products.push(newProductAdded);
            }
            //cartList[index] = {...cartList[index], ...newProductAdded};
            await fs.promises.writeFile(this.path, JSON.stringify(cartList, null, '\t'));
            console.log("Producto agregado al cart.");
        } catch(error) {
            throw error;
        }
    }

    #fileExists() {
        return fs.existsSync(this.path);
    }
}
