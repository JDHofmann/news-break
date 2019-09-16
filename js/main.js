'use strict';
const newsApiKey = "22e6ec438e804e658da00de572c65e51";
const headlinesUrl = 'https://newsapi.org/v2/top-headlines';
const specificHeadlinesUrl = 'https://newsapi.org/v2/top-headlines';
const searchURL = 'https://newsapi.org/v2/everything';
const searchTerm = '';
let pageNumber = 1;
// let categorySelected = '';

$('.top').on('click', function(event) {
  let categorySelected = 'Top Headlines';
  loadHeadlines();
  removeMenu();
})

$('.business').on('click', function(event) {
  let categorySelected = 'Business';
  loadSpecificHeadlines(categorySelected);
  removeMenu();
})
$('.technology').on('click', function(event) {
  let categorySelected = 'Technology';
  loadSpecificHeadlines(categorySelected);
  removeMenu();
})
$('.health').on('click', function(event) {
  let categorySelected = 'Health';
  loadSpecificHeadlines(categorySelected);
  removeMenu();
})
$('.sports').on('click', function(event) {
  let categorySelected = 'Sports';
  loadSpecificHeadlines(categorySelected);
  removeMenu();
})
$('.entertainment').on('click', function(event) {
  let categorySelected = 'Entertainment';
  loadSpecificHeadlines(categorySelected);
  removeMenu();
})

function pageNumberTracker() {
  pageNumber++;
  return pageNumber;
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
  return queryItems.join('&');
}

function getNews(query) {
  $('.search-parameter').html(`${query}`);
  const params = {
    q: query,
    language: "en",
    pageSize: 12,
    page: pageNumber
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
  const options = {
    headers: new Headers({
      "X-Api-Key": newsApiKey})
  };
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch( err => {
      $('.error-message').text(`Something went wrong: ${err.message}`);
    });
  pageNumberTracker();
}

async function displayResults(responseJson) {
  let storyCounter = 1;
  $('.results-list').empty();
  $('.results-list').append(
    `<li><a target="_blank" href="${responseJson.articles[0].url}"><p>${responseJson.articles[0].source.name}</p><h3>${responseJson.articles[0].title}</h3><img class="article-thumbnail" src='${responseJson.articles[0].urlToImage}'>
    </a></li>`);

  for (let i = 1; i < 16 ; i++){
    if ( (i + 1) % 4 === 0 ) {
      await alternateRequest();
    } else {
    $('.results-list').append(
      `<li><a target="_blank" href="${responseJson.articles[storyCounter].url}"><p>${responseJson.articles[storyCounter].source.name}</p><h3>${responseJson.articles[storyCounter].title}</h3><img class="article-thumbnail" src='${responseJson.articles[storyCounter].urlToImage}'>
      </a></li>`
    );
    storyCounter++;
    }
  }
    // console.log('`displayResults` has run');
    $('.more-stories').css('visibility', 'visible');
    watchMoreStories();
    // add back in for tablet size
    // <p>${responseJson.articles[i].description}</p>
};

function watchMoreStories() {
  $('.more-stories').on('click', function(event) {
    loadHeadlines(pageNumber);
  })
}

function loadHeadlines(pageNumber){
  $('.search-parameter').html('Top Headlines');
  const params = {
    language: "en",
    country: 'us',
    pageSize: 12,
    page: pageNumber
    };
  const queryString = formatQueryParams(params)
  const url = headlinesUrl + '?' + queryString;
  const options = {
    headers: new Headers({
      "X-Api-Key": newsApiKey})
  };
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch( err => {
      $('.error-message').text(`Something in loadHeadlines went wrong: ${err.message}`);
    });
    pageNumberTracker();

    // return pageNumber;
    // console.log(url);
}

function loadSpecificHeadlines(categorySelected){
  $('.search-parameter').html(`${categorySelected}`);
  const params = {
    language: "en",
    country: 'us',
    pageSize: 12,
    page: pageNumber,
    category: categorySelected,
    // for menu links
    };
  const queryString = formatQueryParams(params)
  const url = specificHeadlinesUrl + '?' + queryString;
  const options = {
    headers: new Headers({
      "X-Api-Key": newsApiKey})
  };
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch( err => {
      $('.error-message').text(`Something in loadSpecificHeadlines went wrong: ${err.message}`);
    });
    pageNumberTracker();
}


function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    let searchTerm = $('.search-input').val();
    getNews(searchTerm);
    $('.search-input').val('');
  });
}

function displayMenu() {
  $('nav').css('left', '0');
}
function removeMenu() {
  $('nav').css('left', '-60vw');
}

function watchOpenMenu() {
  let notNav = $('.results, input');
  notNav.on('click', function(event) {
    event.preventDefault();
      removeMenu();
      // console.log('remove menu');
  })
}
function watchMenu() {
  $('.menu-btn').on( 'click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    displayMenu();
    watchOpenMenu();
  })
}
/*
async function getAlternate() {
  const response = await catRequest();
}
*/
$(watchMenu());
$(loadHeadlines());
$(watchForm());
/* $(getAlternate());*/
