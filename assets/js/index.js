var restaurants; var reviews;

var titleToPhoto = {
  "Mission Chinese Food": "mission_chinese_v2",
  "Emily": "emily_pizza_v2",
  "Kang Ho Dong Baekjeong": "kang_ho_dong_v2",
  "Katz's Delicatessen": "katz_deli_v2",
  "Roberta's Pizza": "robertas_pizza_v2",
  "Hometown BBQ": "hometown_bbq_v2",
  "Superiority Burger": "superiority_burger_v2",
  "The Dutch": "the_dutch_v2",
  "Mu Ramen": "mu_ramen_v2",
  "Casa Enrique": "casa_enrique_v2"
};
var mapMarkers = [];

function initMap(filteredRestaurants) {
  var loc = {lat: 40.722216, lng: -73.987501};
  var map = new google.maps.Map(document.getElementById('nyc-map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  filteredRestaurants.forEach(function(restaurant) {
    var marker = new google.maps.Marker({
      position: {lat: restaurant['latlng']['lat'], lng: restaurant['latlng']['lng']},
      url: window.location.href + 'show.html?r=' + restaurant.name.replace(/'/g, "%27"),
      title: restaurant.name,
      animation: google.maps.Animation.DROP,
      map: map
    });
    mapMarkers.push(marker);
    google.maps.event.addListener(marker, 'click', function() {
        window.location.href = marker.url;
    });
  });
  // disable google map links tabindex
  google.maps.event.addListener(map, "tilesloaded", function(){
    [].slice.apply(document.querySelectorAll('#nyc-map a')).forEach(function(item) {
        item.setAttribute('tabindex','-1');
    });
  });
}

$(document).ready(function() {
  $.ajax({
    url: "https://fleemaja.github.io/restaurant_reviewer/data/restaurants.json",
    type: "GET",
    success: function(restaurantData) {
      restaurants = restaurantData;
      $.ajax({
        url: "https://fleemaja.github.io/restaurant_reviewer/data/reviews.json",
        type: "GET",
        success: function(reviewData) {
          reviews = JSON.parse(localStorage.getItem('_restaurantReviews')) || reviewData;
          fetchRestaurants();
        }
      })
    }
  });

  $('#select-cuisine-type').on('change', function() {
    fetchRestaurants();
  });

  $('#select-borough').on('change', function() {
    fetchRestaurants();
  });
});

function multiplyString(str, numTimes) {
  var multipliedStr = "";
  for (var i = 1; i <= numTimes; i++) {
    multipliedStr += str;
  }
  return multipliedStr;
}

function fetchRestaurants() {
  var cuisineType = $('#select-cuisine-type').val();
  var borough = $('#select-borough').val();
  var html = "";
  var filteredRestaurants = [];
  $.each(restaurants, function(key, val) {
    if (cuisineType === "all" || val.cuisine_type === cuisineType) {
      if (borough === "all" || val.borough === borough) {
        filteredRestaurants.push(val);
        var total = 0;
        var numReviews = reviews[val.name].length;
        $.each(reviews[val.name], function(rev_key, rev_val) {
          total += rev_val.rating;
        });
        var avgRating = Math.round(total/numReviews);
        html += "<div class='col-md-6'><article class='restaurant' id='" + val.photograph.slice(0, -4) + "'>";
        html += "<img class='img-fluid' src='./assets/images/" + val.photograph + "' alt='" + val.name + "' >";
        html += "<div class='restaurant-info'><h1><a href='./show.html?r=" + val.name.replace(/'/g, "%27") + "'>" + val.name + "</a></h1>";
        html += "<p>" + multiplyString("<i class='fa fa-star' aria-hidden='true'></i>", avgRating) + multiplyString("<i class='fa fa-star-o' aria-hidden='true'></i>", 5 - avgRating);
        html += "<span class='sr-only'>Rating: " + avgRating + " out of 5 stars</span></p>";
        html += "<p><i class='fa fa-map-marker' aria-hidden='true' title='Address'></i><span class='sr-only'>Address:</span> " + val.address.split("$")[0] + "</p>";
        html += "<p><i class='fa fa-map-marker' aria-hidden='true' title='Address'></i> " + val.address.split("$")[1] + "</p>";
        html += "<p><i class='fa fa-cutlery' aria-hidden='true' title='Cuisine Type'></i><span class='sr-only'>Cuisine Type:</span> " + val.cuisine_type + "</p>";
        html += "</div></article></div>";
      }
    }
  });
  if (html === "") {
    html = "<em>No Results</em>";
  }
  $('#restaurants').html(html);
  initMap(filteredRestaurants);
  initMapEvents();
}

function initMapEvents() {
  mapMarkers.forEach(function(marker) {
    $('#' + titleToPhoto[marker.title]).mouseenter(function() {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    });
    $('#' + titleToPhoto[marker.title]).mouseleave(function() {
        marker.setAnimation(null);
    });
  });
}
