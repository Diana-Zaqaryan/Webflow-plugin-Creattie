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
const loading = document.getElementById('loading-indicator-for-requests');
const page = document.getElementById('page');
const notAuthProfile = document.getElementById('no-auth-profile');
const authProfile = document.getElementById('auth-profile');
const notFound = document.getElementById('not-found');
const container = document.getElementById("color-container");
let animation;
let originalJsonData;
let colorMapping = {};
let colorPickers = {};
let updatedJsonData;
let selectedItem = null;
const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.6/lottie.min.js";
document.addEventListener("DOMContentLoaded", function () {
    const assetsDropdown = document.getElementById('assets');
    loading.style.display = 'none';
    productDetails.style.display = 'none';
    notFound.style.display = 'none';
    setNotFoundDisplays(true);
    page.style.display = 'block';
    products.style.display = 'block';
    assetsDropdown.value = 'animated';
    fetchByCategory('animated', style, '');
    document.getElementById('select-img').style.display = 'none';
    const token = localStorage.getItem('token');
    setDisplays(false);
    if (token) {
        void makeApiCalls(token, 1);
        setDisplays(true);
    }
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
document.getElementById('login').addEventListener('click', () => {
    const newToke = naiveId();
    localStorage.setItem('token', newToke);
    const url = `https://creattie.com/?webflow-token=${newToke}`;
    window.open(url, '_blank');
    void makeApiCalls(newToke, 20).then(r => { return r; });
});
document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    void makeApiCalls(localStorage.getItem('token'), 1);
    setDisplays(false);
});
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function setDisplays(isAuth) {
    if (isAuth) {
        notAuthProfile.style.display = 'none';
        authProfile.style.display = 'block';
        document.getElementById('login').style.display = 'none';
        document.getElementById('info').style.display = 'block';
        return;
    }
    notAuthProfile.style.display = 'block';
    authProfile.style.display = 'none';
    document.getElementById('login').style.display = 'block';
    document.getElementById('info').style.display = 'none';
}
function setNotFoundDisplays(isFound) {
    if (isFound) {
        notFound.style.display = 'none';
        document.getElementById('navigation-buttons').style.display = 'flex';
        return;
    }
    notFound.style.display = 'block';
    document.getElementById('navigation-buttons').style.display = 'none';
}
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function makeApiCalls(token, retries) {
    return __awaiter(this, void 0, void 0, function* () {
        loading.style.display = 'block';
        page.style.display = 'none';
        let attempt = 0;
        const url = 'https://creattie.com/api/get-user';
        while (attempt < retries) {
            try {
                const response = yield fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 401) {
                    console.log(`Attempt ${attempt + 1}: Unauthorized. Retrying...`);
                    attempt++;
                    if (attempt < retries) {
                        yield delay(1000);
                    }
                    setDisplays(false);
                }
                else {
                    const data = yield response.json();
                    loading.style.display = 'none';
                    page.style.display = 'block';
                    setDisplays(true);
                    setProfileStyles(data.data);
                    console.log('Data received:', data);
                    localStorage.setItem('token', token);
                    console.log('Data received:', data);
                    return;
                }
            }
            catch (error) {
                console.error('Error making API call:', error);
                return;
            }
        }
        page.style.display = 'block';
        loading.style.display = 'none';
        console.error('Error: 401 Unauthorized - Max retries reached.');
    });
}
function setProfileStyles(user) {
    authProfile.style.backgroundColor = getRandomColor();
    authProfile.innerHTML = user.name.slice(0, 1);
}
function resetSearchValue() {
    const search = document.getElementById('search');
    search.value = '';
}
// function handleSelectionChange() {
//   const select: any = document.getElementById('selection');
//   const selectedValue = select.value;
//   if (selectedValue === 'login') {
//     const token = localStorage.getItem('token')
//     const url = `https://creattie.com/?webflow-token=${token}`
//     window.open(url, '_blank');
//     makeApiCalls(token)
//   }
// }
function naiveId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
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
            !data.products.length ? setNotFoundDisplays(false) : setNotFoundDisplays(true);
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
            !data.products.length ? setNotFoundDisplays(false) : setNotFoundDisplays(true);
        }
        catch (error) {
            console.error('Error fetching data: ', error);
        }
    });
}
function goBack() {
    productDetails.style.display = 'none';
    products.style.display = 'block';
    resetColorMappings();
}
function resetColorMappings() {
    container.innerHTML = '';
    colorMapping = {};
    colorPickers = {};
}
function openProductDetailPage(product) {
    return __awaiter(this, void 0, void 0, function* () {
        resetColorMappings();
        sessionStorage.setItem('productDetails', JSON.stringify(product));
        if (!productDetails || !products) {
            console.error('productDetails or products element not found in the DOM');
            return;
        }
        productDetails.style.display = 'block';
        products.style.display = 'none';
        try {
            const url = `https://creattie.com/api/lotties/${product.slug}`;
            const token = localStorage.getItem('token');
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 401) {
                console.log(`401`);
            }
            else {
                const data = yield response.json();
                const container = document.getElementById("lottie-container");
                if (!container) {
                    console.error("Lottie container not found.");
                    return;
                }
                fetchLottieJson(data.data.path).then(jsonData => {
                    originalJsonData = jsonData;
                    initLottieAnimation(jsonData);
                    updatedJsonData = JSON.parse(JSON.stringify(originalJsonData));
                    resetColorMappings();
                    extractLayersAndColors(jsonData);
                });
                return;
            }
        }
        catch (error) {
            console.error('Error making API call:', error);
            return;
        }
    });
}
function fetchLottieJson(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error("Error fetching JSON:", error));
}
function initLottieAnimation(updatedJsonData) {
    if (animation) {
        animation.destroy();
    }
    animation = lottie.loadAnimation({
        container: document.getElementById('lottie-container'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: updatedJsonData
    });
    selectedItem = updatedJsonData;
    console.log(selectedItem);
    animation.setSpeed(2);
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
    <img src="assets/ALL.svg" alt="all styles" />
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
function openFavoritsPage() {
    window.location.href = 'favorites.html';
}
/*  Animation part*/
function extractLayersAndColors(data) {
    const extractedData = [];
    function extractLayerColors(layers) {
        layers.forEach(layer => {
            const layerName = layer.nm.toLowerCase();
            if (layer.shapes) {
                layer.shapes.forEach(shape => {
                    if (shape.it) {
                        shape.it.forEach(shapeItem => {
                            if (shapeItem.ty === "st" || shapeItem.ty === "fl") {
                                const color = shapeItem.c.k;
                                colorMapping[layerName] = color;
                                extractedData.push({
                                    layer: layer.nm,
                                    color: rgbaToHex(color),
                                    originalColor: color
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    data.assets.forEach(asset => {
        if (asset.layers) {
            extractLayerColors(asset.layers);
        }
    });
    if (data.layers) {
        extractLayerColors(data.layers);
    }
    const setOfColors = new Set();
    extractedData.forEach(value => {
        setOfColors.add(value.color);
    });
    setOfColors.forEach(color => displayColors(color));
    return extractedData;
}
function rgbaToHex(rgba) {
    const r = Math.round(rgba[0] * 255);
    const g = Math.round(rgba[1] * 255);
    const b = Math.round(rgba[2] * 255);
    const rHex = r.toString(16).padStart(2, '0');
    const gHex = g.toString(16).padStart(2, '0');
    const bHex = b.toString(16).padStart(2, '0');
    return `#${rHex}${gHex}${bHex}`;
}
function displayColors(color) {
    const colorPickerItem = document.createElement("div");
    colorPickerItem.classList.add("color-picker-item");
    const colorInput = document.createElement("input");
    colorInput.setAttribute('id', 'primary_color');
    colorInput.type = "color";
    colorInput.value = color;
    colorPickerItem.appendChild(colorInput);
    container.appendChild(colorPickerItem);
    colorPickers[color] = { colorInput: colorInput, originalColor: color };
    colorInput.addEventListener("input", (event) => {
        const newColor = event.target.value;
        updateAnimationColor(newColor, colorPickers[color].originalColor);
        colorPickers[color].originalColor = newColor;
    });
}
function updateAnimationColor(newColor, previousColor) {
    function findAndUpdateColors(shapes) {
        shapes.forEach(shape => {
            if (shape.ty === "st" || shape.ty === "fl") {
                const currentColor = rgbaToHex(shape.c.k);
                if (currentColor === previousColor) {
                    shape.c.k = hexToRgba(newColor);
                }
            }
            if (shape.it) {
                findAndUpdateColors(shape.it);
            }
        });
    }
    if (updatedJsonData.layers) {
        updatedJsonData.layers.forEach(layer => {
            if (layer.shapes) {
                findAndUpdateColors(layer.shapes);
            }
            if (layer.layers) {
                layer.layers.forEach(layer => {
                    if (layer.shapes)
                        findAndUpdateColors(layer.shapes);
                });
            }
        });
    }
    updatedJsonData.assets.forEach(asset => {
        if (asset.layers) {
            asset.layers.forEach(layer => {
                if (layer.shapes) {
                    findAndUpdateColors(layer.shapes);
                }
            });
        }
    });
    originalJsonData = JSON.parse(JSON.stringify(updatedJsonData));
    initLottieAnimation(updatedJsonData);
}
function hexToRgba(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const a = 1;
    return [r, g, b, a];
}
