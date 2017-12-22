// TODO: Finish this file vid 34 (2:15)
import axios from 'axios';
import { $ } from './bling';

// const defLat = -37.97;
// const defLng = 144.49;

const defLat = 43.2;
const defLng = -79.8;

const mapOptions = {
  center: { lat: defLat, lng: defLng },
  zoom: 10
};

function loadPlaces(map, lat = defLat, lng = defLng) {
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
    .then(res => {
      const places = res.data;
      if(!places.length) {
        alert('No places found!');
        return;
      }

      const bounds = new google.maps.LatLngBounds();
      const infoWindow = new google.maps.InfoWindow();

      const markers = places.map(place => {
        const [placeLng, placeLat] = place.location.coordinates;
        const position = { lat: placeLat, lng: placeLng };
        bounds.extend(position);
        const marker = new google.maps.Marker({ map, position });
        marker.place = place;
        return marker;
      });

      // when marker is clicked, show details about that marker
      markers.forEach(marker => marker.addListener('click', function() {
        const html = `
          <div class="popup">
            <a href="/store/${this.place.slug}">
              <img src="/uploads/${this.place.photo || 'store.png'}"
                alt="${this.place.name}" />
              <p>${this.place.name} - ${this.place.location.address}</p>
            </a>
          </div>
        `;
        infoWindow.setContent(html);
        infoWindow.open(map, this);
      }));

      // zoom map to fit all markers
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);
    })
    .catch(console.error);
}

function makeMap(mapDiv) {
  if(!mapDiv) return;

  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);
  const input = $('[name="geolocate"]');
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    loadPlaces(map, place.geometry.location.lat(), places.geometry.location.lng());
  });
}

export default makeMap;