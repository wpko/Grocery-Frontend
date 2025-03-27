const API_URL = "https://grocery-backend-8nhl.onrender.com";
async function loadProducts() {
    let response = await fetch(`${API_URL}/products`);
    let products = await response.json();
    let productsDiv = document.getElementById("products");
    productsDiv.innerHTML = "";
    products.forEach(products=> {
        let div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <h3>${products.name}<h3>
            <p>Price: $${products.price}<p>
            <button onclick="addToCart(${products.id})">Add to Cart</button>
        `;
        productsDiv.appendChild(div);
    });
}

async function addToCart(productId) {
    await fetch(`${API_URL}/add-to-cart/${productId}`,{method:"POST"});
    loadCart();
}

async function loadCart() {
    let response = await fetch(`${API_URL}/cart`);
    let cartData = await response.json();
    let cartDiv = document.getElementById("cart");
    cartDiv.innerHTML="";
    cartData.cart.forEach(item=>{
        let div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `<h3>${item.name}</h3><p>$${item.price}</p>`;
        cartDiv.appendChild(div);
    });
}

async function checkout() {
    let response = await fetch(`${API_URL}/checkout`,{method:"POST"});
    let result = await response.json();
    alert(`Checkout Successful! Total: $${result.total}`);
    loadCart();
}

document.addEventListener("DOMContentLoaded",()=>{
    loadProducts();
    loadCart();
});
