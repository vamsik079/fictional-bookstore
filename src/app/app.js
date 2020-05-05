const getTemplate = (book) => {
  if (typeof book == 'number') {
    return `<div class="card book flex flex-row w-30 p-0 mt-2 mb-2 mb-sm-0 mb-xs-0 mb-md-0">
      <div class="img" style="width: 120px;"></div>
      <div class="card-body p-0 pr-2 pl-2">
        <p class="card-title mb-1 pt-2 font-weight-bolder author">.........</p>
        <p class="fs-7 mb-1"> By .....</p>
        <p class="card-text  desc"> """"""""""""""""""""""""""""""<br/>""""""""""""""""""""""""""""""</p>
       </div>
    </div>`;
  }
  let thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '';
  let description = book.volumeInfo.description ? book.volumeInfo.description.slice(0, 50) + '...' : '';
  let author = book.volumeInfo.authors ? book.volumeInfo.authors[0] : '';
  return `<div class="card book flex flex-row w-30 p-0 mt-2 mb-2 mb-sm-0 mb-xs-0 mb-md-0">
  <div class="class="img"></div>  
  <img style="width: 120px;" src="${thumbnail}" class="card-img-top" alt="">
    <div class="card-body p-0 pr-2 pl-2">
      <p class="card-title mb-1 pt-2 font-weight-bolder author">${book.volumeInfo.title}</p>
      <p class="fs-7 mb-1"> By ${author}</p>
      <p class="card-text  desc">${description}</p>
    </div>
  </div>`;
}

const generateList = (list) => {
  let booksList = document.getElementById("books");
  let books = '';
  list.forEach((book) => {
    books += getTemplate(book);
  });
  booksList.innerHTML = books;
}

const storeCategories = (book) => {
  let categories = localStorage.getItem('Categories')
  let bookCategorie = book.volumeInfo.categories;
  if (!categories) {
    localStorage.setItem('Categories', JSON.stringify(bookCategorie));
  } else {
    if (JSON.parse(categories).length < 5) {
      let catogories = JSON.parse(categories).concat(bookCategorie);
      localStorage.setItem('Categories', JSON.stringify(catogories));
    } else {
      let catogories = JSON.parse(categories).reverse().slice(0, 4).concat(bookCategorie);
      localStorage.setItem('Categories', JSON.stringify(catogories));
    }
  }
}

const getResults = (searchTerm, isInitalSearch) => {
  generateList([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`).then(async (res) => {
    let data = await res.json();
    if (!isInitalSearch) {
      storeCategories(data.items[0]);
    }
    generateList(data.items);
  })
}

export const run = () => {
  let searchBtn = document.getElementById('form');
  let ls = localStorage.getItem('Categories')
  if (ls) {
    getResults(JSON.parse(ls)[Math.floor(Math.random() * JSON.parse(ls).length-1)], true);
  }
  searchBtn.addEventListener('submit', (e) => {
    console.log("Called")
    e.preventDefault();
    getResults(document.getElementById('searchTerm').value);
  })
};


