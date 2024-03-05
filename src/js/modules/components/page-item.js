export default class PageItem {
    constructor(box) {
        this.box = box;
    }

    create(page) {
        const html = `<li class="pages__item" data-page='${page}'>${page}</li>`
        this.box.insertAdjacentHTML("beforeend", html);
    }
}