let map
let markers = []
let waypoints = [
    {lat:-7.047443, lng:110.419593},
    {lat:-7.048061, lng:110.422382},
    {lat:-7.049285, lng:110.420687}
]
let center = {
    lat: -7.047821,
    lng: 110.418219
}

function initMap() {
    // Init maps
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
    })
    var directionsDisplay = new google.maps.DirectionsRenderer()
    var directionsService = new google.maps.DirectionsService()
    directionsDisplay.setMap(map);
    // add marker on click
    map.addListener("click", (e) => {
        setMapOnAll(null)
        markers = []
        const marker = new google.maps.Marker({
            position: {lat:e.latLng.lat(),lng:e.latLng.lng()},
            map: map
        })
        markers.push(marker)
        for(let i=0; i<waypoints.length; i++) {
            markers.push(
                new google.maps.Marker({
                    position: {lat:waypoints[i].lat,lng:waypoints[i].lng},
                    map: map
                })
            )
        }
        markers.push(markers[0])
        var request = {travelMode: google.maps.TravelMode.DRIVING}

        for(let i=0; i<markers.length; i++) {
            // Marker A
            if(i == 0) {
                request.origin = markers[i].getPosition()
            } else {
                // Destination
                if(i == markers.length -1) {
                    request.destination = markers[i].getPosition()
                } else {
                    // Kalo cuma 2 marker
                    if(!request.waypoints) {
                        request.waypoints = []
                    }
                    // Push Marker waypoint
                    request.waypoints.push({
                        location: markers[i].getPosition(),
                        stopover: true
                    })
                }
            }
        }

        directionsService.route(request, function(result, status) {
            var total = 0
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(result);
                for(let i=0; i<result.routes[0].legs.length; i++) {
                    console.log("Route "+ i +": "+ result.routes[0].legs[i].distance.value)
                    total += result.routes[0].legs[i].distance.value
                }
                console.log("Total Distance: " + total)
            }
        })

    })

    // remove marker on right click
    map.addListener("rightclick", (e) => {
        setMapOnAll(null)
        markers = []
    })

    
}

function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
}

function removeElement(id,number) {
    var x = document.getElementById(id)
    for(let i=0; i<6; i++) {
        if(i!=number) {
            s
        }
    }
}