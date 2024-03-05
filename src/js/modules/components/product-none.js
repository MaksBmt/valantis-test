export default class ProdoctNone {
    constructor(box) {
        this.box = box;
    }

    create() {
        const html = `<p class="products__none">Товары не найдены</p>`
        this.box.insertAdjacentHTML("beforeend", html);
    }

    clear() {
        if (this.box.querySelector('.products__none') !== null) {
            this.box.querySelector('.products__none').remove();
        }
    }
}