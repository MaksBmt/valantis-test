export default class PageList {
    constructor(box) {
        this.box = box;
    }

    create() {
        const anchor = this.box.querySelector('h1');
        const html = `<ul class="main__pages pages"></ul>`
        if (anchor !== null) anchor.insertAdjacentHTML("afterEnd", html);
    }

    clear() {
        if (this.box.querySelector('.pages') !== null) {
            this.box.querySelector('.pages').remove();
        }
    }
}