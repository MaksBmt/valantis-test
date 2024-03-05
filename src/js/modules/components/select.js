/**
 * открывает по клику стилизованный под select дропдаун, за счет присваивания обертке значения max-heigth придает плавность "открывания" контента. Закрыть можно как кликом при выборе нужной опции, так и по "body" или "esc". Реализован поиск похожий на дефолтный select - по первым буквам опции.
 * 
 * @param {string} box - элемент документа, внутри которого реализован дропдаун. Ссылка на него получена методом querySelector
 * @param {string} classToggle - класс, при котором применяются стили для открытия списка. Используется в classList, поэтому в аргументах писать без точки, но в кавычках ('dropdown--active')
 * @param {string}  wrapListSelect - класс для обертки списка. Используется в querySelector, поэтому пишем с точкой
 * @param {string}  classOption - класс для конкретной опции. Используется в querySelector, поэтому пишем с точкой
 * 
 * в методах также используются дефолтные классы: "dropdown__item--activ" - для активной опции и тэг "input" для получения ссылки на поле заполнения-вывода активной опции. Класс можно заменить переменной или своим значением. Вместо тэга можно использовать класс.
 * 
 * инициализируется методом init()
 * поиск инициализируется методом serchSelect()
 */

export default class Select {
    constructor(box, classToggle, wrapListSelect, classOption) {
        this.box = box;
        this.toggle = classToggle;
        this.wrapListSelect = wrapListSelect;
        this.value = null;
        this.listDropdown = this.box.querySelector(`${this.wrapListSelect}`);

        this.options = this.box.querySelectorAll(`${classOption}`);

        this._optionClickHandler = this._optionClickHandler.bind(this);
        this._bodyClickHandler = this._bodyClickHandler.bind(this);
        this._escKeyHandler = this._escKeyHandler.bind(this);
        this._inputSelectHandler = this._inputSelectHandler.bind(this);
    }

    init() {
        this.box.addEventListener('click', (evt) => {

            evt.stopPropagation();
            this._openSelect();
        });

        Array.from(this.options).forEach((option) => {
            option.addEventListener('click', this._optionClickHandler);
        });
    }

    serchSelect() {
        this.box.querySelector('input').addEventListener('input', this._inputSelectHandler)
    }

    _openSelect() {
        this.box.classList.toggle(`${this.toggle}`);
        this.listDropdown.style.width = this.box.querySelector('input').offsetWidth + 'px';

        if (this.box.classList.contains(`${this.toggle}`)) {
            this.listDropdown.style.maxHeight = this.listDropdown.scrollHeight + "px";
        } else {
            this.listDropdown.style.maxHeight = null;
        }

        document.addEventListener('click', this._bodyClickHandler);
        document.addEventListener(`keydown`, this._escKeyHandler);
    }

    _closeSelect() {
        if (this.box.classList.contains(`${this.toggle}`)) {
            this.listDropdown.style.maxHeight = null;
            this.box.classList.remove(`${this.toggle}`);
        }
    }

    _bodyClickHandler() {
        this._closeSelect();
        document.removeEventListener('click', this._bodyClickHandler);
    }

    _escKeyHandler(evt) {
        if (evt.key === `Escape` || evt.key === `Esc`) {

            this._closeSelect();
            document.removeEventListener(`keydown`, this._escKeyHandler);
        }
    }

    _inputSelectHandler({ target }) {
        this.value = target.value
        const arrOption = [];

        Array.from(this.options)
            .map((option) => {
                arrOption.push(option.textContent.toLowerCase());
            });

        const result = this._getCoincidences(arrOption);

        if (result) {
            const index = arrOption.indexOf(result);
            this.box.querySelector('input').value = (this.options)[index].textContent;
            this.box.querySelector('input').blur();
            this._clearClassActive();
            this.options[index].classList.add('dropdown__item--activ');
        }
    }

    _getCoincidences(arr) {
        for (let i = 0; (arr.length - 1) > i; i++) {

            if (arr[i].split('')[0] == this.value) {
                return arr[i];
            }
        }
    }

    _clearClassActive() {
        Array.from(this.options).forEach((option) => {
            if (option.classList.contains('dropdown__item--activ')) option.classList.remove('dropdown__item--activ');
        });
    }

    _optionClickHandler(evt) {
        this.box.querySelector('.dropdown__input').value = evt.target.textContent;
        this._clearClassActive();
        evt.target.classList.add('dropdown__item--activ');
    }
}