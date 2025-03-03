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







let currentPage: number = 1;
let lastPage: number = 1;
let style = '';
let selectedCategory = 'animated';

document.addEventListener("DOMContentLoaded", function() {
  const assetsDropdown: any = document.getElementById('assets');
  assetsDropdown.value = 'animated';
  fetchByCategory('animated', style, '');
  document.getElementById('select-img').style.display = 'none';

});


document.getElementById('select-box').addEventListener('click', function() {
  const dropdown = document.querySelector('.custom-select');
  dropdown.classList.toggle('open');
});


document.querySelector('.buttons-wrapper button:nth-child(2)').addEventListener('click', () => {
  if (currentPage < lastPage) {
    currentPage++;
    fetchByCategory(selectedCategory, style, '')
  }
});

document.querySelector('.buttons-wrapper button:nth-child(1)').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchByCategory(selectedCategory, style, '')
  }
});

document.getElementById('assets').addEventListener('change', (event: any) => {
  selectedCategory = event.target.value;
  style = ''
  fetchByCategory(selectedCategory, style, '');
  resetSearchValue()
  resetSelectedStyle();
});

document.getElementById('search').addEventListener('input', function(event:any) {
  const searchQuery: any = event.target.value.trim();
  fetchByCategory(selectedCategory, style, searchQuery);
});

function resetSearchValue () {
  const search: any = document.getElementById('search')
  search.value =''
}
function handleSelectionChange() {
  const select: any = document.getElementById('selection');
  const selectedOption = select.options[select.selectedIndex];
  const link = selectedOption.getAttribute('data-link');
  if (link) {
    window.open(link, '_blank');
  }
}


function handleSelectionChangeInMain() {
  currentPage = 1
}

function fetchByCategory (category: string, style: string, filteredText?: string) {
  let url = '';
  fetchStyles(category)
  document.getElementById('not-found').style.display = 'none';
  switch (category) {
    case 'animated':
      url = `https://creattie.com/api/filter?search=&category=lottie-animated-illustrations&isCollection=0&isPeople=0&plan=all&tags=&styles=${style}&orderBy=order&page=${currentPage}`;
      fetchAnimatedIllustrations(url, filteredText)
      break;
    case 'illustrations':
      url = `https://creattie.com/api/filter?search=&category=illustrations&isCollection=0&isPeople=0&plan=all&tags=&styles=${style}&orderBy=order&page=${currentPage}`;
      fetchData(url, filteredText);
      break;
    case 'animated icons':
      url = `https://creattie.com/api/filter?search=&category=lottie-animated-icons&isCollection=0&isPeople=0&plan=all&tags=&styles=${style}&orderBy=order&page=${currentPage}`;
      fetchAnimatedIllustrations(url, filteredText)
      break;
    case 'icons':
      url = `https://creattie.com/api/filter?search=&category=icons&isCollection=0&isPeople=0&plan=all&tags=&styles=${style}&orderBy=order&page=${currentPage}`;
      fetchData(url, filteredText);
      break;
    case 'all':
    default:
      url = `https://creattie.com/api/filter?category=all&isCollection=0&page=${currentPage}`;
      break;
  }

}


function fetchAnimatedIllustrations(url: string, filteredText? :string) {
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
      lastPage= data.lastPage;

      const filteredData=    data.products.filter(product => {
        return product.name.toLowerCase().includes(filteredText.trim().toLowerCase())
      })

      data.products.filter(product => {
          return product.name.toLowerCase().includes(filteredText.trim().toLowerCase())
        }).forEach(product => {
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
          productDiv.appendChild(video)
          dataContainer.appendChild(productDiv);
        }
        return product
      });

      if (!data.products.length || !filteredData.length) {
        document.getElementById('not-found').style.display = 'block';
      }
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
  selectedImg.setAttribute('src' , '');
}



// document.getElementById('styles').addEventListener('change', (event: any) => {
//   style = event.target.value;
//   fetchByCategory(selectedCategory, style)
// });

function fetchData(url: string, filteredText?: string) {
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
      lastPage= data.lastPage;

      const filteredData=    data.products.filter(product => {
        return product.name.toLowerCase().includes(filteredText.trim().toLowerCase())
      })


      data.products.filter(product => {
        if (!product) {
            document.getElementById('not-found').style.display = 'block';
          }
          return product.name.toLowerCase().includes(filteredText.trim().toLowerCase())
        }).forEach(product => {
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
        dataContainer.appendChild(productDiv);
        document.getElementById('loading-indicator').style.display = 'none';
      });
      if (!data.products.length || !filteredData.length) {
        document.getElementById('not-found').style.display = 'block';
      }

    }
    catch (error) {
      console.error('Error fetching data: ', error);
    }
  });
}

// function fetchStyles(category: string) {
//   return __awaiter(this, void 0, void 0, function* () {
//     try {
//       const response = yield fetch("https://creattie.com/api/styles");
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = yield response.json();
//       switch (category) {
//         case 'animated':
//         case 'illustrations': {
//           populateStylesDropdown(data.data.illustrations)
//           return data.data.illustrations
//         }
//
//         case 'icons':
//         case'animated icons' : {
//           populateStylesDropdown(data.data.icons)
//           return data.data.icons
//         }
//
//       }
//       console.log(data)
//     }
//     catch (error) {
//       console.error('Error fetching data: ', error);
//     }
//   });
// }
//
// function populateStylesDropdown(stylesData) {
//   const stylesDropdown = document.getElementById('styles');
//   stylesDropdown.innerHTML = '';
//
//
//   const allOption = document.createElement('option');
//   allOption.value = 'all';
//   allOption.textContent = 'All styles';
//   stylesDropdown.appendChild(allOption);
//
//   stylesData.forEach(style => {
//     const option = document.createElement('option');
//     option.value = style.name || style;
//     option.innerHTML = ` ${style.name}`;
//     option.style.backgroundImage = `url(${style.image})`;
//     option.style.backgroundSize = 'cover';
//     option.style.backgroundPosition = 'center';
//     option.setAttribute('data-thumbnail', style.image)
//     stylesDropdown.appendChild(option);
//   });
// }


function populateStylesDropdown(stylesData) {
  const optionsContainer = document.getElementById('styles-options-container');
  optionsContainer.innerHTML = '';

  const allOption = document.createElement('div');
  allOption.classList.add('option');
  allOption.setAttribute('data-value', '');
  allOption.setAttribute('selected', 'selected');
  allOption.innerHTML = `
    <img src="/assets/all.png" alt="all styles" />
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
    option.addEventListener('click', function() {
      const selectedStyle = this.getAttribute('data-value');
      const selectedText = this.querySelector('span').textContent;
      const selectedImg = this.querySelector('img').src;

      const selectedBox = document.querySelector('.selected-text');
      selectedBox.textContent = selectedText;
      const selectedImage = document.querySelector('.selected-img');
      selectedImage.setAttribute('src',selectedImg);
      document.getElementById('select-img').style.display = 'block';
      document.getElementById('select-img').style.width = '20px';
      document.getElementById('select-img').style.background = '#ffffff';
      document.getElementById('select-img').style.borderRadius = '50%';
      document.querySelector('.custom-select').classList.remove('open');
      style = selectedStyle;
      fetchByCategory(selectedCategory, style, '');
      resetSearchValue()
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
    } catch (error) {
      console.error('Error fetching styles:', error);
    }
  });
}


