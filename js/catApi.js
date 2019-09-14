const url = "https://api.thecatapi.com/v1/images/search?limit=5"
let catStash = [''];

function storeCats(responseJson) {
  let catStash = responseJson;
  console.log(responseJson);
  console.log(catStash);
  //displayCatResults(catStash);
  return catStash;
}

let catCounter = 0;
function catCounterCurrent(){
  catCounter++;
  console.log(catCounter);
}

function displayCatResults(catJson) {
  $('.results-list').append(
    `<li><img class="catImg" src="${catJson[0].url}"><li>`
  );
  catCounterCurrent();
  console.log('`displayCatResults` has run');
}

function getCat() {
  fetch(url)
    .then(response => {
      if (response.ok) {
        return  response.json();
      }
      throw new Error(response.statusText);
    })
    .then( responseJson =>
      storeCats(responseJson),
      //displayCatResults(responseJson)
    )
    .catch( err => {
      $('.error-message').text(`Something in getCat went wrong: ${err.message}`);
    });
    //console.log('`getCat` has run');
}

async function catRequest() {
  try {
    const response = await fetch(url);
    const catJson = await response.json();
    displayCatResults(catJson);
    //storeCats(catJson);
  } catch(err) {
    $('.error-message').text(`Something in catRequest went wrong: ${err.message}`);
  }
}
/*
function getCat() {

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => $('.results-list').append(
      `<li><img class="catImg" src="${responseJson[0].url}"><li>`
    )
  )
    .catch( err => {
      $('.error-message').text(`Something went wrong: ${err.message}`);
    });
    console.log('`getCat` has run');
}
*/
