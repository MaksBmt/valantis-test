export default class ProductList {
    constructor(box) {
        this.box = box;
    }

    create() {
        const html = `<ul class="main__products products"></ul>`
        this.box.insertAdjacentHTML("beforeend", html);
    }

    clear() {
        if (this.box.querySelector('.products') !== null) {
            this.box.querySelector('.products').remove();
        }
    }
}