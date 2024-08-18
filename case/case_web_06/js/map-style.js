// *
// * Two maps on the same page
// * 2015 - en.marnoto.com
// *

// necessary variables
var mapLeft, mapRight;
var infoWindowLeft, infoWindowRight;

// markersData variable stores the information necessary to each marker
var markersDataLeft = [
   {
      lat: 25.0583595,
      lng: 121.5727186
   }
];

var markersDataRight = [
   {
      lat:24.1621499,
      lng: 120.6061313
   }
];

function initialize(setMap) {

   var mapOptions;
   
   if(setMap == "mapLeft") {
      mapOptions = {
         center: new google.maps.LatLng(25.0583595,121.5727186),
         zoom:13,
									minZoom: 10,
									maxZoom: 16,
         mapTypeId: 'roadmap',
									styles: [{
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#e9e9e9"
              },
              {
                "lightness": 17
              }
            ]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
                "color": "#f5f5f5"
              },
              {
                "lightness": 20
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ffffff"
              },
              {
                "lightness": 17
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#ffffff"
              },
              {
                "lightness": 29
              },
              {
                "weight": 0.2
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                "color": "#ffffff"
              },
              {
                "lightness": 18
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
                "color": "#ffffff"
              },
              {
                "lightness": 16
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                "color": "#f5f5f5"
              },
              {
                "lightness": 21
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{
                "color": "#dedede"
              },
              {
                "lightness": 21
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [{
                "visibility": "on"
              },
              {
                "color": "#ffffff"
              },
              {
                "lightness": 16
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [{
                "saturation": 36
              },
              {
                "color": "#333333"
              },
              {
                "lightness": 40
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [{
              "visibility": "off"
            }]
          },
          {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
                "color": "#f2f2f2"
              },
              {
                "lightness": 19
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#fefefe"
              },
              {
                "lightness": 20
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#fefefe"
              },
              {
                "lightness": 17
              },
              {
                "weight": 1.2
              }
            ]
          }
        ]
      };
   
      mapLeft = new google.maps.Map(document.getElementById('map-canvas-left'), mapOptions);
      
	   // a new Info Window is created
	   infoWindowLeft = new google.maps.InfoWindow();
	
	   // Event that closes the Info Window with a click on the map
	   google.maps.event.addListener(mapLeft, 'click', function() {
	      infoWindowLeft.close();
   	});
      
   } else {
      
      mapOptions = {
         center: new google.maps.LatLng(24.1621499,120.6061313),
         zoom:13,
									minZoom: 10,
									maxZoom: 16,
         mapTypeId: 'roadmap',
									styles: [{
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#e9e9e9"
              },
              {
                "lightness": 17
              }
            ]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
                "color": "#f5f5f5"
              },
              {
                "lightness": 20
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ffffff"
              },
              {
                "lightness": 17
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#ffffff"
              },
              {
                "lightness": 29
              },
              {
                "weight": 0.2
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                "color": "#ffffff"
              },
              {
                "lightness": 18
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
                "color": "#ffffff"
              },
              {
                "lightness": 16
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                "color": "#f5f5f5"
              },
              {
                "lightness": 21
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{
                "color": "#dedede"
              },
              {
                "lightness": 21
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [{
                "visibility": "on"
              },
              {
                "color": "#ffffff"
              },
              {
                "lightness": 16
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [{
                "saturation": 36
              },
              {
                "color": "#333333"
              },
              {
                "lightness": 40
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [{
              "visibility": "off"
            }]
          },
          {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
                "color": "#f2f2f2"
              },
              {
                "lightness": 19
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#fefefe"
              },
              {
                "lightness": 20
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#fefefe"
              },
              {
                "lightness": 17
              },
              {
                "weight": 1.2
              }
            ]
          }
        ]
      };
      
	   mapRight = new google.maps.Map(document.getElementById('map-canvas-right'), mapOptions);
      
	   // a new Info Window is created
	   infoWindowRight = new google.maps.InfoWindow();
	
	   // Event that closes the Info Window with a click on the map
	   google.maps.event.addListener(mapRight, 'click', function() {
	      infoWindowRight.close();
   	});
   }

   // Finally displayMarkers() function is called to begin the markers creation
   displayMarkers(setMap);
   
   // Create second map only when initialize function is called for the first time.
   // Second time setMap is equal to mapRight, so this condition returns false and it will not run  
   if(setMap == "mapLeft"){
      initialize("mapRight");   
   }
   
}
google.maps.event.addDomListener(window, 'load', function(){ initialize("mapLeft") });


// This function will iterate over markersData array
// creating markers with createMarker function
function displayMarkers(setMap){
   
   var markersData;
   var map;
   
   if(setMap == "mapLeft"){
      markersData = markersDataLeft;
      map = mapLeft;
   } else {
      markersData = markersDataRight;
      map = mapRight;
   }
   
   // this variable sets the map bounds according to markers position
   var bounds = new google.maps.LatLngBounds();
   
   // for loop traverses markersData array calling createMarker function for each marker 
   for (var i = 0; i < markersData.length; i++){

      var latlng = new google.maps.LatLng(markersData[i].lat, markersData[i].lng);
      var name = markersData[i].name;
      var address1 = markersData[i].address1;
      var address2 = markersData[i].address2;
      var postalCode = markersData[i].postalCode;

      createMarker(setMap, latlng, name, address1, address2, postalCode);

      // marker position is added to bounds variable
      bounds.extend(latlng);  
   }

   // Finally the bounds variable is used to set the map bounds
   // with fitBounds() function
   map.fitBounds(bounds);
}

// This function creates each marker and it sets their Info Window content
function createMarker(setMap, latlng, name, address1, address2, postalCode){
   
   var map;
   var infoWindow;
   
   if(setMap == "mapLeft"){
      map = mapLeft;
      infoWindow = infoWindowLeft;
   } else {
      map = mapRight;
      infoWindow = infoWindowRight;
   }
   
   var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      title: name,
						icon: 'img/favicon.png'
   });

   // This event expects a click on a marker
   // When this event is fired the Info Window content is created
   // and the Info Window is opened.
   google.maps.event.addListener(marker, 'click', function() {
      
      // Creating the content to be inserted in the infowindow
						
      /*var iwContent = '<div id="iw_container">' +
            '<div class="iw_title">' + name + '</div>' +
         '<div class="iw_content">' + address1 + '<br />' +
         address2 + '<br />' +
         postalCode + '</div></div>';*/
      
      // including content to the Info Window.
      infoWindow.setContent(iwContent);

      // opening the Info Window in the current map and at the current marker location.
      infoWindow.open(map, marker);
   });
			
}
