$(document).ready(initialize);

const selectedStates = {};
const selectedCities = {};

function initialize () {
  const amenity = {};
  $('.amenities .popover input').change(function () {
    if ($(this).is(':checked')) {
      amenity[$(this).attr('data-name')] = $(this).attr('data-id');
    } else if ($(this).is(':not(:checked)')) {
      delete amenity[$(this).attr('data-name')];
    }
    const amenities = Object.keys(amenity);
    $('.amenities h4').text(amenities.sort().join(', '));
  });

  $('.state_input').change(function () {
    const stateId = $(this).attr('data-id');
    const stateName = $(this).attr('data-name');

    if ($(this).is(':checked')) {
      selectedStates[stateId] = stateName;
    } else {
      delete selectedStates[stateId];
    }

    updateLocations();
  });

  $('.city_input').change(function () {
    const cityId = $(this).attr('data-id');
    const cityName = $(this).attr('data-name');

    if ($(this).is(':checked')) {
      selectedCities[cityId] = cityName;
    } else {
      delete selectedCities[cityId];
    }

    updateLocations();
  });
  apiStatus();
  getPlaceAmenity();
}

$('#toggle_reviews').click(function () {
    const reviewsSection = $('.reviews');
    const toggleSpan = $('#toggle_reviews');

    if (toggleSpan.text() === 'show') {
      // Fetch and display reviews
      fetchReviews().then(function (reviews) {
        displayReviews(reviews);
        toggleSpan.text('hide');
      });
    } else {
      // Hide reviews
      reviewsSection.empty();
      toggleSpan.text('show');
    }
  });

function apiStatus () {
  $.get('http://0.0.0.0:5001/api/v1/status/', (data, textStatus) => {
    if (textStatus === 'success' && data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
}

function getPlaceAmenity () {
  $.post({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ amenities: Object.values(amenity) }),
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

function updateLocations () {
  const selectedLocations = [...Object.values(selectedStates), ...Object.values(selectedCities)];
  $('.locations h4').text(selectedLocations.sort().join(', '));
}

function fetchReviews() {
    // Implement fetch reviews
}

function displayReviews (reviews) {
    // display code
}