'use strict';
const newsApiKey = "22e6ec438e804e658da00de572c65e51";
const headlinesUrl = 'https://newsapi.org/v2/top-headlines';
const specificHeadlinesUrl = 'https://newsapi.org/v2/top-headlines';
const searchURL = 'https://newsapi.org/v2/everything';
const searchTerm = '';
let pageNumber = 1;
let toggleCat, toggleRon, areThereMoreStories = true;
let breakSelected;
let categorySelected;
let mostRecentJson;
let mobileMenu, desktopMenu, signInOpen, isSearchBarEnabled = false;
let loading = {
  'headlines':false,
  'sheadlines':false,
  'news':false
}
// $('.break-options').val(breaksSelected);


/* SIGN IN POP UP */

$('.account-sign-in').on('click', function(event) {
  $('.sign-in-mask').css('display','block');
  $('.sign-in').css('display','block');
  signInOpen = true;
  watchSignIn();
})

function watchSignIn() {
  $('.sign-in-close').on('click', function(event) {
    removeSignIn();
  })
  $(document).keyup(function(e) {
     if (e.key === "Escape") {
       removeSignIn();
    }
});
}
$('.submit').on('click', function(event) {
  removeSignIn();
})
$('.sign-in-mask').on('click', function(event) {
  removeSignIn();
})

function removeSignIn() {
  $('.sign-in-mask').css('display','none');
  $('.sign-in').css('display','none');
}

// SEARCH BAR
const desktopSize = window.matchMedia("(min-width: 820px)");
const underTabletSize = window.matchMedia("(max-width: 767px)");

function checkScreenSize(underTabletSize, desktopSize) {
  if (underTabletSize.matches) { // If media query matches
    mobileMenu = true;
    console.log(mobileMenu)
    return mobileMenu

  }
  else if (desktopSize.matches) {
    desktopMenu = true;
    console.log(desktopMenu);
    return desktopMenu
  }
  else {
    mobileMenu = false;
    desktopMenu = false;
    console.log(desktopMenu)
    console.log(mobileMenu)
    return mobileMenu, desktopMenu
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
    removeMenu();
    resetPageNumber();
    let searchTerm = $('.search-input').val();
    getNews(searchTerm, pageNumber);
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
    closeMenu();
  })
}
function closeMenu() {
  $('.close-menu').on('click', function(event) {
    event.preventDefault();
    removeMenu();
  })
  $('.nav-mask').on('click', function(event) {
    removeMenu();
  })
  $(document).keyup(function(e) {
     if (e.key === "Escape") {
       removeMenu();
     }
  })
}
function displayMenu() {
  $('.nav-list').css('left', '0');
  $('.menu-btn').css('display', 'none');
  $('.close-menu').css('display', 'block');
  $('.nav-mask').css('display', 'block');
  $('.top').focus();
}
function removeMenu() {
  if ( desktopMenu === false) {
    $('.nav-list').css('left', '-80vw');
    $('.nav-mask').css('display', 'none');
    $('.close-menu').css('display', 'none');
    $('.menu-btn').css('display', 'block');
  }
}

/* HEADLINES */

$('.top').on('click', function(event) {
  categorySelected = 'Top Headlines';
  resetPageNumber();
  loadHeadlines(pageNumber);
  removeMenu();
})

$('.business').on('click', function(event) {
  categorySelected = 'Business';
  resetPageNumber();
  loadSpecificHeadlines(categorySelected, pageNumber);
  removeMenu();
})
$('.technology').on('click', function(event) {
  categorySelected = 'Technology';
  resetPageNumber();
  loadSpecificHeadlines(categorySelected, pageNumber);
  removeMenu();
})
$('.health').on('click', function(event) {
  categorySelected = 'Health';
  resetPageNumber();
  loadSpecificHeadlines(categorySelected, pageNumber);
  removeMenu();
})
$('.sports').on('click', function(event) {
  categorySelected = 'Sports';
  resetPageNumber();
  loadSpecificHeadlines(categorySelected, pageNumber);
  removeMenu();
})
$('.entertainment').on('click', function(event) {
  categorySelected = 'Entertainment';
  resetPageNumber();
  loadSpecificHeadlines(categorySelected, pageNumber);
  removeMenu();
})

// NEWS FETCH

function pageNumberTracker() {
  pageNumber = pageNumber + 1;
  console.log(`${pageNumber} from pageNumberTracker`);
  return pageNumber;
}

function resetPageNumber(){
  pageNumber = 1;
  areThereMoreStories = true;
  return pageNumber, areThereMoreStories
}

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
  return queryItems.join('&');
}

async function displayResults(responseJson, pageNumber) {
  console.log(areThereMoreStories)
  console.log(pageNumber)
  mostRecentJson = responseJson;
  watchBreaksChange(mostRecentJson);
  //console.log(responseJson)
  let storyCounter = 1;
    $('.results-list').empty();
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
        return areThereMoreStories
      }

        else {
          $('.results-list').append(
          `<li><a target="_blank" aria-describedby="continue reading ${responseJson.articles[storyCounter].title} in a new tab" href="${responseJson.articles[storyCounter].url}"><div class="story-container"><h3>${responseJson.articles[storyCounter].title}</h3><h5>${responseJson.articles[storyCounter].source.name}</h5><p> &bull; ${responseJson.articles[storyCounter].description}</p></div><img class="article-thumbnail" src='${responseJson.articles[storyCounter].urlToImage}'>
          </a></li>`
          );
          storyCounter++;
        }
//    console.log(`story ${storyCounter} ${responseJson.articles[storyCounter].title}`);
  }
  console.log('displayResults has run');
  if ( pageNumber < 2 && areThereMoreStories === true) {
    watchMoreStories(categorySelected);
  }
  else if ( areThereMoreStories === false) {
    removeMoreStories()
  }
};

function saveJson(responseJson) {
  mostRecentJson = responseJson;
  return mostRecentJson
}

function watchMoreStories(categorySelected) {
  console.log(`watchMoreStories is called pageNumber= ${pageNumber}`);
  $('.more-stories').css('display', 'block');
// test
  $('.more-stories').on('click', function(event) {
    console.log('more stories clicked')
    if (loading.headlines === true) {
      console.log('loadHeadlines called');
      loadHeadlines(pageNumber);
    }
    else if ( loading.sheadlines === true) {
      loadSpecificHeadlines(categorySelected, pageNumber);
    }
    else if ( loading.news === true ) {
      getNews(pageNumber);
    }
  })
  // console.log('watchMoreStories has run');
}

function removeMoreStories() {
  // console.log('thats all folks')
  $('.more-stories').css('display', 'none');
}

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
  const queryString = await formatQueryParams(params)
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
    .then(responseJson => displayResults(responseJson, pageNumber))
    .catch( err => {
      $('.error-message').text(`Something in loadHeadlines went wrong: ${err.message}`);
    });
    //console.log('loadHeadlines ran');
  pageNumberTracker();
    // return pageNumber
}

async function loadSpecificHeadlines(categorySelected, pageNumber){
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
    // for menu links
    };
  const queryString = await formatQueryParams(params)
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
    .then(responseJson => displayResults(responseJson, pageNumber))
    /*
    .catch( err => {
      $('.error-message').text(`Something in loadSpecificHeadlines went wrong: ${err.message}`);
    });
    */
    //console.log('loadSpecificHeadlines ran');
    await pageNumberTracker();
}

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
  const queryString = await formatQueryParams(params)
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
    .then(responseJson => displayResults(responseJson, pageNumber))
    .catch( err => {
      $('.error-message').text(`Something went wrong: ${err.message}`);
    });
  console.log('getNews ran');
  await pageNumberTracker();
}

function watchBreaksSelector() {
  let breaksSelector = $('.break-options').val();
  //console.log(breaksSelector);
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
  return STORE;
}

function watchBreaksChange(responseJson) {
  $('.break-options').change(function() {
    watchBreaksSelector();
    displayResults(responseJson);
  })
}

$(checkScreenSize(underTabletSize, desktopSize));
$(watchBreaksSelector());
$(watchMenu());
$(loadHeadlines(pageNumber));
$(watchForm(mobileMenu));
$('.nav').focus();
