import fs from 'fs';

export default class ProductsManagerFiles {
    #NOT_FOUND = 'Not found';
    constructor(path) {
        this.path = path;
        console.log("file exists: ", this.#fileExists());
        console.log(this.path)
    }

    async addProduct(product) {
        try {
            if(this.#fileExists()) {
                const info = await fs.promises.readFile(this.path, "utf-8");
                const pm = JSON.parse(info);
                let newId = (pm.length == 0) ? 1 : (pm.length + 1);
                const newProduct = this.#createProductObject(newId, product.title, product.description, product.price, product.thumbnail, product.code, product.stock, product.status);
                pm.push(newProduct);
                await fs.promises.writeFile(this.path, JSON.stringify(pm, null, '\t'));
                console.log("Producto agregado.");
            } else {
                throw new Error("No es posible crear el producto.");
            }
        } catch(error) {
            throw error;
        }
    }

    #createProductObject(id, title, description, price, thumbnail, code, stock, status) {
        if((!title) || (!description) || (!price) || (!thumbnail) || (!stock)) {
            console.log("All fields are mandatory.");
            return null;
        } else {
            const product = {
                id,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                status
            }
            return product;
        }
    }

    async getProducts() {
        try {
            if(this.#fileExists()) {
                const info = await fs.promises.readFile(this.path, "utf-8");
                const pm = JSON.parse(info);
                return pm;
            } else {
                return console.log("No es posible leer el producto.");
            }
        } catch(error) {
            throw error;
        }
    }

    async getProductById(id) {
        if(!id) {
            console.log("Debe ingresar un ID válido.");
        }
        const prodList = await this.getProducts();
        let idFound = prodList.find(prod => id == prod.id);
        return idFound ? idFound : this.#NOT_FOUND;
    }

    async updateProduct(id, product) {
        try {
            let productsList = await this.getProducts();
            let index = productsList.findIndex( prod => id == prod.id);
            if(index === -1) {
                return console.log("El producto no fue localizado.");
            } else if(product.id) {
                return console.log("No es posible cambiar el id del producto.");
            }
            productsList[index] = {...productsList[index], ...product};
            await fs.promises.writeFile(this.path, JSON.stringify(productsList, null, '\t'));
            console.log("Información del producto actualizada.");
        } catch(error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const productsList = await this.getProducts();
            let index = productsList.findIndex( prod => id == prod.id);
            if(index === -1) {
                return console.log("El producto no fue localizado.");
            }
            const newProductsList = productsList.filter( prod => prod.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(newProductsList, null, '\t'));
            console.log("Producto eliminado exitosamente.");
        } catch(error) {
            throw error;
        }

    }

    #fileExists() {
        return fs.existsSync(this.path);
    }
}
