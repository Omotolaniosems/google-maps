/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 20, lng: -160 },
    zoom: 2,
  });

  infoWindow = new google.maps.InfoWindow({
    content: ""
  });

  // Get the earthquake data (JSONP format)
  // This feed is a copy from the USGS feed, you can find the originals here:
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
  const script = document.createElement("script");

  script.setAttribute(
    "src",
    "https://storage.googleapis.com/mapsdevsite/json/quakes.geo.json"
  );
  document.getElementsByTagName("head")[0].appendChild(script);
}

// Defines the callback function referenced in the jsonp file.
function eqfeed_callback(results) {

  for (let i = 0; i < results.features.length; i++) {
    const coords = results.features[i].geometry.coordinates;

    const latLng = new google.maps.LatLng(coords[1], coords[0]);
    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
    });

    const f = results.features[i].properties;

    marker.addListener("click", (e) => {
      const d = new Date(0);
      d.setUTCMilliseconds(f.time);

      const contentString =
        '<div class="info-window-content">'+
        '<h2>'+f.place +'</h2>'+
        '<h3>Magnitude '+f.mag+'</h3><p>'+d.toString()+'</p>'+
        '<a href="'+f.url+'" target="new">View on USGS</a>'+
        '</div>';

      infoWindow.setContent(contentString);
      infoWindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
    });
  }
}

window.initMap = initMap;
window.eqfeed_callback = eqfeed_callback;
