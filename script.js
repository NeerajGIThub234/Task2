
let productsData = [];
async function fetchProducts() {

    const response = await fetch('https://dummyjson.com/products?limit=15');
    const data = await response.json();
    productsData = data.products;
    displayProducts(productsData);
}

function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = '';
    if (products.length <= 0) {
        container.innerHTML = `<h1>No Products Found</h1>`;
    }
    //foeach call on array
    products.forEach(product => {
        const priceAfterDiscount = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);

        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
                    <img src="${product.images[0]}" width='300' height='300' alt="${product.title}">
                    <img src="${product.thumbnail}" alt="Thumbnail" style="width: 70px;">
                    <h2>${product.title}</h2>
                    <h3><del>Rs.${product.price}</del></h3>
                    <h3 class="price">Rs.${priceAfterDiscount}</h3>
                    <h3 style="background-color: red; color: white; border-radius: 8px; padding: 5px 10px;">
                        Save ${product.discountPercentage}%
                    </h3>
                    <div class="star-rating">${getStars(product.rating)}</div>
                    <p class="description" style="display: none;">${product.description}</p>
                    <h3 style="background-color: #d8e8dc; border-radius: 8px; padding: 5px 10px;" onclick="Description(this)">
                        Show Description
                    </h3>
                `;

        container.appendChild(card);
    });
}

async function fetchCategory() {
    const response = await fetch('https://dummyjson.com/products/categories');
    const data = await response.json();
    displayCategory(data)
}

function displayCategory(categories) {

    const container = document.getElementById('product-filter');
    container.innerHTML = '<button class="btn" onclick="clearCategory()">Clear Category Filter</button>';
    categories.forEach(category => {
        const side = document.createElement('div');
        side.classList.add('side');
        side.innerHTML = `
                   <input type="radio" id="${category.slug}" name="category" value="${category.slug}" onclick="filterCategory('${category.slug}')">
                    <label for="${category.name}">${category.name}</label><br>
                `;

        container.appendChild(side);
    })
}

async function filterCategory(category) {
    const response = await fetch(`https://dummyjson.com/products/category/${category}`);
    const data = await response.json();
    productsData = data.products;
    displayProducts(productsData);
}




function clearCategory() {
    document.querySelectorAll('input[name="category"]').forEach(input => {
        input.checked = false;
    });
    fetchProducts()
}



function Description(button) {
    const card = button.parentElement;
    const description = card.querySelector('.description');
    if (description.style.display === 'none') {
        description.style.display = 'block';
        button.textContent = 'Less Description';
    } else {
        description.style.display = 'none';
        button.textContent = 'Show Description';
    }
}

function getStars(rating) {
    let stars = '';
    let fullStars = Math.floor(rating);
    let halfStar = rating % 1 >= 0.5 ? true : false;

    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (halfStar) {
        stars += '⯪';
    }


    for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
        stars += '☆';
    }

    return stars;
}

async function searchProducts() {
    document.getElementById('clear-search').style.display = 'block';
    document.getElementById('search-product').style.display = 'none';
    const query = document.getElementById('search').value.trim();
    if (!query) return;

    const response = await fetch(`https://dummyjson.com/products/search?q=${query}`);
    const data = await response.json();
    displayProducts(data.products);
}

function clearSearch() {
    document.getElementById('clear-search').style.display = 'none';;
    document.getElementById('search-product').style.display = 'block';
    document.getElementById('search').value = '';
    displayProducts(productsData);
}



function PriceLowToHigh() {
    const sortedProducts = [...productsData].sort((a, b) => a.price - b.price);
    displayProducts(sortedProducts);
}

function PriceHighToLow() {
    const sortedProducts = [...productsData].sort((a, b) => b.price - a.price);
    displayProducts(sortedProducts);
}

function RatingHighToLow() {
    const sortedProducts = [...productsData].sort((a, b) => b.rating - a.rating);
    displayProducts(sortedProducts);
}

document.getElementById('search-product').addEventListener('click', searchProducts);
document.getElementById('clear-search').addEventListener('click', clearSearch);
document.getElementById('low-high').addEventListener('click', PriceLowToHigh);
document.getElementById('high-low').addEventListener('click', PriceHighToLow);
document.getElementById('rating').addEventListener('click', RatingHighToLow);

fetchProducts();
fetchCategory();