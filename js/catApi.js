const url = "https://api.thecatapi.com/v1/images/search"

function displayCatResults(responseJson) {
  $('.results-list').append(
    `<li><img class="catImg" src="${responseJson[0].url}"><li>`
  );
}

function getCat() {
  // console.log('`getCat` has run');
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayCatResults(responseJson))
    .catch( err => {
      $('.error-message').text(`Something went wrong: ${err.message}`);
    });
}
