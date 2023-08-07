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
}


function apiStatus () {
  $.get('http://0.0.0.0:5001/api/v1/status/', (data, textStatus) => {
    if (textStatus === 'success' && data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
}
