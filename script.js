document.addEventListener("DOMContentLoaded",(){
    loadProducts();
    loadCart();
    renderChart();
});

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

function addToCart(id,name,price) {
    let qty = document.getElementById(`qty-${id}`).value;
    if (isNaN(qty) || qty <=0){
        alert("Invalid quantity!");
        return;
}
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({id,name,price,qty});
    localStorage.setItem("cart",JSON.stringify(cart));
    loadCart();
}

function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart"))||[];
    let cartList = document.getElementById("cartItems");
    cartList.innerHTML = "";
    cart.forEach(item=>{
        let itemDiv = document.createElement("div");
        itemDiv.innerHTML = `${item.name} x ${item.qty} - $${item.price * item.qty}`;
        cartList.appendChild(itemDiv);
    });
}

function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if(cart.length ===0){
        alert("Your cart is empty!");
        return;
    }

fetch("https://grocery-backend-8nhl.onrender.com/checkout",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(cart)
}).then(response => response.json()).then(data=>{
    alert("Checkout Successful:"+JSON.stringify(data));
    localStorage.removeItem("cart");
    loadCart();
}).catch(error => console.error("Checkout error:",error));

function renderChart(){
    let ctx = document.getElementById("myChart").getContext("2d");
    if(!ctx){
        console.error("Canvas element not found!");
        return;
    }
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

