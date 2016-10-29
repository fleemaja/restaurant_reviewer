var restaurants; var reviews;

var nameTooltip = $('#name-tooltip');
var starTooltip = $('#star-tooltip');
var reviewTooltip = $('#review-tooltip');

$('form').submit(function(e) {
  e.preventDefault();
  var valid = true;

  if (!isStarValid()) {
    valid = false;
    starTooltip.css('opacity', 1);
  }

  if (!isNameValid()) {
    valid = false;
    nameTooltip.css('opacity', 1);
  }

  if (!isReviewValid()) {
    valid = false;
    reviewTooltip.css('opacity', 1);
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
  revHtml += "<hr><div class='review'><p><strong>" + name + "</strong>";
  revHtml += "<span class='review-date'>" + date + "</span></p>";
  revHtml += "<p>" + "<i class='fa fa-star' aria-hidden='true'></i>".repeat(rating) + "<i class='fa fa-star-o' aria-hidden='true'></i>".repeat(5 - rating) + "</p>";
  revHtml += "<p>" + review + "</p></div>";
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
  starTooltip.css('opacity', 0);
});

$('#name-input').focusout(function() {
  if (!isNameValid()) {
    nameTooltip.css('opacity', 1);
  }
});

$('#name-input').focusin(function() {
  nameTooltip.css('opacity', 0);
});

function isNameValid() {
  var name = $('#name-input').val();
  return name === "" ? false : true;
}

$('#review-input').focusout(function() {
  if (!isReviewValid()) {
    reviewTooltip.css('opacity', 1);
  }
});

$('#review-input').focusin(function() {
  reviewTooltip.css('opacity', 0);
});

function isReviewValid() {
  var review = $('#review-input').val();
  return review === "" ? false : true;
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

            var url = window.location.href;
            var urlSplit = url.split("?r=");
            var restaurantName = urlSplit[1];
            restaurantName = restaurantName.replace(/%27/g, "'").replace(/%20/g, " ");
            var foundPage = false;
            $.each(restaurants, function(key, val) {
              if (val.name === restaurantName) {
                foundPage = true;
                var infoHtml = "";
                infoHtml += "<figure>";
                infoHtml += "<img class='img-fluid' src='./assets/images/" + val.photograph + "' alt='" + val.name + "' >";
                infoHtml += "<figcaption><p>" + val.name + "</p><p><i class='fa fa-map-marker' aria-hidden='true'></i> " + val.address.split("$")[0] + "</p>";
                infoHtml += "<p><i class='fa fa-map-marker' aria-hidden='true'></i> " + val.address.split("$")[1] + "</p>";
                infoHtml += "<p><i class='fa fa-cutlery' aria-hidden='true'></i> " + val.cuisine_type + "</p><hr>";
                infoHtml += "<p><i class='fa fa-clock-o' aria-hidden='true'></i></p><table>";
                $.each(Object.keys(val.operating_hours), function(hours_key, hours_val) {
                  infoHtml += "<tr><td><strong>" + hours_val + "</strong></td><td>" + val.operating_hours[hours_val].replace(",", "<br>") + "</td></tr>";
                });
                infoHtml += "</table></figcaption></figure>";
                $('.info').html(infoHtml);
                var revHtml = "";
                $.each(reviews[restaurantName], function(rev_key, rev_val) {
                  revHtml += "<hr><div class='review'><p><strong>" + rev_val.name + "</strong>";
                  revHtml += "<span class='review-date'>" + rev_val.date + "</span></p>";
                  revHtml += "<p>" + "<i class='fa fa-star' aria-hidden='true'></i>".repeat(rev_val.rating) + "<i class='fa fa-star-o' aria-hidden='true'></i>".repeat(5 - rev_val.rating) + "</p>";
                  revHtml += "<p>" + rev_val.comments + "</p></div>";
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