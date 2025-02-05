$(document).ready(initialize);
function initialize () {
  const amenity = {};
  $('.amenities .popover input').on('change', function () {
    if ($(this).is(':checked')) {
      amenity[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenity[$(this).attr('data-id')];
    }
    const amenities = Object.values(amenity);
    $('.amenities h4').text(amenities.sort().join(', '));
  });
  apiStatus();
  getPlaces();
}

function apiStatus () {
  $.get('http://0.0.0.0:5001/api/v1/status/', (data, textStatus) => {
    if (textStatus === 'success' && data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
}

function getPlaces () {
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({}),
    success: function (response) {
      for (const content of response) {
        const data = [
          '<article>',
          '<div class="title_box">',
          `<h2>${content.name}</h2>`,
          `<div class="price_by_night">$${content.price_by_night}</div>`,
          '</div>',
          '<div class="information">',
          `<div class="max_guest">${content.max_guest} Guest(s)</div>`,
          `<div class="number_rooms">${content.number_rooms} Bedroom(s)</div>`,
          `<div class="number_bathrooms">${content.number_bathrooms} Bathroom(s)</div>`,
          '</div>',
          '<div class="description">',
          `${content.description}`,
          '</div>',
          '</article>'
        ];
        $('SECTION.places').append(data.join(''));
      }
    },
    error: function (error) {
      console.log(error);
    }
  });
}
