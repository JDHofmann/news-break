'use strict';
const newsApiKey = "22e6ec438e804e658da00de572c65e51";
const headlinesUrl = 'https://newsapi.org/v2/top-headlines';
const specificHeadlinesUrl = 'https://newsapi.org/v2/top-headlines';
const searchURL = 'https://newsapi.org/v2/everything';
const searchTerm = '';
let pageNumber = 1;
let breaksSelector = $('.break-options').val();
let toggleCat = true, toggleRon = true;
let breakSelected;
let isSearchBarEnabled = false;
let mobileMenu;
// $('.break-options').val(breaksSelected);

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

// SEARCH BAR

const underTabletSize = window.matchMedia("(max-width: 768px)");
function checkScreenSize(underTabletSize) {
  if (underTabletSize.matches) { // If media query matches
    mobileMenu = true;
    return mobileMenu
  }
  else {
    let mobileMenu = false;
    return mobileMenu
  }
}
$('.back-btn').on('click', function(event) {
  disableSearchBar();
});
$('.search').on('click', function(event) {
  if ( isSearchBarEnabled === false && mobileMenu === true ) {
    event.preventDefault();
    enableSearchBar();
  }
})
function enableSearchBar() {
  $('.menu-btn').css('display', 'none');
  $('.logo').css('grid-column', '1/3');
  $('.back-btn').css('display', 'block');
  $('.search-input').css('display', 'block');
  toggleSearchStatus();
}
function disableSearchBar() {
  $('.search-input').css('display', 'none');
  $('.back-btn').css('display', 'none');
  $('.logo').css('grid-column', '3/6');
  $('.menu-btn').css('display', 'block');
  toggleSearchStatus();
}
function toggleSearchStatus() {
  if ( isSearchBarEnabled === false ) {
    isSearchBarEnabled = true;
    return isSearchBarEnabled
  }
  else {
    isSearchBarEnabled = false;
    return isSearchBarEnabled
  }
}

function watchForm(mobileMenu) {
  $('form').submit(event => {
    event.preventDefault();
    let searchTerm = $('.search-input').val();
    getNews(searchTerm);
    $('.search-input').val('');
    if ( mobileMenu === true ) {
      disableSearchBar();
    }
    else {
    }
  });
}

// BURGER MENU

function watchMenu() {
  $('.menu-btn').on( 'click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    displayMenu();
    watchOpenMenu();
  })
}
function watchOpenMenu() {
  let notNav = $('.results, input');
  notNav.on('click', function(event) {
    event.preventDefault();
      removeMenu();
      // console.log('remove menu');
  })
}
function displayMenu() {
  $('nav').css('left', '0');
}
function removeMenu() {
  $('nav').css('left', '-80vw');
}

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
    `<li><a target="_blank" href="${responseJson.articles[0].url}"><div class="story-container"><h3>${responseJson.articles[0].title}</h3><h5>${responseJson.articles[0].source.name}</h5><p> &bull; ${responseJson.articles[0].description}</p></div><img class="article-thumbnail" src='${responseJson.articles[0].urlToImage}'>
    </a></li>`);

  for (let i = 1; i < 16 ; i++){
    if ( (i + 1) % 4 === 0 ) {
      await alternateRequest();
    } else {
      //console.log('loading story');
    $('.results-list').append(
      `<li><a target="_blank" href="${responseJson.articles[storyCounter].url}"><div class="story-container"><h3>${responseJson.articles[storyCounter].title}</h3><h5>${responseJson.articles[storyCounter].source.name}</h5><p> &bull; ${responseJson.articles[storyCounter].description}</p></div><img class="article-thumbnail" src='${responseJson.articles[storyCounter].urlToImage}'>
      </a></li>`
    );
    storyCounter++;
    }

  }
    //console.log('`displayResults` has run');
    $('.more-stories').css('visibility', 'visible');
    watchMoreStories();
    //watchBreaksChange(responseJson);

    //console.log(responseJson);
    // return responseJson
};

function watchMoreStories() {
  //console.log('more stories is being watched');
  $('.more-stories').on('click', function(event) {
    loadHeadlines(pageNumber);
  })
}

function loadHeadlines(pageNumber){
  $('.search-parameter').html('Top Headlines');
  let params = {
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
    //console.log(url);
    return pageNumber;

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




function watchBreaksSelector() {
  if ( breaksSelector === 'all') {
    for ( let i = 0; i < STORE.length; i++) {
      STORE[i].get = true;
    }
  }
  else if ( breaksSelector === 'cats') {
    STORE[0].get = true;
    let current = STORE[0];
    let storeWithoutCurrent = STORE.filter( function(x) {
      return x !== current
    });
    for ( let i = 0; i < storeWithoutCurrent.length; i++) {
      storeWithoutCurrent[i].get = false;
    }
  }
  else if ( breaksSelector === 'ron') {
    STORE[1].get = true;
    let current = STORE[1];
    let storeWithoutCurrent = STORE.filter( function(x) {
      return x !== current
    });
    for ( let i = 0; i < storeWithoutCurrent.length; i++) {
      storeWithoutCurrent[i].get = false;
    }
  }

  //console.log(breaksSelector);
  //console.log(STORE);
  return STORE;
}

function watchBreaksChange(responseJson) {
  //console.log('breaks change being watched');
  $('.break-options').change(function(responseJson) {
  //breakSelected = $('.break-options').val();
    //location.reload();
    //location.reload(true);
    alert ( 'display results again');
    console.log(responseJson);
    displayResults(responseJson);

  })
}


$(checkScreenSize(underTabletSize));
$(watchBreaksSelector());
$(watchMenu());
$(loadHeadlines(pageNumber));
$(watchForm(mobileMenu));
