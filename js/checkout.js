const cartContainer = document.querySelector("#cart-container");
const totalContainer = document.querySelector("#total-price-container");
const checkoutButton = document.querySelector("#checkout-btn");
const API_URL = "https://v2.api.noroff.dev/gamehub";

async function displayCart() {
    const cartIds = JSON.parse(localStorage.getItem("cart")) || [];
    cartContainer.innerHTML = "";
    if (cartIds.length === 0) {
        cartContainer.textContent = "Your cart is empty.";
        totalContainer.textContent = "Total: 0.00";
        return;
    }
    let totalPrice = 0;

    try {
        const productPromises = cartIds.map(id => fetch(`${API_URL}/${id}`).then(res => res.json()));
        const responses = await Promise.all(productPromises);

        responses.forEach(response => {
            const product = response.data;
            totalPrice += product.price;

            const itemDiv = document.createElement("div");
            itemDiv.className = "cart-item";

            const img = document.createElement("img");
            img.src = product.image.url;
            img.alt = product.image.alt;
            img.className = "cart-item-img";

            const title = document.createElement("h4");
            title.textContent = product.title;

            const price = document.createElement("p");
            price.textContent = `Price: $${product.price}`;

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.className = "remove-btn";
            removeBtn.addEventListener("click", () => {
                removeFromCart(product.id);
            });

            itemDiv.appendChild(img);
            itemDiv.appendChild(title);
            itemDiv.appendChild(price);
            itemDiv.appendChild(removeBtn);
            cartContainer.appendChild(itemDiv);
        });

        totalContainer.textContent = `Total: $${totalPrice.toFixed(2)}`;
    } catch (error) {
        console.error("Error loading cart items:", error);
        cartContainer.textContent = "Failed to load cart items. Please try again later.";
    }
}

function removeFromCart(productIdToRemove) {
    let cartIds = JSON.parse(localStorage.getItem("cart")) || [];
    cartIds = cartIds.filter(id => id !== productIdToRemove);
    localStorage.setItem("cart", JSON.stringify(cartIds));
    displayCart();
}

if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        const cartIds = JSON.parse(localStorage.getItem("cart")) || [];
        if (cartIds.length === 0) {
            alert("Your cart is empty.");
        } else {
            alert("Checkout successful! Thank you for your purchase.");
            localStorage.removeItem("cart");
            displayCart();
            window.location.href = "confirmation.html";
        }
    });
}

document.addEventListener("DOMContentLoaded",() => {
    displayCart();
});