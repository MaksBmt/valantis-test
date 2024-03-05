export default class Preloader {
    constructor(box) {
        this.box = box;
    }

    toggle() {
        this.box.classList.toggle('preloader--show');
    }

    setText(text) {
        if (this.box.classList.contains('preloader--show')) {
            this.box.querySelector('.preloader__text').textContent = text;
            this.box.querySelector('.preloader__text').style.color = 'red';
        }
    }
}