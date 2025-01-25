import { correctMarginMain } from "./modules/functions.js";
import { getHach } from "./modules/functions.js";
import Api from "./modules/api.js";
import PageItem from "./modules/components/page-item.js";
import PageList from "./modules/components/page-list.js";
import ProductList from "./modules/components/product-list.js";
import ProductItem from "./modules/components/product-item.js";
import Button from "./modules/components/button.js";
import Select from "./modules/components/select.js";
import Form from "./modules/components/form.js";
import ProdoctNone from "./modules/components/product-none.js";

correctMarginMain();


const URL = 'https://api.valantis.store:41000/';
const NameOption = {
  PRICE: 'price',
  PRODUCT: 'product',
  BRAND: 'brand'
};
const hach = getHach();
const VALUE_PAGES = 50;
const main = document.querySelector('.main__wrap');
const pageList = new PageList(main);
const productList = new ProductList(main);
const button = new Button(main);

const productNone = new ProdoctNone(main);
const api = new Api(URL, hach);

const formBox = main.querySelector('.form');
const form = new Form(formBox);

const boxDropdown = formBox.querySelector('.dropdown');
const dropdown = new Select(boxDropdown, 'dropdown--active', '.dropdown__wrap', '.dropdown__item');
dropdown.init();

const btnForm = formBox.querySelector('.form__button');
formBox.querySelector('#search').focus();

const params = {
  products: [],
  pages: 1
}

const paramsFilter = {
  products: [],
  pages: 1
}

const value = {
  catecory: '', search: ''
}

const clickPagesHandler = (pages, isButtonContinue, arrayProducts, { target }) => {
  target.parentElement.querySelectorAll('.pages__item').forEach((i) => {

    if (i.classList.contains('pages__item--active')) i.classList.remove('pages__item--active');
  });

  target.classList.add('pages__item--active');
  productList.clear();
  button.clear();

  if (target.dataset.page == pages) {
    if (isButtonContinue) {
      button.create('Загрузить еще');
      main.querySelector('.content-btn__button').addEventListener('click', clickButtonContinueHandler);
    }
  }

  renderMain(target.dataset.page, arrayProducts);
}

const clickButtonContinueHandler = async () => {

  const fetchproducts = await api.getProducts(params.pages * VALUE_PAGES);
  const newproducts = params.products.concat(fetchproducts);
  params.products = newproducts;
  params.pages = Math.ceil(newproducts.length / VALUE_PAGES);
  const page = main.querySelector('.pages__item--active').dataset.page

  pageList.clear();
  button.clear();
  renderPages(page, params.pages, true, params.products);
}

const clickButtonSearchHandler = async (evt) => {
  evt.preventDefault();
  const validateError = form.validate();

  if (validateError) return;
  const data = form.getValue();
  value.catecory = data.catecory;
  value.search = data.search;
  if (value.catecory === 'price') value.search = parseInt(value.search)

  handleOptionClick(value.catecory);
}

const renderPages = function (page = 1, pages, isButtonContinue, arrayProducts) {

  if (arrayProducts.length <= VALUE_PAGES) return;
  pageList.create();
  const pagesBox = main.querySelector('.pages');

  if (pagesBox !== null) {
    const pageItem = new PageItem(pagesBox);

    for (let i = 1; i <= pages; i++) {
      pageItem.create(i);
    }

    pagesBox.querySelectorAll('.pages__item').forEach((item, index) => {
      item.addEventListener('click', clickPagesHandler.bind(this, pages, isButtonContinue, arrayProducts));

      if (index + 1 == page) item.classList.add('pages__item--active');
    });
  }
}

const renderMain = function (page = 1, arrayProducts) {
  productNone.clear();

  if (!arrayProducts.length) {
    productNone.create();
    return;
  }

  productList.create();
  const productBox = main.querySelector('.products');
  const startproduct = (page - 1) * VALUE_PAGES + 1;
  if (productBox !== null) {

    const productItem = new ProductItem(productBox);
    for (let index = startproduct - 1; index < (page * VALUE_PAGES) && (index < arrayProducts.length); index++) {

      productItem.create(arrayProducts[index], index);
    }
  }
}

const renderFilter = function (pages, isButtonContinue) {
  pageList.clear();
  productList.clear();
  button.clear();
  button.clearBtnReturn();
  button.createBtnReturn('Вернуться к списку товаров');

  const btnReturn = main.querySelector('.content-btn--return');
  if (btnReturn !== null) {
    btnReturn.addEventListener('click', clickButtonReturnHandler);
  }

  renderPages(1, pages, isButtonContinue, paramsFilter.products);
  renderMain(1, paramsFilter.products);
  form.clearInputs();
}

const clickButtonReturnHandler = () => {
  button.clearBtnReturn();
  pageList.clear();
  productList.clear();
  renderPages(1, params.pages, true, params.products);
  renderMain(1, params.products);
}

const handleOptionClick = async (nameOption) => {
  switch (nameOption) {
    case NameOption.PRICE:
      const fetchResultPrice = await api.getProductsFilter({ price: value.search });
      paramsFilter.products = fetchResultPrice.fetchProducts;
      paramsFilter.pages = Math.ceil(paramsFilter.products.length / VALUE_PAGES);
      renderFilter(paramsFilter.pages, fetchResultPrice.isButtonContinue);
      break;
    case NameOption.PRODUCT:
      const fetchResultProduct = await api.getProductsFilter({ product: value.search });
      paramsFilter.products = fetchResultProduct.fetchProducts;
      paramsFilter.pages = Math.ceil(paramsFilter.products.length / VALUE_PAGES);
      renderFilter(paramsFilter.pages, fetchResultProduct.isButtonContinue);
      break;
    case NameOption.BRAND:
      const fetchResultBrand = await api.getProductsFilter({ brand: value.search });
      paramsFilter.products = fetchResultBrand.fetchProducts;
      paramsFilter.pages = Math.ceil(paramsFilter.products.length / VALUE_PAGES);
      renderFilter(paramsFilter.pages, fetchResultBrand.isButtonContinue);
      break;
  }
}

const renderErrorTopage = function() {  
  main.remove();
  const base = document.querySelector('main');
  base.style.cssText = `padding:20px;display:grid; place-items:center;font-size:clamp(16px, 16px + 1.27vw, 45px);`
  const html = `<p>Возникла ошибка соеденения. Попробуйте позже..</p>`
  base.insertAdjacentHTML('afterbegin',html)
}

const renderInit = async function () {
  params.products = await api.getProducts(0);

  if (params.products) {
    params.pages = Math.ceil(params.products.length / VALUE_PAGES);
    renderPages(1, params.pages, true, params.products);
    renderMain(1, params.products);

    btnForm.addEventListener('click', clickButtonSearchHandler);
  } else {
    renderErrorTopage()
  }
  // params.pages = Math.ceil(params.products.length / VALUE_PAGES);
  // renderPages(1, params.pages, true, params.products);  
  // renderMain(1, params.products);   

  // btnForm.addEventListener('click', clickButtonSearchHandler);
}

renderInit(); 