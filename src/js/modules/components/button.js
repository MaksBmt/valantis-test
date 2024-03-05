export default class Button {
    constructor(box) {
        this.box = box;
    }

    create(text) {
        const html = `<div class="content-btn content-btn--continue">
        <button class="content-btn__button">${text}</button>
      </div>`
        this.box.insertAdjacentHTML("beforeend", html);
    }

    createBtnReturn(text) {
        const html = `<div class="content-btn content-btn--return">
        <button class="content-btn__button">${text}</button>
      </div>`
        this.box.insertAdjacentHTML("beforeend", html);
    }

    clear() {
        const button = this.box.querySelector('.content-btn--continue');
        if (button !== null) button.remove();
    }

    clearBtnReturn() {
        const button = this.box.querySelector('.content-btn--return');
        if (button !== null) button.remove();
    }
}