function autocomplete(input, latInput, lngInput) {
  if(!input) return; // skip this from running if no inputs on page
  const dropdown = new google.maps.places.Autocomplete(input);

  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  })

  // If someone hits enter on the dropdown, do not submit the form
  input.on('keydown', (e) => {
    if(e.keycode === 13) e.preventDefault();
  })
}

export default autocomplete;