const axios = require('axios');

function searchResultsHTML(stores) {
  return stores.map(store => {
    return `
      <a href="/store/${store.slug}" class="search__result">
        <strong>${store.name}</strong>
      </a>
    `;
  }).join('');
}

function typeAhead(search) {
  if (!search) return;

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function(){

    // If there is no value, quit it!
    if (!this.value){
      searchResults.style.display = 'none';
      return;
    }

    // Show the search results
    searchResults.style.display = 'block';
    searchResults.innerHTML = ''; // Reset the search when no results

    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          searchResults.innerHTML = searchResultsHTML(res.data);
        }
      })
      .catch(err => {
        console.error(err);
      });
  });

  // Handle keyboard inputs
  searchInput.on('keyup', (e) => {
    // If they arent pressing up, dow or enter key, who cares!
    if (![38, 40, 13].includes(e.keyCode)) {
      return; // Skip function
    }

    // TODO: Something here 12:17 video 32 (only 8 to go~)
  });
}

export default typeAhead;