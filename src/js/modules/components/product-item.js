export default class ProductItem {
    constructor(box) {
        this.box = box;
    }

    create(product, index) {
        let brand = product.brand ? product.brand : ''
        const html = `<li class="products__item product">       
        <div class="product__img">
        <span class="product__marker">${index + 1}</span>
        </div>
        <div class="product__wrap">
          <span class="product__id">id: ${product.id}</span>
          <span class="product__name">${product.product}</span>
          <span class="product__brand">Бренд: ${brand}</span>
          <span class="product__price">Цена: ${product.price} &#8381;</span>
        </div>     
        </li>`
        this.box.insertAdjacentHTML("beforeend", html);
    }
}