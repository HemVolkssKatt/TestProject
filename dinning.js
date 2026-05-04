const products = [
    { name: "Syltherine", category: "living", description: "Stylish cafe chair", price: "Rp 2.500.000", image: "../assets/syntenise.png" },
    { name: "Leviosa", category: "living", description: "Stylish cafe chair", price: "Rp 2.500.000", image: "../assets/leviosa.png" },
    { name: "Lolito", category: "living", description: "Luxury big sofa", price: "Rp 7.000.000", image: "../assets/lolito.png" },
    { name: "Respira", category: "dining", description: "Outdoor bar table and stool", price: "Rp 500.000", image: "../assets/livingroom.jpg" },
    { name: "Grifo", category: "bedroom", description: "Night Lamp", price: "Rp 1.500.000", image  : "../assets/Grifo.png" },
    { name: "Muggo", category: "dining", description: "Small mug", price: "Rp 150.000", image: "../assets/muggo.png" },
    { name: "Pingky", category: "living", description: "Luxury big sofa", price: "Rp 7.000.000", image: "../assets/pingky.jpg" },
    { name: "Potty", category: "bedroom", description: "Minimalist plant pot", price: "Rp 500.000", image: "../assets/potty.jpg" },
];
const parms = new URLSearchParams(window.location.search);
const selectedCategory = parms.get("category");
const productList = document.getElementById("productGrid");

const filterProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

productList.innerHTML = "";

filterProducts.forEach(p => {
    const article = document.createElement("article");
    article.className = "product-card";
    article.innerHTML = `
        <div class="product-card__media">
            <img src="${p.image}" alt="${p.name}">
            <div class="product-card__overlay">
                <button class="btn-cart">Add to cart</button>
                <div class="overlay-actions">
                    <button class="action-link"><i class="fa-solid fa-share-nodes"></i> Share</button>
                    <button class="action-link"><i class="fa-solid fa-right-left"></i> Compare</button>
                    <button class="action-link"><i class="fa-regular fa-heart"></i> Like</button>
                </div>
            </div>
        </div>
        <div class="product-card__body">
            <h3 class="product-title"><a href="product.html">${p.name}</a></h3>
            <p class="product-sub">${p.description}</p>
            <div class="price-row">
                <span class="price">${p.price}</span>
            </div>
        </div>
    `;
    productList.appendChild(article);
});

// Cart Functionality
document.querySelectorAll(".btn-cart").forEach((btn, index) => {
    btn.addEventListener("click", () => {
        const product = filterProducts[index];
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({
                ...product,
                qty: 1,
                id: Date.now() + index // Simple ID
            });
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${product.name} added to cart!`);
    });
});
