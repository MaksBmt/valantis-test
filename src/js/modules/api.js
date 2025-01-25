import { getUniqueArray } from "./functions.js";
import Preloader from "./components/preloader.js";

export default class Api {
    constructor(url, hach) {
        this.hach = hach;
        this.url = url;
        this.limit = 100;
        this.successHTTPStatusMin = 200;
        this.successHTTPStatusMax = 299;
        this.preloaderBox = document.querySelector('.preloader');
        if (this.preloaderBox !== null) {
            this.preloader = new Preloader(this.preloaderBox);
        }
    }

    async _fetch(action, params) {
        return await fetch(this.url, {
            "headers": {
                "Content-Type": "application/json;charset=utf-8",
                "X-Auth": this.hach
            },
            method: "POST",
            body: JSON.stringify({
                action: action,
                params: params
            })
        })
            .then(response => this.checkStatus(response))
            .then(Api.toJSON)
            .catch(Api.catchError);
    }

    async getProducts(offset) {
        this.preloader.toggle();
        const id = await this._fetch("get_ids", { offset, limit: this.limit });

        if(id){
            const ids = getUniqueArray(id.result);
            const fetchProducts = await this._fetch("get_items", { ids })
            if (fetchProducts.result) this.preloader.toggle();
            return getUniqueArray(fetchProducts.result);
        } else {
            this.preloader.toggle();
        }
        // const ids = getUniqueArray(id.result);
        // const fetchProducts = await this._fetch("get_items", { ids })
        // if (fetchProducts.result) this.preloader.toggle();
        // return getUniqueArray(fetchProducts.result);
    }

    async getProductsFilter(paramsFetch) {
        const fetchResult = { fetchProducts: [], isButtonContinue: false };
        this.preloader.toggle();
        const id = await this._fetch("filter", paramsFetch);

        const ids = getUniqueArray(id.result);
        const products = await this._fetch("get_items", { ids })

        fetchResult.fetchProducts = getUniqueArray(products.result);
        if (fetchResult.fetchProducts) this.preloader.toggle();
        return fetchResult;
    }

    checkStatus(response) {
        if (
            response.status < this.successHTTPStatusMin ||
            response.status >= this.successHTTPStatusMax
        ) {

            this.preloader.setText('Что-то пошло не так. Перегрузите страницу!');
            throw new Error(`${response.status}: ${response.statusText}`);
        }

        return response;
    }

    static toJSON(response) {
        return response.json();
    }

    static catchError(err) {
        // throw err;
        console.error("Ошибка запроса:", err.message || err);
        alert("Произошла ошибка соединения с сервером. Проверьте подключение к интернету или попробуйте позже.");
        return null;
    }
}