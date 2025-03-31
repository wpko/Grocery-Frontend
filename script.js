document.addEventListener("DOMContentLoaded",function(){
    loadProducts();
    loadCart();
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
            <p>${product.name} - $${product.price}</p>
            <input type="number" id="qty-${product.id}" value = "1" min = "1">
            <button onclick="addToCart(${product.id},'${product.name}',${product.price})">Add to Cart</button>
        `;
        productsDiv.appendChild(productDiv);
    });
    renderChart(products);
}

function addToCart(id,name,price) {
    let qty = parseInt(document.getElementById(`qty-${id}`).value);
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
    let total = 0;
    cartList.innerHTML = "";
    cart.forEach(item=>{
        let itemName = item.name || "Unknown Item";
        let itemQty = parseInt(item.qty) || 1;
        let itemPrice = parseFloat(item.price) || 0;
        let totalPrice = (itemPrice*itemQty).toFixed(2);
        total += parseFloat(totalPrice);
        let itemDiv = document.createElement("div");
        itemDiv.innerHTML = `${itemName} x ${itemQty} - $${itemPrice}`;
        cartList.appendChild(itemDiv);
    });
    document.getElementById("totalAmount").innerText =  `Total: $${total.toFixed(2)}`;
}

function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    fetch(`${API_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart)
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("checkoutMessage").innerHTML=
                `<p>Checkout Successful!</p>
                <p>Message:${data.message}</p>
                <p>Total:$${data.total || 0}</p>`;
            localStorage.removeItem("cart");
            loadCart();
    }).catch(error => console.error("Checkout error:", error));
}

function renderChart(products) {
    let ctx = document.getElementById("myChart").getContext("2d");
    if (!ctx) {
        console.error("Canvas element not found!");
        return;
    }
    let productNames = products.map(p => p.name);
    let productPrices = products.map(p => p.price);
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: productNames,
            datasets: [{
                label: "Product Prices",
                data: productPrices,
                backgroundColor: "rgba(54,162,235,0.6)"
            }]
        }
    });
}


