var restaurants; var reviews;

var nameTooltip = $('#name-tooltip');
var starTooltip = $('#star-tooltip');
var reviewTooltip = $('#review-tooltip');

function initMap(latitude, longitude) {
  var loc = {lat: latitude, lng: longitude};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: loc,
    draggable: false,
    scrollwheel: false,
    panControl: false,
    disableDefaultUI: true
  });
  var marker = new google.maps.Marker({
    position: loc,
    map: map
  });
  // disable google map links tabindex
  google.maps.event.addListener(map, "tilesloaded", function(evt){
    [].slice.apply(document.querySelectorAll('#map a')).forEach(function(item) {
        item.setAttribute('tabindex','-1');
    });

    $(this.getDiv()).find("img").each(function(i, eimg){
      if(!eimg.alt || eimg.alt ===""){
         eimg.alt = "Google Maps Image";
      }
    });
  });
}

function multiplyString(str, numTimes) {
  var multipliedStr = "";
  for (var i = 1; i <= numTimes; i++) {
    multipliedStr += str;
  }
  return multipliedStr;
}

$('form').submit(function(e) {
  e.preventDefault();
  var valid = true;

  if (!isStarValid()) {
    valid = false;
    starTooltip.css('visibility', 'visible');
  }

  if (!isNameValid()) {
    valid = false;
    nameTooltip.css('visibility', 'visible');
  }

  if (!isReviewValid()) {
    valid = false;
    reviewTooltip.css('visibility', 'visible');
  }

  if (valid) {
    addNewReview();
  }
});

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function addNewReview() {
  var name = $('#name-input').val();
  var date = getDate();
  var rating = $('#stars').val();
  var review = $('#review-input').val();

  var revHtml = "";
  revHtml += "<hr><article class='review'><p><strong>" + name + "</strong>";
  revHtml += "<span class='review-date'>" + date + "</span></p>";
  revHtml += "<p>" + multiplyString("<i class='fa fa-star' aria-hidden='true'></i>", rating) + multiplyString("<i class='fa fa-star-o' aria-hidden='true'></i>", 5 - rating);
  revHtml += "<span class='sr-only'>Rating: " + rating + " out of 5 stars</span></p>";
  revHtml += "<p>" + review + "</p></article>";
  $('.reviews').prepend(revHtml);

  $('html, body').stop(true,true).animate({
      scrollTop: $(".reviews").offset().top - 90
  }, 500);

  var newReview = {
    'name': name,
    'date': date,
    'rating': parseInt(rating),
    'comments': review
  };

  reviews[document.title].unshift(newReview);

  localStorage._restaurantReviews = JSON.stringify(reviews);

  $('#name-input').val("");
  $('#review-input').val("");
}

function getDate() {
  var d = new Date();
  var month = d.getMonth();
  var day = d.getDate();
  var year = d.getFullYear();
  return months[month] + " " + day + ", " + year;
}

function isStarValid() {
  var star = $('#stars').val();
  return star === "" ? false : true;
}

$('#stars').on('starrr:change', function(e, value){
  $('#stars').val(value);
  starTooltip.css('visibility', 'hidden');
});

$('#name-input').focusout(function() {
  if (!isNameValid()) {
    nameTooltip.css('visibility', 'visible');
  }
});

$('#name-input').focusin(function() {
  nameTooltip.css('visibility', 'hidden');
});

function isNameValid() {
  var name = $('#name-input').val();
  return name === "" ? false : true;
}

$('#review-input').focusout(function() {
  if (!isReviewValid()) {
    reviewTooltip.css('visibility', 'visible');
  }
});

$('#review-input').focusin(function() {
  reviewTooltip.css('visibility', 'hidden');
});

function isReviewValid() {
  var review = $('#review-input').val();
  return review === "" ? false : true;
}

$('#stars').on('keydown', function(e) {
  // gets current star value
  var starIndex = 0;
  $('#stars > i').each(function () {
      if ($(this).attr('aria-checked') == 'true') {
        starIndex = parseInt($(this).attr('id').split("-")[1]);
      }
  });
  // allows keyboard users to select stars with the arrow keys
  if (e.which == 39) {
    if (starIndex < 5) {
      starIndex += 1;
      $('#star-' + starIndex).click();
    }
  } else if (e.which == 37) {
    if (starIndex > 0) {
      starIndex -= 1;
      $('#star-' + starIndex).click();
    }
  }
});

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
            var url = window.location.href;
            var urlSplit = url.split("?r=");
            var restaurantName = urlSplit[1];
            restaurantName = restaurantName.replace(/%27/g, "'").replace(/%20/g, " ");
            var foundPage = false;
            $.each(restaurants, function(key, val) {
              if (val.name === restaurantName) {
                initMap(val.latlng['lat'], val.latlng['lng']);
                foundPage = true;
                var infoHtml = "";
                infoHtml += "<article class='restaurant'><h1>" + val.name + "</h1>";
                infoHtml += "<img class='img-fluid' src='./assets/images/" + val.photograph + "' alt='" + val.name + "' >";
                infoHtml += "<div class='restaurant-info'><p><i class='fa fa-map-marker' aria-hidden='true' title='Address'></i><span class='sr-only'>Address:</span> " + val.address.split("$")[0] + "</p>";
                infoHtml += "<p><i class='fa fa-map-marker' aria-hidden='true' title='Address'></i> " + val.address.split("$")[1] + "</p>";
                infoHtml += "<p><i class='fa fa-cutlery' aria-hidden='true' title='Cuisine Type'></i><span class='sr-only'>Cuisine Type:</span> " + val.cuisine_type + "</p><hr>";
                infoHtml += "<p><i class='fa fa-clock-o' aria-hidden='true' title='Business Hours'></i><span class='sr-only'>Business Hours:</span></p><table>";
                $.each(Object.keys(val.operating_hours), function(hours_key, hours_val) {
                  infoHtml += "<tr><td><strong>" + hours_val + "</strong></td><td>" + val.operating_hours[hours_val].replace(",", "<br>") + "</td></tr>";
                });
                infoHtml += "</table></div></article>";
                $('.info').prepend(infoHtml);
                var revHtml = "";
                $.each(reviews[restaurantName], function(rev_key, rev_val) {
                  revHtml += "<hr><article class='review'><p><strong>" + rev_val.name + "</strong>";
                  revHtml += "<span class='review-date'>" + rev_val.date + "</span></p>";
                  revHtml += "<p>" + multiplyString("<i class='fa fa-star' aria-hidden='true'></i>", rev_val.rating) + multiplyString("<i class='fa fa-star-o' aria-hidden='true'></i>", 5 - rev_val.rating);
                  revHtml += "<span class='sr-only'>Rating: " + rev_val.rating + " out of 5 stars</span></p>";
                  revHtml += "<p>" + rev_val.comments + "</p></article>";
                });
                $('.reviews').html(revHtml);
                document.title = restaurantName;
              }
            });
            if (!foundPage) {
              html = "404";
              document.title = "404";
              $('.container').append(html);
            }
          }
        })
      }
    });
});
