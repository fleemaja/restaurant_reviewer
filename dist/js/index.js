function initMap(e){var a={lat:40.722216,lng:-73.987501},t=new google.maps.Map(document.getElementById("nyc-map"),{zoom:12,center:a,scrollwheel:!1});e.forEach(function(e){var a=new google.maps.Marker({position:{lat:e.latlng.lat,lng:e.latlng.lng},url:window.location.href+"show.html?r="+e.name.replace(/'/g,"%27"),title:e.name,animation:google.maps.Animation.DROP,map:t});mapMarkers.push(a),google.maps.event.addListener(a,"click",function(){window.location.href=a.url})}),google.maps.event.addListener(t,"tilesloaded",function(){[].slice.apply(document.querySelectorAll("#nyc-map a")).forEach(function(e){e.setAttribute("tabindex","-1")})})}function multiplyString(e,a){for(var t="",n=1;n<=a;n++)t+=e;return t}function fetchRestaurants(){var e=$("#select-cuisine-type").val(),a=$("#select-borough").val(),t="",n=[];$.each(restaurants,function(s,i){if(!("all"!==e&&i.cuisine_type!==e||"all"!==a&&i.borough!==a)){n.push(i);var r=0,o=reviews[i.name].length;$.each(reviews[i.name],function(e,a){r+=a.rating});var l=Math.round(r/o);t+="<div class='col-md-6'><article class='restaurant' id='"+i.photograph.slice(0,-4)+"'>",t+="<img class='img-fluid' src='./assets/images/"+i.photograph+"' alt='"+i.name+"' >",t+="<div class='restaurant-info'><h1><a href='./show.html?r="+i.name.replace(/'/g,"%27")+"'>"+i.name+"</a></h1>",t+="<p>"+multiplyString("<i class='fa fa-star' aria-hidden='true'></i>",l)+multiplyString("<i class='fa fa-star-o' aria-hidden='true'></i>",5-l),t+="<span class='sr-only'>Rating: "+l+" out of 5 stars</span></p>",t+="<p><i class='fa fa-map-marker' aria-hidden='true' title='Address'></i><span class='sr-only'>Address:</span> "+i.address.split("$")[0]+"</p>",t+="<p><i class='fa fa-map-marker' aria-hidden='true' title='Address'></i> "+i.address.split("$")[1]+"</p>",t+="<p><i class='fa fa-cutlery' aria-hidden='true' title='Cuisine Type'></i><span class='sr-only'>Cuisine Type:</span> "+i.cuisine_type+"</p>",t+="</div></article></div>"}}),""===t&&(t="<em>No Results</em>"),$("#restaurants").html(t),initMap(n),initMapEvents()}function initMapEvents(){mapMarkers.forEach(function(e){$("#"+titleToPhoto[e.title]).mouseenter(function(){e.setAnimation(google.maps.Animation.BOUNCE)}),$("#"+titleToPhoto[e.title]).mouseleave(function(){e.setAnimation(null)})})}var restaurants,reviews,titleToPhoto={"Mission Chinese Food":"mission_chinese_v2",Emily:"emily_pizza_v2","Kang Ho Dong Baekjeong":"kang_ho_dong_v2","Katz's Delicatessen":"katz_deli_v2","Roberta's Pizza":"robertas_pizza_v2","Hometown BBQ":"hometown_bbq_v2","Superiority Burger":"superiority_burger_v2","The Dutch":"the_dutch_v2","Mu Ramen":"mu_ramen_v2","Casa Enrique":"casa_enrique_v2"},mapMarkers=[];$(document).ready(function(){$.ajax({url:"https://fleemaja.github.io/restaurant_reviewer/data/restaurants.json",type:"GET",success:function(e){restaurants=e,$.ajax({url:"https://fleemaja.github.io/restaurant_reviewer/data/reviews.json",type:"GET",success:function(e){reviews=JSON.parse(localStorage.getItem("_restaurantReviews"))||e,fetchRestaurants()}})}}),$("#select-cuisine-type").on("change",function(){fetchRestaurants()}),$("#select-borough").on("change",function(){fetchRestaurants()})});