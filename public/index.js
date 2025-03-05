var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            }
        }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let currentPage = 1;
let lastPage = 1;
let style = '';
let selectedCategory = 'animated';
let searchText = '';
const productDetails = document.getElementById('details');
const products = document.getElementById('products');
document.addEventListener("DOMContentLoaded", function () {
    const assetsDropdown = document.getElementById('assets');
    productDetails.style.display = 'none';
    products.style.display = 'block';
    assetsDropdown.value = 'animated';
    fetchByCategory('animated', style, '');
    document.getElementById('select-img').style.display = 'none';
});
document.getElementById('select-box').addEventListener('click', function () {
    const dropdown = document.querySelector('.custom-select');
    dropdown.classList.toggle('open');
});
document.querySelector('.buttons-wrapper button:nth-child(2)').addEventListener('click', () => {
    if (currentPage < lastPage) {
        currentPage++;
        fetchByCategory(selectedCategory, style, searchText);
    }
});
document.querySelector('.buttons-wrapper button:nth-child(1)').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchByCategory(selectedCategory, style, searchText);
    }
});
document.getElementById('assets').addEventListener('change', (event) => {
    selectedCategory = event.target.value;
    style = '';
    fetchByCategory(selectedCategory, style, '');
    resetSearchValue();
    resetSelectedStyle();
});
document.getElementById('search').addEventListener('input', function (event) {
    const searchQuery = event.target.value.trim();
    fetchByCategory(selectedCategory, style, searchQuery);
    searchText = searchQuery;
});
function resetSearchValue() {
    const search = document.getElementById('search');
    search.value = '';
}
function handleSelectionChange() {
    const select = document.getElementById('selection');
    const selectedOption = select.options[select.selectedIndex];
    const link = selectedOption.getAttribute('data-link');
    if (link) {
        window.open(link, '_blank');
    }
}
function handleSelectionChangeInMain() {
    currentPage = 1;
}
function fetchByCategory(category, style, filteredText) {
    let url = '';
    fetchStyles(category);
    switch (category) {
        case 'animated':
            url = `https://creattie.com/api/filter?search=${filteredText}&category=lottie-animated-illustrations&isCollection=0&isPeople=0&plan=all&tags=&styles=${style}&orderBy=order&page=${currentPage}`;
            fetchAnimatedIllustrations(url);
            break;
        case 'illustrations':
            url = `https://creattie.com/api/filter?search=${filteredText}&category=illustrations&isCollection=0&isPeople=0&plan=all&tags=&styles=${style}&orderBy=order&page=${currentPage}`;
            fetchData(url);
            break;
        case 'animated icons':
            url = `https://creattie.com/api/filter?search=${filteredText}&category=lottie-animated-icons&isCollection=0&isPeople=0&plan=all&tags=&styles=${style}&orderBy=order&page=${currentPage}`;
            fetchAnimatedIllustrations(url);
            break;
        case 'icons':
            url = `https://creattie.com/api/filter?search=${filteredText}&category=icons&isCollection=0&isPeople=0&plan=all&tags=&styles=${style}&orderBy=order&page=${currentPage}`;
            fetchData(url);
            break;
        case 'all':
        default:
            url = `https://creattie.com/api/filter?category=all&isCollection=0&page=${currentPage}`;
            break;
    }
}
function fetchAnimatedIllustrations(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            document.getElementById('loading-indicator').style.display = 'block';
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            const dataContainer = document.getElementById('data-container');
            dataContainer.innerHTML = '';
            lastPage = data.lastPage;
            data.products.forEach(product => {
                if (product.small_video_path) {
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product');
                    const video = document.createElement('video');
                    video.setAttribute('width', '100%');
                    video.setAttribute('loop', 'loop');
                    video.setAttribute('autoplay', 'autoplay');
                    const source = document.createElement('source');
                    source.setAttribute('src', product.small_video_path);
                    source.setAttribute('type', 'video/mp4');
                    video.appendChild(source);
                    productDiv.appendChild(video);
                    productDiv.addEventListener('click', function () {
                        openProductDetailPage(product);
                    });
                    dataContainer.appendChild(productDiv);
                }
                return product;
            });
            document.getElementById('loading-indicator').style.display = 'none';
        }
        catch (error) {
            console.error('Error fetching data: ', error);
        }
    });
}
function resetSelectedStyle() {
    const selectedText = document.querySelector('.selected-text');
    const selectedImg = document.querySelector('.selected-img');
    document.getElementById('select-img').style.display = 'none';
    selectedText.textContent = 'Select Style';
    selectedImg.setAttribute('src', '');
}
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            document.getElementById('loading-indicator').style.display = 'block';
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            const dataContainer = document.getElementById('data-container');
            dataContainer.innerHTML = '';
            lastPage = data.lastPage;
            data.products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                const picture = document.createElement('picture');
                const source650 = document.createElement('source');
                source650.setAttribute('media', '(min-width: 650px)');
                source650.setAttribute('srcset', product.thumb_560);
                picture.appendChild(source650);
                const source465 = document.createElement('source');
                source465.setAttribute('media', '(min-width: 465px)');
                source465.setAttribute('srcset', product.thumb_280);
                picture.appendChild(source465);
                const img = document.createElement('img');
                img.setAttribute('src', product.thumb_280);
                img.setAttribute('alt', product.name + ' image');
                picture.appendChild(img);
                productDiv.appendChild(picture);
                productDiv.addEventListener('click', function () {
                    openProductDetailPage(product);
                });
                dataContainer.appendChild(productDiv);
                document.getElementById('loading-indicator').style.display = 'none';
            });
        }
        catch (error) {
            console.error('Error fetching data: ', error);
        }
    });
}
function goBack() {
    productDetails.style.display = 'none';
    products.style.display = 'block';
}
function openProductDetailPage(product) {
    sessionStorage.setItem('productDetails', JSON.stringify(product));
    if (!productDetails || !products) {
        console.error('productDetails or products element not found in the DOM');
        return;
    }
    productDetails.style.display = 'block';
    products.style.display = 'none';
    const productsWrapper = document.getElementById('wrapper');
    if (!productsWrapper) {
        console.error('productContainer or productsWrapper element not found in the DOM');
        return;
    }
    productsWrapper.textContent = '';
    if (product) {
        switch (selectedCategory) {
            case 'animated':
            case 'animated icons': {
                const video = document.createElement('video');
                video.setAttribute('width', '100%');
                video.setAttribute('loop', 'loop');
                video.setAttribute('autoplay', 'autoplay');
                productsWrapper.appendChild(video);
                const source = document.createElement('source');
                source.setAttribute('src', product.video_path);
                source.setAttribute('type', 'video/mp4');
                video.appendChild(source);
                break;
            }
            case 'icons':
            case 'illustrations': {
                const productImage = document.createElement('img');
                productImage.setAttribute('id', 'productImage');
                productImage.src = product.thumb_280;
                productsWrapper.appendChild(productImage);
            }
        }
        const productName = document.createElement('h4');
        productName.setAttribute('id', 'productName');
        productName.style.fontWeight = '400';
        productName.textContent = product.name;
        productsWrapper.appendChild(productName);
    }
    else {
        alert('Product details not found!');
    }
}
function getOrCreateStyle(styleName) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingStyle = yield webflow.getStyleByName(styleName);
        if (existingStyle) {
            return existingStyle;
        }
        const newStyle = yield webflow.createStyle(styleName);
        yield newStyle.setProperties({
            "padding-left": "0 !important",
            "padding-right": "0 !important",
            "padding-top": "0 !important",
            "padding-bottom": "0 !important",
        });
        return newStyle;
    });
}
const addAsset = () => __awaiter(this, void 0, void 0, function* () {
    const el = yield webflow.getSelectedElement();
    if (el && el.styles && el.children) {
        const productDetails = JSON.parse(sessionStorage.getItem('productDetails'));
        const labelElement = yield el.before(webflow.elementPresets.DOM);
        const newStyle = yield getOrCreateStyle('elementStyle');
        yield newStyle.setProperties({
            "padding-left": "0 ",
            "padding-right": "0 ",
            "padding-top": "0 ",
            "padding-bottom": "0 ",
        });
        yield el.setStyles([newStyle]);
        yield labelElement.setStyles([newStyle]);
        switch (selectedCategory) {
            case 'animated':
            case 'animated icons':
                yield labelElement.setTag('video');
                yield labelElement.setAttribute('loop', 'loop');
                yield labelElement.setAttribute('autoplay', 'autoplay');
                yield labelElement.setAttribute('type', 'video/mp4');
                yield labelElement.setAttribute('src', productDetails.video_path);
                yield labelElement.setAttribute('width', '250px');
                yield labelElement.setAttribute('height', '250px');
                break;
            case 'icons':
            case 'illustrations':
                yield labelElement.setTag("img");
                yield labelElement.setAttribute('src', productDetails.thumb_280);
                break;
        }
    }
    else {
        alert("Please select an element");
    }
});
function populateStylesDropdown(stylesData) {
    const optionsContainer = document.getElementById('styles-options-container');
    optionsContainer.innerHTML = '';
    const allOption = document.createElement('div');
    allOption.classList.add('option');
    allOption.setAttribute('data-value', '');
    allOption.setAttribute('selected', 'selected');
    allOption.innerHTML = `
    <img src="/assets/ALL.svg" alt="all styles" />
    <span>All Styles</span>
  `;
    optionsContainer.appendChild(allOption);
    stylesData.forEach(style => {
        const option = document.createElement('div');
        option.classList.add('option');
        option.setAttribute('data-value', style.name);
        option.innerHTML = `
      <img src="${style.image}" alt="${style.name}" />
      <span>${style.name}</span>
    `;
        optionsContainer.appendChild(option);
    });
    const allOptions = optionsContainer.querySelectorAll('.option');
    allOptions.forEach(option => {
        option.addEventListener('click', function () {
            const selectedStyle = this.getAttribute('data-value');
            const selectedText = this.querySelector('span').textContent;
            const selectedImg = this.querySelector('img').src;
            const selectedBox = document.querySelector('.selected-text');
            selectedBox.textContent = selectedText;
            const selectedImage = document.querySelector('.selected-img');
            selectedImage.setAttribute('src', selectedImg);
            document.getElementById('select-img').style.display = 'block';
            document.getElementById('select-img').style.width = '20px';
            document.getElementById('select-img').style.height = '20px';
            document.getElementById('select-img').style.background = '#ffffff';
            document.getElementById('select-img').style.borderRadius = '50%';
            document.querySelector('.custom-select').classList.remove('open');
            style = selectedStyle;
            fetchByCategory(selectedCategory, style, '');
            resetSearchValue();
        });
    });
}
function fetchStyles(category) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://creattie.com/api/styles");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            switch (category) {
                case 'animated':
                case 'illustrations': {
                    populateStylesDropdown(data.data.illustrations);
                    return data.data.illustrations;
                }
                case 'icons':
                case 'animated icons': {
                    populateStylesDropdown(data.data.icons);
                    return data.data.icons;
                }
                default:
                    console.log(data);
            }
        }
        catch (error) {
            console.error('Error fetching styles:', error);
        }
    });
}
