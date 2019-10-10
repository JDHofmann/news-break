let STORE = [
  {
    'function': 'catRequest();',
    'get': true
  },
  {
    'function': 'requestRonQuote();',
    'get': true
  }
];
const catUrl = "https://api.thecatapi.com/v1/images/search?";
const ronUrl = "https://ron-swanson-quotes.herokuapp.com/v2/quotes/";
let alternateRequestCounter = 0;

function checkCounter() {
  //console.log(alternateRequestCounter);
  if ( alternateRequestCounter < STORE.length) {
    return alternateRequestCounter;
  }
  else {
    alternateRequestCounter = 0;
    return alternateRequestCounter;
  }
}
async function alternateRequest() {
  checkCounter();
  if ( STORE[alternateRequestCounter].get === true) { await eval(
    STORE[alternateRequestCounter].function);
    alternateRequestCounter++;
  }
  else {
    alternateRequestCounter++;
    await alternateRequest();
  }
}

async function catRequest() {
  try {
    const response = await fetch(catUrl);
    const catJson = await response.json();
    await displayCatResults(catJson);
  } catch(err) {
    $('.error-message').text(`Something in catRequest went wrong: ${err.message}`);
  }
}
async function requestRonQuote() {
  try {
    const response = await fetch(ronUrl);
    const json = await response.json();
    await displayRonResults(json);
  } catch(err) {
    $('.error-message').text(`Something went wrong: ${err.message}`);
  }
}
function displayCatResults(catJson) {
  $('.results-list').append(
    `<li><div class='alternate-container'><img class="catImg" src="${catJson[0].url}"></div><li>`
  );
  //console.log('`displayCatResults` has run');
}
function displayRonResults(json) {
  $('.results-list').append(
    `<li><div class='alternate-container'><div class="Swanson Container">
    </div><h4 aria-label="Quote from Ron Swanson" class="ron-quote">${json}</h4></div><li>`
  );
  //console.log('`displayRonResults` has run');
}
