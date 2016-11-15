function initMap(a){var e={lat:40.722216,lng:-73.987501},t=new google.maps.Map(document.getElementById("nyc-map"),{zoom:12,center:e,scrollwheel:!1});a.forEach(function(a){var e=new google.maps.Marker({position:{lat:a.latlng.lat,lng:a.latlng.lng},url:window.location.href+"show.html?r="+a.name.replace(/'/g,"%27"),title:a.name,map:t});google.maps.event.addListener(e,"click",function(){window.location.href=e.url})}),google.maps.event.addListener(t,"tilesloaded",function(){[].slice.apply(document.querySelectorAll("#nyc-map a")).forEach(function(a){a.setAttribute("tabindex","-1")})})}function multiplyString(a,e){for(var t="",s=1;s<=e;s++)t+=a;return t}function fetchRestaurants(){var a=$("#select-cuisine-type").val(),e=$("#select-borough").val(),t="",s=[];$.each(restaurants,function(n,r){if(!("all"!==a&&r.cuisine_type!==a||"all"!==e&&r.borough!==e)){s.push(r);var i=0,l=reviews[r.name].length;$.each(reviews[r.name],function(a,e){i+=e.rating});var c=Math.round(i/l);t+="<div class='col-md-6'><article class='restaurant'>",t+="<img class='img-fluid' src='./assets/images/"+r.photograph+"' alt='' >",t+="<div class='restaurant-info'><h1><a href='./show.html?r="+r.name.replace(/'/g,"%27")+"'>"+r.name+"</a></h1>",t+="<p>"+multiplyString("<i class='fa fa-star' aria-hidden='true'></i>",c)+multiplyString("<i class='fa fa-star-o' aria-hidden='true'></i>",5-c),t+="<span class='sr-only'>Rating: "+c+" out of 5 stars</span></p>",t+="<p><i class='fa fa-map-marker' aria-hidden='true' title='Address'></i><span class='sr-only'>Address:</span> "+r.address.split("$")[0]+"</p>",t+="<p><i class='fa fa-map-marker' aria-hidden='true' title='Address'></i> "+r.address.split("$")[1]+"</p>",t+="<p><i class='fa fa-cutlery' aria-hidden='true' title='Cuisine Type'></i><span class='sr-only'>Cuisine Type:</span> "+r.cuisine_type+"</p>",t+="</div></article></div>"}}),""===t&&(t="<em>No Results</em>"),$("#restaurants").html(t),initMap(s)}var restaurants,reviews;$(document).ready(function(){$.ajax({url:"https://fleemaja.github.io/restaurant_reviewer/data/restaurants.json",type:"GET",success:function(a){restaurants=a,$.ajax({url:"https://fleemaja.github.io/restaurant_reviewer/data/reviews.json",type:"GET",success:function(a){reviews=JSON.parse(localStorage.getItem("_restaurantReviews"))||a,fetchRestaurants()}})}}),$("#select-cuisine-type").on("change",function(){fetchRestaurants()}),$("#select-borough").on("change",function(){fetchRestaurants()})});