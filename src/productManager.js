import { promises as fs } from "fs";

export default class ProductManager {

    constructor() {
        this.path = "./src/products.json";
        this.products = [];
    };


    async addProduct(title, description, price, thumbnail, code, stock) {

        const codeProduct = this.products.find((p) => p.code === code);
        if (codeProduct) {
            return console.log("El código está repetido");
        };

        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        if (this.products.length === 0) {
            product.id = 1;
        } else {
            product.id = this.products[this.products.length - 1].id + 1;
        };

        this.products.push(product);
        await fs.writeFile(this.path, JSON.stringify(this.products));
    };


    async getProducts() {
        const allProducts = await fs.readFile(this.path, "utf-8");

        const parsedProducts = JSON.parse(allProducts);
        return parsedProducts;
    };

    async getProductsById (id) {
        try {
            const results = await this.getProducts();
            const product = results.find((p) => p.id === id);

            if (product) {
                return product;
            } else {
                return "Producto no existe";
            }
        } catch (error) {
            console.log(error);
        }
    };

    async updateById({ id, ...product }) {

        await this.deleteById(id);
        const oldProduct = await this.getProducts();
        const updateProduct = [{ id, ...product }, ...oldProduct];
        await fs.writeFile(this.path, JSON.stringify(updateProduct), "utf-8");

    };

    async deleteById(productId) {

        const allProducts = await this.getProducts();
        const index = allProducts.findIndex((p) => p.id === productId);

        if (index !== -1) {
            allProducts.splice(index, 1);

            await fs.writeFile(this.path, JSON.stringify(allProducts), "utf-8");
            console.log("Producto eliminado");
        } else {
            console.log("Not Found");

        };

    };

};
