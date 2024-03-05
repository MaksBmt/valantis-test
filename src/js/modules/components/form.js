export default class Form {
    constructor(form) {
        this.form = form;
        this.inputs = this.form.querySelectorAll('input');
        this.inputError = [];
        this.textErrorBox = this.form.querySelectorAll('.form__error');
        this.value = { catecory: '', search: '' };

        this._inputSearchClickHandler = this._inputSearchClickHandler.bind(this);
    }

    validate() {
        let errorText = '';
        this.inputError = [];
        this.inputs.forEach((i, index) => {
            if (!i.value) {
                if (i.id === 'category') {
                    errorText = 'Необходимо выбрать категорию';
                    this._getErrorAtributes(i, index, errorText);
                }

                if (i.id === 'search') {
                    errorText = 'Необходимо заполнить поле';
                    this._getErrorAtributes(i, index, errorText);
                }
            }

            if (i.value.length && i.value.length <= 2) {
                if (i.id === 'search') {
                    errorText = 'В поле должно быть больше двух знаков';
                    this._getErrorAtributes(i, index, errorText);
                }
            }

            i.addEventListener('click', this._inputSearchClickHandler);
        });

        return this.inputError.length;
    }

    getValue() {
        this.inputs.forEach((el) => {

            if (el.id === 'category') {
                this.value.catecory = this.form.querySelector('.dropdown__item--activ').dataset.name;
            }

            if (el.id === 'search') {
                this.value.search = el.value.trim();
            }
        });

        return this.value;
    }

    clearInputs() {
        this.inputs.forEach(input => input.value = '');
        const pointActive = this.form.querySelector('.dropdown__item--activ');
        if (pointActive !== null) pointActive.classList.remove('dropdown__item--activ');
    }

    _getErrorAtributes = (el, index, text) => {
        el.classList.add('form__input--error');
        this.textErrorBox[index].textContent = text;
        this.textErrorBox[index].classList.add('form__error--active');
        this.inputError.push(el);
    }

    _inputSearchClickHandler({ target }) {
        target.classList.contains('form__input--error')
            ? target.classList.remove('form__input--error')
            : '';

        this.textErrorBox.forEach((p) => {
            if (target.id === p.dataset.error) {
                p.textContent = '';

                if (p.classList.contains('form__error--active')) {
                    p.classList.remove('form__error--active');
                }
            }
        });
        target.removeEventListener('click', this._inputSearchClickHandler);
    }
}