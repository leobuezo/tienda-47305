console.log("Javascript en el frontend");
//socket del cliente
const socketClient = io();

const productsList = document.getElementById('productsList');
const removeItem = document.getElementById('remove_item');
socketClient.on('rtpList', rtpData => {
    let productElem = '';
    rtpData.forEach( productItem => {
        productElem += `<div class="product" id="productItem">
            <img src=${productItem.thumbnail} alt="${productItem.title}">
            <button class="btn-floating btn-small waves-effect waves-light red" id="remove_item" onclick="removeProduct(${productItem.id})"><i class="material-icons">remove_shopping_cart</i></button>
            <h2>ID: ${productItem.id} | ${productItem.title}</h2>
            <p class="description">${productItem.description}</p>
            <p class="price">$ ${productItem.price}</p>
            <p class="code">Código: ${productItem.code}</p>
            <p class="stock">Stock: ${productItem.stock}</p>
        </div>`;
    });
    productsList.innerHTML = productElem;
});

socketClient.on('rtpAdded', rtpDataAdded => {
    let productElem = '';
    rtpDataAdded.forEach( productItem => {
        productElem += `<div class="product" id="productItem">
            <img src=${productItem.thumbnail} alt="${productItem.title}">
            <button class="btn-floating btn-small waves-effect waves-light red" id="remove_item" onclick="removeProduct(${productItem.id})"><i class="material-icons">remove_shopping_cart</i></button>
            <h2>ID: ${productItem.id} | ${productItem.title}</h2>
            <p class="description">${productItem.description}</p>
            <p class="price">$ ${productItem.price}</p>
            <p class="code">Código: ${productItem.code}</p>
            <p class="stock">Stock: ${productItem.stock}</p>
        </div>`;
    });
    productsList.innerHTML = productElem;
});

socketClient.on('rtpRemoved', rtpDataAdded => {
    let productElem = '';
    rtpDataAdded.forEach( productItem => {
        productElem += `<div class="product" id="productItem">
            <img src=${productItem.thumbnail} alt="${productItem.title}">
            <button class="btn-floating btn-small waves-effect waves-light red" id="remove_item" onclick="removeProduct(${productItem.id})"><i class="material-icons">remove_shopping_cart</i></button>
            <h2>ID: ${productItem.id} | ${productItem.title}</h2>
            <p class="description">${productItem.description}</p>
            <p class="price">$ ${productItem.price}</p>
            <p class="code">Código: ${productItem.code}</p>
            <p class="stock">Stock: ${productItem.stock}</p>
        </div>`;
    });
    productsList.innerHTML = productElem;
});

function removeProduct(id) {
    console.log('Remove Product: ', id);
    Swal.fire({
        text: "Product was removed."
    });
    socketClient.emit('productRemoved', id);
}
