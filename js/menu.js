const businessUrl = 'https://newsapi.org/v2/top-business?pageSize=3&country=us'

$('.business').on('click', function(event) {

})

function loadBusiness(){
  const options = {
    headers: new Headers({
      "X-Api-Key": newsApiKey})
  };
  fetch(businessUrl, options)
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
}
