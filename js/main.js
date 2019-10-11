/*jshint esversion: 8 */
/*globals $:false */
'use strict';
const newsApiKey = "22e6ec438e804e658da00de572c65e51";

const headlinesUrl = 'https://newsapi.org/v2/top-headlines', specificHeadlinesUrl = 'https://newsapi.org/v2/top-headlines', searchURL = 'https://newsapi.org/v2/everything', searchTerm = '';

let breakSelected, categorySelected, mostRecentJson, pageNumber = 1;

let toggleCat, toggleRon, areThereMoreStories = true;

let mobileMenu, desktopMenu, signInOpen, isSearchBarEnabled = false;

let loading = {
  'headlines':false,
  'sheadlines':false,
  'news':false
};

/* SIGN IN POP UP */

$('.account-sign-in').on('click', function(event) {
  $('.sign-in-mask').css('display','block');
  $('.sign-in').css('display','block');
  signInOpen = true;
  watchSignIn();
});

function watchSignIn() {
  $('.sign-in-close').on('click', e => removeSignIn());
  $(document).keyup(function(e) {
     if (e.key === "Escape") {
       removeSignIn();
    }
});
}
$('.submit').on('click', e => removeSignIn());
$('.sign-in-mask').on('click', e => removeSignIn());

function removeSignIn() {
  $('.sign-in-mask').css('display','none');
  $('.sign-in').css('display','none');
}

// SEARCH BAR POPS OUT FOR FOR MOBILE

const desktopSize = window.matchMedia("(min-width: 820px)");
const underTabletSize = window.matchMedia("(max-width: 767px)");

function checkScreenSize(underTabletSize, desktopSize) {
  if (underTabletSize.matches) { // If media query matches
    mobileMenu = true;
    return mobileMenu;
  }
  else if (desktopSize.matches) {
    desktopMenu = true;
    return desktopMenu;
  }
  else {
    mobileMenu = false;
    desktopMenu = false;
    return mobileMenu, desktopMenu;
  }
}
$('.back-btn').on('click', e => disableSearchBar());
$('.search').on('click', function(event) {
  if ( isSearchBarEnabled === false && mobileMenu === true ) {
    event.preventDefault();
    enableSearchBar();
  }
});
function enableSearchBar() {
  $('.logo').css('display', 'none');
  $('form').css('grid-column', '2/8');
  $('form').css('grid-template-columns', '1fr 1fr 1fr 1fr 1fr 1fr');
  $('.search-input').css('grid-column', '2/6');
  $('.back-btn').css('display', 'block');
  $('.search-input').css('display', 'block');
  $('.search').css('grid-column', '6/7');
  toggleSearchStatus();
}
function disableSearchBar() {
  $('.search-input').css('display', 'none');
  $('.back-btn').css('display', 'none');
  $('form').css('grid-template-columns', '1fr 1fr');
  $('form').css('grid-column', '6/8');
  $('.search').css('grid-column', '2/3');
  $('.logo').css('display', 'block');
  $('.menu-btn').css('display', 'block');
  toggleSearchStatus();
}
function toggleSearchStatus() {
  if ( isSearchBarEnabled === false ) {
    isSearchBarEnabled = true;
    return isSearchBarEnabled;
  }
  else {
    isSearchBarEnabled = false;
    return isSearchBarEnabled;
  }
}

// FORM SUBMISSION FOR SEARCH

function watchForm(mobileMenu) {
  $('form').submit( event => {
    event.preventDefault();
    removeMenu();
    resetPageNumber();
    let $searchTerm = $('.search-input').val();
    getNews($searchTerm, pageNumber);
    $('.search-input').val('');
    if ( mobileMenu === true ) {
      disableSearchBar();
    }
    else {}
  });
}

// BURGER MENU OPEN AND CLOSE

function watchMenu() {
  $('.menu-btn').on( 'click', function(event) {
    event.stopPropagation();
    event.preventDefault();
    displayMenu();
    //closeMenu();
  });
}
function closeMenu() {
  $('.close-menu').on('click', function(event) {
    event.preventDefault();
    removeMenu();
  });
  $('.nav-mask').on('click', function(event) {
    removeMenu();
  });
  $(document).keyup( function(e) {
     if (e.key === "Escape") {
       removeMenu();
     }
  });
}
function displayMenu() {
  $('.nav-list').css('left', '0');
  $('.menu-btn').css('display', 'none');
  $('.close-menu').css('display', 'block');
  $('.nav-mask').css('display', 'block');
  $('.top').focus();
}
function removeMenu() {
    $('.nav-list').css('left', '-80vw');
    $('.nav-mask').css('display', 'none');
    $('.close-menu').css('display', 'none');
    $('.menu-btn').css('display', 'block');
}

/* HEADLINES LINKS */

$('.top').on('click', function(event) {
  categorySelected = 'Top Headlines';
  resetPageNumber();
  loadHeadlines(pageNumber);
  removeMenu();
});

$('.business').on('click', function(event) {
  categorySelected = 'Business';
  resetPageNumber();
  loadSpecificHeadlines(categorySelected, pageNumber);
  removeMenu();
});
$('.technology').on('click', function(event) {
  categorySelected = 'Technology';
  resetPageNumber();
  loadSpecificHeadlines(categorySelected, pageNumber);
  removeMenu();
});
$('.health').on('click', function(event) {
  categorySelected = 'Health';
  resetPageNumber();
  loadSpecificHeadlines(categorySelected, pageNumber);
  removeMenu();
});
$('.sports').on('click', function(event) {
  categorySelected = 'Sports';
  resetPageNumber();
  loadSpecificHeadlines(categorySelected, pageNumber);
  removeMenu();
});
$('.entertainment').on('click', function(event) {
  categorySelected = 'Entertainment';
  resetPageNumber();
  loadSpecificHeadlines(categorySelected, pageNumber);
  removeMenu();
});

// NEWS FETCH

function pageNumberTracker() {
  pageNumber = pageNumber + 1;
  return pageNumber;
}

function resetPageNumber(){
  pageNumber = 1;
  areThereMoreStories = true;
  return pageNumber, areThereMoreStories;
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`);
  return queryItems.join('&');
}

// DISPLAY RESULTS OF ALL FETCHES

async function displayResults(responseJson, pageNumber, query) {
  let storyCounter = 1;
  $('.results-list').empty();
  if ( responseJson.articles[0] === undefined) {
    $('.results-list').append(`<li><div class="story-container"><h3>Sorry we couldn't load any stories</h3></li>`);
    $('.more-stories').remove();
  }
  else {
    $('.results-list').append(
      `<li><a target="_blank" aria-describedby="continue reading ${responseJson.articles[0].title} in a new tab" href="${responseJson.articles[0].url}"><div class="story-container"><h3>${responseJson.articles[0].title}</h3><h5>${responseJson.articles[0].source.name}</h5><p> &bull; ${responseJson.articles[0].description}</p></div><img class="article-thumbnail" src='${responseJson.articles[0].urlToImage}'>
      </a></li>`);
    for (let i = 1; i < 16 ; i++) {
      if ( (i + 1) % 4 === 0 ) {
        await alternateRequest();
      }
        else if ( responseJson.articles[storyCounter] === undefined) {
          areThereMoreStories = false;
          break;
        }
        else {
          $('.results-list').append(
          `<li><a target="_blank" aria-describedby="continue reading ${responseJson.articles[storyCounter].title} in a new tab" href="${responseJson.articles[storyCounter].url}"><div class="story-container"><h3>${responseJson.articles[storyCounter].title}</h3><h5>${responseJson.articles[storyCounter].source.name}</h5><p> &bull; ${responseJson.articles[storyCounter].description}</p></div><img class="article-thumbnail" src='${responseJson.articles[storyCounter].urlToImage}'>
          </a></li>`
          );
          storyCounter++;
        }
      }
    watchMoreStories(categorySelected, query, pageNumber);

  }
}

// MORE STORIES BUTTON

function watchMoreStories(categorySelected, query ) {
  $('.more-stories').remove();
  if (areThereMoreStories === true)  {
    $('.results').append('<h4 class="more-stories">Load More Stories</h4>');
    $('.more-stories').on('click', function(event) {
      if (loading.headlines === true) {
        loadHeadlines(pageNumber);
      }
      else if ( loading.sheadlines === true) {
        loadSpecificHeadlines(categorySelected, pageNumber);
      }
      else if ( loading.news === true ) {
        getNews(query, pageNumber);
      }
    });
  }
}

// TOP HEADLINES FETCH

async function loadHeadlines(pageNumber){
  $('.search-parameter').html('Top Headlines');
  loading.headlines = true;
  loading.sheadlines = false;
  loading.news = false;
  let params = {
    language: "en",
    country: 'us',
    pageSize: 12,
    page: pageNumber
    };
  const queryString = await formatQueryParams(params);
  const url = headlinesUrl + '?' + queryString;
  const options = {
    headers: new Headers({
      "X-Api-Key": newsApiKey})
  };
  await fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(function (responseJson){
      displayResults(responseJson, pageNumber);
      mostRecentJson = responseJson;
      return mostRecentJson;
    })
    .catch( err => {
      $('.error-message').text("Sorry we couldn't load any stories");
      $('.more-stories').remove();
    });
  pageNumberTracker();
  return pageNumber;
}

// OTHER HEADLINES FETCH

async function loadSpecificHeadlines(categorySelected, pageNumber) {
  $('.search-parameter').html(`${categorySelected}`);
  loading.sheadlines = true;
  loading.headlines = false;
  loading.news = false;
  const params = {
    language: "en",
    country: 'us',
    pageSize: 12,
    page: pageNumber,
    category: categorySelected,
    };
  const queryString = await formatQueryParams(params);
  const url = specificHeadlinesUrl + '?' + queryString;
  const options = {
    headers: new Headers({
      "X-Api-Key": newsApiKey})
  };
  await fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(function(responseJson) {
      displayResults(responseJson, pageNumber);
      mostRecentJson = responseJson;
      return mostRecentJson;
    })
    .catch( err => {
      $('.error-message').text("Sorry we couldn't load any stories");
      $('.more-stories').remove();
    });
    pageNumberTracker();
    return categorySelected, pageNumber;
}

// NEWS SEARCH FETCH

async function getNews(query, pageNumber) {
  $('.search-parameter').html(`${query}`);
  loading.news = true;
  loading.headlines = false;
  loading.sheadlines = false;
  const params = {
    q: query,
    language: "en",
    pageSize: 12,
    page: pageNumber
  };
  const queryString = await formatQueryParams(params);
  const url = searchURL + '?' + queryString;
  const options = {
    headers: new Headers({
      "X-Api-Key": newsApiKey})
  };
  await fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then( function(responseJson) {
      displayResults(responseJson, pageNumber, query);
      mostRecentJson = responseJson;
      return mostRecentJson;
    })
    .catch( err => {
      $('.error-message').text("Sorry we couldn't load any stories");
      $('.more-stories').remove();
    });
  pageNumberTracker();
}

// BREAKS SELECTOR LOCATED IN NAV

function watchBreaksSelector() {
  let $breaksSelector = $('.break-options').val();
  if ( $breaksSelector === 'all') {
    for ( let i = 0; i < STORE.length; i++) {
      STORE[i].get = true;
    }
  }
  else if ( $breaksSelector === 'cats') {
    STORE[0].get = true;
    let current = STORE[0];
    let storeWithoutCurrent = STORE.filter( function(x) {
      return x !== current;
    });
    for ( let i = 0; i < storeWithoutCurrent.length; i++) {
      storeWithoutCurrent[i].get = false;
    }
  }
  else if ( $breaksSelector === 'ron') {
    STORE[1].get = true;
    let current = STORE[1];
    let storeWithoutCurrent = STORE.filter( function(x) {
      return x !== current;
    });
    for ( let i = 0; i < storeWithoutCurrent.length; i++) {
      storeWithoutCurrent[i].get = false;
    }
  }
  return STORE;
}

function watchBreaksChange(responseJson) {
  $('.break-options').change(function() {
    watchBreaksSelector();
    displayResults(mostRecentJson, pageNumber);
  });
}

// ON LOAD

$(watchBreaksChange());
$(checkScreenSize(underTabletSize, desktopSize));
$(watchMenu());
$(closeMenu());
$(loadHeadlines(pageNumber));
$(watchForm(mobileMenu));
$('.nav').focus();
