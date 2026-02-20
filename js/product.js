const container = document.querySelector("#container");
const API_URL = "https://v2.api.noroff.dev/gamehub";


    


async function fetchAndCreateProduct() {
    try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (!id) {
        container.textContent = "No product ID provided.";
        return;
        }
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        const product = data.data;

        const backButton = document.createElement("a");
        const productDiv = document.createElement("div");
        const image = document.createElement("img");
        const title = document.createElement("h2");
        const price = document.createElement("p");
        const description = document.createElement("p");
        const addToCartBtn = document.createElement("button");


        backButton.className = "back-btn";
        productDiv.className = "product-details";
        image.className = "product-img";
        title.className = "product-title";
        price.className = "product-price";
        description.className = "product-description";
        addToCartBtn.className = "add-to-cart-btn";

        backButton.textContent = "Back to products";
        backButton.href = "index.html";
        image.src = product.image.url;
        image.alt = product.image.alt;
        title.textContent = product.title;
        price.textContent = `Price: ${product.price}`;
        description.textContent = product.description;
        addToCartBtn.textContent = "Add to Cart";

        addToCartBtn.addEventListener("click", () => {
            addToCart(product.id);
        });
        
        productDiv.appendChild(backButton);
        productDiv.appendChild(image);
        productDiv.appendChild(title);
        productDiv.appendChild(price);
        productDiv.appendChild(description);
        productDiv.appendChild(addToCartBtn);
        container.appendChild(productDiv);
    } catch (error) {
        console.error("Failed to fetch product:", error);
        container.textContent = "Failed to load product. Please try again later.";
    }
}


function addToCart(productId) {
    if (!productId) return;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Product added to cart!");
    } else {
        alert("Product is already in the cart.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchAndCreateProduct();
});





