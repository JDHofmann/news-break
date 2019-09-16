const catUrl = "https://api.thecatapi.com/v1/images/search?"
const ronUrl = "https://ron-swanson-quotes.herokuapp.com/v2/quotes/"

function displayCatResults(catJson) {
  $('.results-list').append(
    `<li><img class="catImg" src="${catJson[0].url}"><li>`
  );
  console.log('`displayCatResults` has run');
}
function displayRonResults(json) {
  $('.results-list').append(
    `<li><img class="ron-quote">${json}<li>`
  );
}
let alternateRequestCounter = 2;
async function alternateRequest() {

  if ( alternateRequestCounter % 2 === 0) {
    await catRequest();
  }
  else {
    await requestRonQuote();
  }
  alternateRequestCounter++;
  return alternateRequestCounter
}

async function catRequest() {
  try {
    const response = await fetch(catUrl);
    const catJson = await response.json();
    displayCatResults(catJson);
  } catch(err) {
    $('.error-message').text(`Something in catRequest went wrong: ${err.message}`);
  }
}
async function requestRonQuote() {
  try {
    const response = await fetch(ronUrl);
    const json = await response.json();
    displayRonResults(json);
  } catch(err) {
    $('.error-message').text(`Something went wrong: ${err.message}`);
  }
}
requestRonQuote();
