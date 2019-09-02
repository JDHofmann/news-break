'use strict';
// my api key
const newsApiKey = "22e6ec438e804e658da00de572c65e51"
// endpoint
const searchURL = 'https://newsapi.org/v2/everything';

const searchTerm = '';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
  return queryItems.join('&');
}

function getNews(query) {
  const params = {
    q: query,
    language: "en",
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);
// pass api key through header for security
  const options = {
    headers: new Headers({
      "X-Api-Key": newsApiKey})
  };
// native JS api
  fetch(url, options)
    .then(response => {
      // check to see if response 200 ok
      if (response.ok) {
        return response.json();
      }
      // if not throw to error
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch( err => {
      $('.error-message').text(`Something went wrong: ${err.message}`);
    });
}
function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.articles.length & i<5 ; i++){
    // for each video object in the articles
    //array, add a list item to the results
    //list with the article title, source, author,
    //description, and image
    $('.results-list').append(
      `<li><a target="_blank" href="${responseJson.articles[i].url}"><p>${responseJson.articles[i].source.name}</p><h3>${responseJson.articles[i].title}</h3><img src='${responseJson.articles[i].urlToImage}'>
      </a></li>`
    )};
    // add back in for tablet size
    // <p>${responseJson.articles[i].description}</p>

  $('#results').removeClass('hidden');
};

function loadHeadlines(){
  let searchTerm = 'headlines';
  getNews(searchTerm);
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    let searchTerm = $('.search-input').val();
    getNews(searchTerm);
  });
}
$(loadHeadlines());
$(watchForm());
