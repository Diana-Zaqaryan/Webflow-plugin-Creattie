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
const favorites = document.getElementById('favorites');
const products = document.getElementById('products');
const loading = document.getElementById('loading-indicator-for-requests');
const loadingInDetails = document.getElementById('loading-indicator-for-details');
const page = document.getElementById('page');
const notAuthProfile = document.getElementById('no-auth-profile');
const authProfile = document.getElementById('auth-profile');
const notFound = document.getElementById('not-found');
const container = document.getElementById("color-container");
const dataContainerInFavorites = document.getElementById('data-container-in-favorites');
let animation;
let originalJsonData;
let colorMapping = {};
let colorPickers = {};
let updatedJsonData;
let selectedItem = null;
let svgName = '';
document.addEventListener("DOMContentLoaded", function () {
    const assetsDropdown = document.getElementById('assets');
    assetsDropdown.value = 'animated';
    loading.style.display = 'none';
    loadingInDetails.style.display = 'none';
    productDetails.style.display = 'none';
    favorites.style.display = 'none';
    notFound.style.display = 'none';
    dataContainerInFavorites.style.display = 'none';
    document.getElementById('select-img').style.display = 'none';
    setNotFoundDisplays(true);
    page.style.display = 'block';
    products.style.display = 'block';
    fetchByCategory('animated', style, '');
    const token = localStorage.getItem('token');
    setDisplays(false);
    if (token) {
        void makeApiCalls(token, 1);
        setDisplays(true);
    }
    const modal = document.getElementById("login-modal");
    modal.style.display = 'none';
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
    fetchByCategory(selectedCategory, style, searchText);
    resetSelectedStyle();
});
document.getElementById('assetsOfFavorites').addEventListener('change', (event) => {
    const category = +event.target.value;
    style = '';
    fetchFavorites(category);
    resetSelectedStyle();
    switch (category) {
        case 1:
            selectedCategory == 'animated';
            break;
        case 2:
            selectedCategory == 'illustrations';
            break;
        case 3:
            selectedCategory == 'animated icons';
            break;
        case 4: selectedCategory == 'icons';
    }
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
    goBack();
});
document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    void makeApiCalls(localStorage.getItem('token'), 1);
    goBack();
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
                    localStorage.setItem('token', token);
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
function fetchFavorites(category) {
    const url = `https://creattie.com/api/favourites?category=${category}`;
    switch (category) {
        case 1 /* CATEGORIES.ANIMATED_ILLUSTRATION_ID */:
        case 3 /* CATEGORIES.ANIMATED_ICON_ID */:
            fetchAnimatedFavoriteData(url);
            break;
        case 4 /* CATEGORIES.ICON_ID */:
        case 2 /* CATEGORIES.ILLUSTRATION_ID */:
            fetchDataForFavorites(url);
            break;
    }
}
function fetchAnimatedIllustrations(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            document.getElementById('loading-indicator').style.display = 'block';
            document.getElementById('main-content').style.display = 'none';
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
            setTimeout(() => {
                document.getElementById('loading-indicator').style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
            }, 1000);
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
            document.getElementById('main-content').style.display = 'none';
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
                setTimeout(() => {
                    document.getElementById('loading-indicator').style.display = 'none';
                    document.getElementById('main-content').style.display = 'block';
                }, 1000);
            });
            !data.products.length ? setNotFoundDisplays(false) : setNotFoundDisplays(true);
        }
        catch (error) {
            console.error('Error fetching data: ', error);
        }
    });
}
function fetchAnimatedFavoriteData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            document.getElementById('loading-indicator').style.display = 'block';
            document.getElementById('main-content').style.display = 'none';
            const token = localStorage.getItem('token');
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            const dataContainer = document.getElementById('data-container-in-favorites');
            dataContainer.innerHTML = '';
            lastPage = data.lastPage;
            data.wishList.forEach(product => {
                if (product.videoPath) {
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('product');
                    const video = document.createElement('video');
                    video.setAttribute('width', '100%');
                    video.setAttribute('loop', 'loop');
                    video.setAttribute('autoplay', 'autoplay');
                    const source = document.createElement('source');
                    source.setAttribute('src', product.videoPath);
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
            !data.wishList.length ? setNotFoundDisplays(false) : setNotFoundDisplays(true);
            setTimeout(() => {
                document.getElementById('loading-indicator').style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
            }, 1000);
        }
        catch (error) {
            console.error('Error fetching data: ', error);
        }
    });
}
function fetchDataForFavorites(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            document.getElementById('loading-indicator').style.display = 'block';
            document.getElementById('main-content').style.display = 'none';
            const token = localStorage.getItem('token');
            const response = yield fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.json();
            const dataContainer = document.getElementById('data-container-in-favorites');
            dataContainer.innerHTML = '';
            lastPage = data.lastPage;
            data.wishList.forEach(product => {
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
                setTimeout(() => {
                    document.getElementById('loading-indicator').style.display = 'none';
                    document.getElementById('main-content').style.display = 'block';
                }, 1000);
            });
            !data.wishList.length ? setNotFoundDisplays(false) : setNotFoundDisplays(true);
        }
        catch (error) {
            console.error('Error fetching data: ', error);
        }
    });
}
function goBack() {
    productDetails.style.display = 'none';
    favorites.style.display = 'none';
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
        loadingInDetails.style.display = 'block';
        document.getElementById('wrapper').style.display = 'none';
        document.getElementById('back-button').style.display = 'none';
        document.getElementById('lottie-container').style.display = 'flex';
        document.getElementById('add').style.display = 'block';
        resetColorMappings();
        sessionStorage.setItem('productDetails', JSON.stringify(product));
        if (!productDetails || !products) {
            console.error('productDetails or products element not found in the DOM');
            return;
        }
        productDetails.style.display = 'block';
        products.style.display = 'none';
        favorites.style.display = 'none';
        const loginModal = document.getElementById("login-modal");
        loginModal.style.display = 'none';
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
                showModal(false, true);
                throw new Error('Unauthorized access. Please login.');
                return;
            }
            if (response.status === 403) {
                showModal(true, false);
                throw new Error('No Permissions');
                return;
            }
            switch (selectedCategory) {
                case 'animated':
                case 'animated icons':
                    if (response.status === 200) {
                        const data = yield response.json();
                        const container = document.getElementById("lottie-container");
                        if (!container) {
                            console.error("Lottie container not found.");
                            return;
                        }
                        container.innerHTML = '';
                        document.getElementById('color-container').classList.remove('disabled');
                        yield fetchLottieJson(data.data.path).then(jsonData => {
                            originalJsonData = jsonData;
                            console.log(jsonData);
                            initLottieAnimation(jsonData);
                            updatedJsonData = JSON.parse(JSON.stringify(originalJsonData));
                            resetColorMappings();
                            extractLayersAndColors(jsonData);
                        });
                    }
                    break;
                case 'icons':
                case 'illustrations':
                    if (response.status === 200) {
                        const data = yield response.json();
                        const container = document.getElementById("lottie-container");
                        if (!container) {
                            console.error("Container not found.");
                            return;
                        }
                        container.innerHTML = '';
                        document.getElementById('color-container').classList.remove('disabled');
                        const parser = new DOMParser();
                        const svgDocument = parser.parseFromString(data.data.path, "image/svg+xml");
                        selectedItem = data.data.path;
                        svgName = data.data.name;
                        const svgElement = svgDocument.documentElement;
                        extractStylesFromSvg(svgElement);
                        container.appendChild(svgElement);
                    }
                    break;
                default:
                    console.error('Unknown category: ' + selectedCategory);
                    break;
            }
            setTimeout(() => {
                loadingInDetails.style.display = 'none';
                document.getElementById('wrapper').style.display = 'block';
                document.getElementById('back-button').style.display = 'block';
            }, 800);
        }
        catch (error) {
            document.getElementById('lottie-container').style.display = 'none';
            document.getElementById('back-button').style.display = 'block';
            const container = document.getElementById('color-container');
            container.classList.add('disabled');
            let overlayElement = container.querySelector('.overlay');
            if (!overlayElement) {
                overlayElement = document.createElement('p');
                overlayElement.classList.add('overlay-message');
                overlayElement.innerHTML = 'Editing functions are available only for free items and paid plan users';
                container.appendChild(overlayElement);
            }
            let icon = container.querySelector('.fa-edit');
            if (!icon) {
                icon = document.createElement('i');
                icon.classList.add('fa-solid', 'fa-edit');
                container.appendChild(icon);
            }
            document.getElementById('add').style.display = 'none';
            console.error('Error making API call:', error);
        }
    });
}
function showModal(userLoggedIn, hasPermission) {
    const modalMessage = document.getElementById('modal-message');
    document.getElementById('wrapper').style.display = 'none';
    loadingInDetails.style.display = 'none';
    if (!userLoggedIn) {
        modalMessage.innerText = "You must be logged in to perform this action. Please log in.";
    }
    else if (!hasPermission) {
        modalMessage.innerText = "You do not have the required permissions to modify this item.";
    }
    document.getElementById('login-modal').style.display = 'block';
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
    animation.setSpeed(1);
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
function generateUniqueId() {
    return crypto.randomUUID();
}
const addAsset = () => __awaiter(this, void 0, void 0, function* () {
    const el = yield webflow.getSelectedElement();
    const newStyle = yield getOrCreateStyle('elementStyle');
    yield newStyle.setProperties({
        "padding-left": "0 ",
        "padding-right": "0 ",
        "padding-top": "0 ",
        "padding-bottom": "0 ",
    });
    if (!el) {
        alert("Please select an element");
        return;
    }
    switch (selectedCategory) {
        case 'animated':
        case 'animated icons':
            try {
                const selectedItemJSON = JSON.stringify(selectedItem);
                const file = new File([selectedItemJSON], `${selectedItem.nm}-${generateUniqueId()}-animation.json`, { type: 'application/json' });
                const asset = yield webflow.createAsset(file);
                const assetId = yield webflow.getAssetById(asset.id);
                const url = yield assetId.getUrl();
                const xscpPayload = {
                    "type": "@webflow/XscpData",
                    "payload": {
                        "nodes": [
                            {
                                "_id": generateUniqueId(),
                                "type": "Animation",
                                "tag": "div",
                                "classes": ["animation-style"],
                                "children": [],
                                "data": {
                                    "tag": "div",
                                    "animation": {
                                        "tag": "lottie",
                                        "val": {
                                            "path": {
                                                "src": `${url}`,
                                                "origFileName": `${selectedItem.nm}-${generateUniqueId()}-animation.json`,
                                                "totalDuration": null,
                                            },
                                            "renderMode": "svg",
                                            "loop": true,
                                            "playInReverse": false
                                        }
                                    },
                                    "displayName": `${selectedItem.nm}`,
                                    "attr": {
                                        "id": ""
                                    },
                                    "xattr": [],
                                    "search": {
                                        "exclude": false
                                    },
                                    "visibility": {
                                        "conditions": []
                                    }
                                }
                            }
                        ],
                        "styles": [
                            {
                                "_id": 'animation-style',
                                "fake": false,
                                "type": "class",
                                "name": `${selectedItem.nm}`,
                                "namespace": "",
                                "comb": "",
                                "styleLess": "width: 250px; height: 250px;",
                                "variants": {},
                                "children": [],
                                "origin": null,
                                "selector": null
                            }
                        ],
                        "assets": [],
                        "ix1": [],
                        "ix2": {
                            "interactions": [],
                            "events": [],
                            "actionLists": []
                        }
                    },
                    "meta": {
                        "droppedLinks": 0,
                        "dynBindRemovedCount": 0,
                        "dynListBindRemovedCount": 0,
                        "paginationRemovedCount": 0,
                        "universalBindingsRemovedCount": 0,
                        "unlinkedSymbolCount": 0
                    }
                };
                // @ts-ignore
                yield webflow._internal.xscp(JSON.stringify(xscpPayload));
            }
            catch (error) {
                console.error("Error loading Lottie animation:", error);
            }
            break;
        case 'icons':
        case 'illustrations':
            try {
                const labelElement = yield el.append(webflow.elementPresets.DOM);
                const svgContent = selectedItem.toString();
                const file = new File([svgContent], `${generateUniqueId()}-illustration.svg`, { type: 'image/svg+xml' });
                const asset = yield webflow.createAsset(file);
                const assetId = yield webflow.getAssetById(asset.id);
                const url = yield assetId.getUrl();
                yield labelElement.setTag('img');
                yield labelElement.setAttribute('class', svgName);
                yield labelElement.setAttribute('src', url);
                yield labelElement.setAttribute('width', '250px');
                yield labelElement.setAttribute('height', '250px');
            }
            catch (error) {
                console.error("Error loading illustration:", error);
            }
            break;
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
            fetchByCategory(selectedCategory, style, searchText);
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
    favorites.style.display = 'flex';
    products.style.display = 'none';
    productDetails.style.display = 'none';
    dataContainerInFavorites.style.display = 'grid';
    fetchAnimatedFavoriteData('https://creattie.com/api/favourites?category=1');
}
function extractLayersAndColors(data) {
    const extractedData = [];
    function extractLayerColors(layers) {
        layers.forEach(layer => {
            const layerName = layer.nm.toLowerCase();
            if (layer.shapes) {
                layer.shapes.forEach(shape => {
                    if (shape.c) {
                        const color = shape.c.k;
                        colorMapping[layerName] = color;
                        extractedData.push({
                            layer: layer.nm,
                            color: rgbaToHex(color),
                            originalColor: color
                        });
                    }
                    if (shape.it) {
                        shape.it.forEach(shapeItem => {
                            if (shapeItem.ty === "st" || shapeItem.ty === "fl") {
                                let color = '';
                                shapeItem.c.k.forEach(item => {
                                    color = item.hasOwnProperty('s') ? item.s : shapeItem.c.k;
                                });
                                colorMapping[layerName] = color;
                                extractedData.push({
                                    layer: layer.nm,
                                    color: rgbaToHex(color),
                                    originalColor: color
                                });
                            }
                            if (shapeItem.it) {
                                shapeItem.it.forEach(s => {
                                    if (s.ty === "st" || s.ty === "fl") {
                                        let color = '';
                                        s.c.k.forEach(item => {
                                            color = item.hasOwnProperty('s') ? item.s : s.c.k;
                                        });
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
        });
    }
    data.assets.forEach(asset => {
        if (asset.layers) {
            extractLayerColors(asset.layers);
        }
    });
    if (data.layers) {
        extractLayerColors(data.layers);
        if (data.layers.layers) {
            extractLayerColors(data.layers.layers);
        }
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
    // @ts-ignore
    const rHex = r.toString(16).padStart(2, "0");
    // @ts-ignore
    const gHex = g.toString(16).padStart(2, "0");
    // @ts-ignore
    const bHex = b.toString(16).padStart(2, "0");
    return `#${rHex}${gHex}${bHex}`;
}
function displayColors(color, svg) {
    if (color === '#fff') {
        color = '#ffffff';
    }
    if (color === '#000') {
        color = '#000000';
    }
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
        switch (selectedCategory) {
            case 'animated':
            case 'animated icons':
                updateAnimationColor(newColor, colorPickers[color].originalColor);
                break;
            case 'icons':
            case 'illustrations':
                updateIllustrationColor(newColor, colorPickers[color].originalColor, svg);
                break;
            default:
                console.error('Unknown category: ' + selectedCategory);
                break;
        }
        colorPickers[color].originalColor = newColor;
    });
}
function serializeSvgToString(svgElement) {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgElement);
}
function updateIllustrationColor(newColor, previousColor, svgElement) {
    const elementTypes = ['circle', 'path', 'rect', 'line', 'ellipse', 'polygon', 'polyline', 'stop'];
    elementTypes.forEach(type => {
        const elements = svgElement.querySelectorAll(type);
        elements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            const currentFillColor = rgbToHex(computedStyle.fill);
            const currentStrokeColor = rgbToHex(computedStyle.stroke);
            const currentStopColor = el.getAttribute('stop-color');
            if (currentFillColor === previousColor) {
                el.style.fill = newColor;
            }
            if (currentStrokeColor === previousColor) {
                el.style.stroke = newColor;
            }
            if (currentStopColor === previousColor) {
                el.setAttribute('stop-color', newColor);
            }
        });
        const g = svgElement.querySelectorAll('g');
        g.forEach(item => {
            const elements = item.querySelectorAll(type);
            elements.forEach(el => {
                const computedStyle = window.getComputedStyle(el);
                const currentFillColor = rgbToHex(computedStyle.fill);
                const currentStrokeColor = rgbToHex(computedStyle.stroke);
                if (currentFillColor === previousColor) {
                    el.style.fill = newColor;
                }
                if (currentStrokeColor === previousColor) {
                    el.style.stroke = newColor;
                }
            });
        });
        selectedItem = serializeSvgToString(svgElement);
    });
    console.log(`Updated color from ${previousColor} to ${newColor}`);
}
function rgbToHex(rgb) {
    if (!rgb || rgb === "none")
        return rgb;
    const match = rgb.match(/\d+/g);
    if (!match)
        return rgb;
    return `#${match.slice(0, 3)
        // @ts-ignore
        .map(x => parseInt(x).toString(16).padStart(2, "0"))
        .join("")}`;
}
function updateAnimationColor(newColor, previousColor) {
    function findAndUpdateColors(shapes) {
        shapes.forEach(shape => {
            if (shape.ty === "st" || shape.ty === "fl") {
                let currentColor = '';
                shape.c.k.forEach(item => {
                    currentColor = item.hasOwnProperty('s') ? rgbaToHex(shape.c.k[0].s) : rgbaToHex(shape.c.k);
                });
                if (currentColor === previousColor) {
                    shape.c.k.forEach(item => {
                        if (item.hasOwnProperty('s')) {
                            item.s = hexToRgba(newColor);
                        }
                        else {
                            shape.c.k = hexToRgba(newColor);
                        }
                    });
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
                    if (layer.layers) {
                        layer.layers.forEach(l => {
                            if (l.shapes)
                                findAndUpdateColors(l.shapes);
                        });
                    }
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
function extractStylesFromSvg(svgElement) {
    const styles = [];
    const setOfColors = new Set;
    const elements = svgElement.querySelectorAll('*');
    elements.forEach(element => {
        let stylesArr = [];
        const styles = element.getAttribute('style');
        if (styles) {
            stylesArr = styles.split(';');
            const colors = {};
            stylesArr.forEach(style => {
                if (!style)
                    return;
                const [property, value] = style.split(':');
                if (property === 'stroke') {
                    colors[property] = value;
                    setOfColors.add(value);
                }
            });
        }
    });
    // setOfColors.forEach(color => displayColors(color, svgElement))
    const styleElement = svgElement.querySelector('style');
    if (styleElement) {
        const styles = styleElement.textContent || styleElement.innerText;
        const ruleRegex = /\.([^{]+)\{([^}]+)}/g;
        const classColors = [];
        let match;
        while ((match = ruleRegex.exec(styles)) !== null) {
            const className = match[1];
            const fillColor = match[2];
            const strokeColor = match[3];
            classColors.push({
                className,
                fillColor,
                strokeColor
            });
        }
        const stylesByClass = {};
        classColors.forEach((item) => {
            const classNames = item.className.split(",").map((cls) => cls.trim());
            const fillStyles = parseStyle(item.fillColor);
            const strokeStyles = parseStyle(item.strokeColor);
            if (fillStyles.fill && fillStyles.fill !== 'none') {
                setOfColors.add(fillStyles.fill);
            }
            if (fillStyles.stroke && fillStyles.stroke !== 'none') {
                setOfColors.add(fillStyles.stroke);
            }
            classNames.forEach((cls) => {
                stylesByClass[cls] = Object.assign(Object.assign(Object.assign({}, stylesByClass[cls]), fillStyles), strokeStyles);
            });
        });
        const gradientElements = svgElement.querySelectorAll('stop');
        if (gradientElements.length) {
            gradientElements.forEach(gradientElement => {
                const stopColor = gradientElement.getAttribute('stop-color');
                setOfColors.add(stopColor);
            });
        }
    }
    else {
        if (setOfColors.size === 0) {
            setOfColors.add('#000000');
        }
        console.log('No style element found.');
    }
    const colors = Array.from(setOfColors).filter(item => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(item));
    colors.forEach(color => displayColors(color, svgElement));
    return styles;
}
function parseStyle(styleString) {
    if (!styleString)
        return {};
    return styleString.split(";").reduce((acc, prop) => {
        const [key, value] = prop.split(":").map((s) => s.trim());
        if (key && value)
            acc[key] = value;
        return acc;
    }, {});
}
