const API_URL = "https://grocery-backend-8nhl.onrender.com";
async function loadProducts() {
    let response = await fetch(`${API_URL}/products`);
    let products = await response.json();
    let productsDiv = document.getElementById("products");
    productsDiv.innerHTML = "";
    products.forEach(product => {
        let productDiv = document.createElement("div");
        productDiv.innerHTML = `
            <p>${product.name} - $${product.price}<p>
            <input type="number" id="qty-${product.id}" value = "1" min = "1">
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productsDiv.appendChild(productDiv);
    });
    renderChart(products);
}

function addToCart(productId) {
    let qty = document.getElementById(`qty-${productId}`).value;
    fetch(`${API_URL}/cart/add`,{
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({product_id:productId,quantity:parseInt(qty)})
    }).then(() => loadCart());
}

async function loadCart() {
    let response = await fetch(`${API_URL}/cart`);
    let cart = await response.json();
    let cartDiv = document.getElementById("cart");
    cartDiv.innerHTML="";
    cart.forEach(item=>{
        let itemDiv = document.createElement("div");
        itemDiv.innerHTML = `${item.name} - ${item.quantity} x $${item.price}`;
        cartDiv.appendChild(itemDiv);
    });
}

async function checkout() {
    let response = await fetch(`${API_URL}/checkout`,{method:"POST"});
    let result = await response.json();
    let checkoutMessage = document.createElement("div");
    checkoutMessage.innerHTML = `<h3>Checkout Successfully! Total:$${result.total}</h3>`;
    document.body.appendChild(checkoutMessage);
    loadCart();
}

function renderChart(products){
    let ctx = document.getElementById("ProductChart").getContext("2d");
    let productNames = products.map(p=>p.name);
    let productPrices = products.map(p=>p.price);
    new Chart(ctx,{
        type:"bar",
        data:{
            labels: productNames,
            datasets:[{
                label:"Product Prices",
                data: productPrices,
                backgroundcolor:"rgba(54,162,235,0.6)"
            }]
        }
    });
}

document.addEventListener("DOMContentLoaded",() => {
    loadProducts();
    loadCart();
});
