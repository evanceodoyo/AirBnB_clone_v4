$(document).ready(initialize);
function initialize () {
  const amenity = {};
  const state = {};
  const city = {};
  const objIds = {};

  $('.amenities .popover input').on('change', function () {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');

    if ($(this).is(':checked')) {
      amenity[amenityId] = amenityName;
    } else {
      delete amenity[amenityId];
    }
    const amenities = Object.values(amenity);
    objIds.amenities = Object.keys(amenity);
    $('.amenities h4').text(amenities.sort().join(', '));
  });

  $('.state_input').change(function () {
    const stateId = $(this).attr('data-id');
    const stateName = $(this).attr('data-name');

    if ($(this).is(':checked')) {
      state[stateId] = stateName;
    } else {
      delete state[stateId];
    }

    const states = Object.values(state);
    objIds.states = Object.keys(state);
    updateLocations(states);
  });

  $('.city_input').change(function () {
    const cityId = $(this).attr('data-id');
    const cityName = $(this).attr('data-name');

    if ($(this).is(':checked')) {
      city[cityId] = cityName;
    } else {
      delete city[cityId];
    }

    const cities = Object.values(city);
    objIds.cities = Object.keys(city);
    updateLocations(cities);
  });

  apiStatus();
  handleButtonClick(objIds);
  getPlaces({});
  toggleReviews();
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

function getPlaces (objIds) {
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(objIds),
    success: function (response) {
      $('SECTION.places').empty();

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
          '<div class="reviews">',
          '<h2>Review(s)',
          `<span class="toggle_reviews" data-id=${content.id}> show</span>`,
          '</h2>',
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

function handleButtonClick (objIds) {
  $('button').on('click', function () {
    getPlaces(objIds);
  });
}

function updateLocations (selectedLocations) {
  $('.locations h4').text(selectedLocations.sort().join(', '));
}

function fetchAndDisplayReviews (placeId) {
  $.get(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews/`, function (reviews) {
    for (const review of reviews) {
    // Fetch user details for each review
      $.get(`http://0.0.0.0:5001/api/v1/users/${review.user_id}/`, function (user) {
        const firstName = user.first_name;
        const lastName = user.last_name;

        const createdAt = new Date(review.created_at);
        const formattedDate = createdAt.toLocaleString();

        const reviewElement = `
        <ul>
          <li>
            <h3>From ${firstName} ${lastName} on ${formattedDate}</h3>
            <p>${review.text}</p>
          </li>
        </ul>
      `;

        $('.reviews').append(reviewElement);
      });
    }
  });
}

function toggleReviews () {
  $(document).on('click', '.toggle_reviews', function () {
    if ($(this).text() === ' show') {
      fetchAndDisplayReviews($(this).attr('data-id'));
      $(this).text(' hide');
    } else if ($(this).text() === ' hide') {
      $(this).text(' show');
    }
  });
}
