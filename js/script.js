
// --- STATE ---
const API_URL = "https://v2.api.noroff.dev/gamehub";
let products = [];
let currentPage = 1;
const itemsPerPage = 10;
let totalPages = 1;

// --- DOM ELEMENTS ---
const resultsContainer = document.querySelector("#resultsContainer");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const genreSelect = document.querySelector("#genreSelect");




// --- FUNCTIONS ---

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        const productToAdd = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image.url,
            quantity: 1
        };
        cart.push(productToAdd);
        alert(`${product.title} added to cart!`);
    }
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

async function fetchProductsData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); 
        }
        const data = await response.json();
        products = data.data;
    } catch (error) {
        console.error("Failed to fetch products:", error); 
        resultsContainer.innerHTML = "<p>Failed to load products. Please try again later.</p>";
        products = [];
    }
}

function renderProducts(productsToRender) {
    resultsContainer.innerHTML = "";
    if (productsToRender.length === 0) {
        resultsContainer.innerHTML = "<p>No products found.</p>";
        return;
    }
        productsToRender.forEach(product => {
            const card = document.createElement("div");
            const image = document.createElement("img");
            const content = document.createElement("div");
            const title = document.createElement("h2");
            const price = document.createElement("p");
            const anchor = document.createElement("a");
        
            card.className = "card";
            image.className = "card-img";
            content.className = "card-content";
            title.className = "card-title";
            price.className = "card-price";

            image.src = product.image.url;
            image.alt = product.image.alt;
            title.textContent = product.title;
            price.textContent = `$ ${product.price}`;
            anchor.href = `product.html?id=${product.id}`;

            content.appendChild(title);
            content.appendChild(price);
            card.appendChild(image);
            card.appendChild(content);
            anchor.appendChild(card);
            resultsContainer.appendChild(anchor);
        });
}

function populateGenreFilter() {
    const genres = new Set();
    products.forEach(product => {
        if (product.genre && product.genre.trim() !== "") {
            genres.add(product.genre.trim());
        }
    });

    genreSelect.innerHTML = "<option value=''>All Genres</option>";
    Array.from(genres).sort().forEach(genre => {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        genreSelect.appendChild(option);
    });
}

function filterAndSearchProducts(productsArray, searchTerm, selectedGenre) {
    let filtered = [...productsArray];
    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(product => {
            const titleMatch = product.title.toLowerCase().includes(lowerCaseSearchTerm);
            const descriptionMatch = product.description.toLowerCase().includes(lowerCaseSearchTerm);
            const genreMatch = product.genre.toLowerCase().includes(lowerCaseSearchTerm);
            return titleMatch || descriptionMatch || genreMatch;
        });
    }
    if (selectedGenre) {
        filtered = filtered.filter(product => product.genre && product.genre.toLowerCase() === selectedGenre.toLowerCase());
    }
    return filtered;
}

function paginateProducts(productsArray, page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return productsArray.slice(startIndex, endIndex);
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args); 
        }, wait);
    };
}

function updateDisplay() {
    const searchTerm = searchInput.value;
    const selectedGenre = genreSelect.value;

    let productsToProcess = filterAndSearchProducts(products, searchTerm, selectedGenre);

    const sortOption = sortSelect.value;
    productsToProcess = sortProducts(productsToProcess, sortOption);

    totalPages = Math.ceil(productsToProcess.length / itemsPerPage);

    const paginatedProducts = paginateProducts(productsToProcess, currentPage);
    renderProducts(paginatedProducts);
}

function sortProducts(productsArray, sortOption) {
    const sorted = [...productsArray];
    switch (sortOption) {
        case "price-asc":
            sorted.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            sorted.sort((a, b) => b.price - a.price);
            break;
        case "title-asc":
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "title-desc":
            sorted.sort((a, b) => b.title.localeCompare(a.title));
            break;
    }
    return sorted;
}




// ---EVENT LISTENERS---

const debouncedSearch = debounce(() => {
    currentPage = 1;
    updateDisplay();
} , 500);

searchInput.addEventListener("input", debouncedSearch);
sortSelect.addEventListener("change", () => {
    updateDisplay();
});

genreSelect.addEventListener("change", () => {
    currentPage = 1;
    updateDisplay();
});



// --- INITIAL LOAD ---
async function init() {
    resultsContainer.innerHTML = "<div class='spinner'>Loading products...</div>";
    await fetchProductsData();
    populateGenreFilter();
    updateDisplay();
}

init();
