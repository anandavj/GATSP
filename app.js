let map
let markers = []
let cityList = []
let population = []
let tempDistance = []
let matingPool = []
let val = 1
let finalResult
let populationSize = 200
let markerPopulation = 15
let generationSize = 500 //stopping condition
let mutationRate = 0.01
let eliteSize = 1
let markerCount = 0
let best = []
let hotelNearby = []
let styleMap = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ]
function initMap() {
    let option = {
        center: { lat: -8.643701, lng: 115.187480 },
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        // styles: styleMap
    }
    map = new google.maps.Map(document.getElementById('map'),option)
    map.addListener("click", (e) => {
        if(markerCount!=markerPopulation) {
            const marker = new google.maps.Marker({
                position: {lat:e.latLng.lat(),lng:e.latLng.lng()},
                map: map
            })
            markers.push(marker)
            cityList.push(new City(e.latLng.lat(), e.latLng.lng()))
            markerCount++
        } 
    })
}

function calculateGA() {
    populationSize = document.getElementById("popSize").value
    generationSize = document.getElementById("generations").value
    mutationRate = document.getElementById("mutRate").value
    geneticAlgorithm()
    showDataChart()
    // Kasi timeout 3 detik karena tidak tau kenapa async semua fungsi yang dijalanin, kalau ndak dikasi timeout nanti hotelNearby nya belum keiisi
    setTimeout(() => {
      for (let x = 0; x < hotelNearby.length; x++) {
        var marker = new google.maps.Marker({
          position: {lat:finalResult.city[hotelNearby[x]].lat,lng:finalResult.city[hotelNearby[x]].lng},
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
          },
          map: map
        });
        
      }
    }, 3000);

}

function initPopulation() {
    let tempPopulation = []
    for (let i=0; i<populationSize; i++) {
        tempPopulation.push(new Route(_.shuffle(cityList)))
    } population.push(tempPopulation)
}

function geneticAlgorithm() {
    initPopulation()
    for (let i = 0; i < generationSize; i++) {

        console.log("Generation " + i + ": " )
        tempDistance = []
        // calculate distance
        for (let j = 0; j < population[i].length; j++) {
            population[i][j].calculateDistance()
            tempDistance.push(population[i][j].distance)
        }
        // calculate & normalize fitness
        let chanceValue = []
        for (let j = 0; j < population[i].length; j++) {
            population[i][j].calculateFitness(val)
            chanceValue.push(population[i][j].fitness)
        }
        // Selection
        matingPool = []
        for (let j = 0; j < population[i].length; j++) {
            matingPool.push(chance.weighted(population[i],chanceValue))
        }
        // matingPool -> 100 route yang udah di random weight
        // Breeding
        
        let tempChild = []
        let sorted = _.slice(_.sortBy(population[i], ['distance']), [start=0], [end=eliteSize])
        for (let x = 0; x < ((population[i].length/2)); x++) {
            let tempOne = _.sample(matingPool)
            let tempTwo = _.sample(matingPool)
            let cloneOne = _.cloneDeep(tempOne)
            let cloneTwo = _.cloneDeep(tempTwo)
            let child = crossover(cloneOne,cloneTwo)
            cloneOne.city = child[0]
            cloneTwo.city = child[1]
            cloneOne.mutate(mutationRate)
            cloneTwo.mutate(mutationRate)
            tempChild.push(cloneOne,cloneTwo)
        }
        for(let x = 0; x<eliteSize; x++) {
            tempChild.pop()
        }
        for(let x=0; x<eliteSize; x++) {
            // sorted[x].mutate(mutationRate)
            tempChild.push(sorted[x])
        }
        console.log(population)
        console.log("%c The best Distance in generation " + i + ": " + _.min(tempDistance), 'background: green; color: white; display: block;')
        population.push(tempChild)
        best.push({y:_.min(tempDistance)})
    }

    var styles = [
        'background: linear-gradient(#D33106, #571402)'
        , 'border: 1px solid #3E0E02'
        , 'color: white'
        , 'display: block'
        , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
        , 'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
        , 'line-height: 40px'
        , 'text-align: center'
        , 'font-weight: bold'
    ].join(';');

    console.log("%c Best First Distance: " + best[0].y, styles)
    console.log("%c Best Last Distance: " + best[generationSize-1].y, styles)
    document.getElementById("firstDistance").textContent = best[0].y
    document.getElementById("lastDistance").textContent = best[generationSize-1].y
    document.getElementsByClassName("best")[0].style.display = "block"

    // Find the last best
    finalResult = _.find(population[generationSize-1], function(o) {
        return o.distance == _.min(tempDistance)
    })
    

    // Draw
    let coord = []
    finalResult.city.forEach(e => {
        coord.push({lat:e.lat,lng:e.lng})
    }); coord.push({lat:finalResult.city[0].lat,lng:finalResult.city[0].lng})
    
    var line= new google.maps.Polyline({
        path: coord,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    line.setMap(map);

    // Draw driving direction
    var request = {travelMode: google.maps.TravelMode.DRIVING}
    for(let x=0; x<coord.length; x++) {
        if(x==0) {
            request.origin = coord[x]
        } else {
            if(x==coord.length-1) {
                request.destination = coord[x]
            } else {
                // Kalo cuma 2 marker
                if(!request.waypoints) {
                    request.waypoints = []
                }
                // Push Marker waypoint
                request.waypoints.push({
                    location: coord[x],
                    stopover: true
                })
            }
        }
    }
    var directionsDisplay = new google.maps.DirectionsRenderer()
    var directionsService = new google.maps.DirectionsService()
    directionsDisplay.setMap(map);
    directionsService.route(request, function(result, status) {
        var total = 0
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
        }
    })

    // let random = []
    for(let x = 0; x < finalResult.city.length; x++) {
      // let a = Math.floor(Math.random() * (finalResult.city.length-1))
      // while(random.includes(a)) {
      //   a = Math.floor(Math.random() * (finalResult.city.length-1))
      // }
      // random.push(a)
      getNearbyHotels({lat:finalResult.city[x].lat,lng:finalResult.city[x].lng},x)
    }
}

function getNearbyHotels(position,idx) {
  var service = new google.maps.places.PlacesService(map);
  // Di google maps hotel/penginapan dikategorikan lodging
  // radius 300 meter dari titik
  let request = {
    location : position,
    radius : 300,
    type : [ 'lodging' ]
  }
  service.nearbySearch(request, (results, status) => {
    if(results.length > 0) {
      hotelNearby.push(idx)
    }
  })
}

function crossover(routeOne, routeTwo) {
    child = []

    // Metode Crossover buatan sendiri
    // childOne = _.cloneDeep(routeOne.city)
    // childTwo = _.cloneDeep(routeTwo.city)
    // let randomAlpha = Math.floor(Math.random() * (routeOne.city.length-2))
    // let indexChildTwo = _.findIndex(childTwo, function(o) { return (o.lat == childOne[randomAlpha].lat && o.lng == childOne[randomAlpha].lng)  })
    // let tmpOne = childOne[randomAlpha]
    // childOne[randomAlpha] = childOne[indexChildTwo]
    // childOne[indexChildTwo] = tmpOne
    // tmpOne = childTwo[indexChildTwo]
    // childTwo[indexChildTwo] = childTwo[randomAlpha]
    // childTwo[randomAlpha] = tmpOne
    // child.push(childOne,childTwo)
    // return child

    // Order Crossover
    let indexRouteOne = []
    let indexRouteTwo = []
    // Ubah real ke permutasi (index)
    for(let i=0; i<cityList.length; i++) {
        // cari index tiap city yang ada pada routeOne di list cityList, lalu push indexnya
        indexRouteOne.push(_.findIndex(cityList, function(o) { return (o.lat == routeOne.city[i].lat && o.lng == routeOne.city[i].lng) }))
        // cari index tiap city yang ada pada routeTwo di list cityList, lalu push indexnya
        indexRouteTwo.push(_.findIndex(cityList, function(o) { return (o.lat == routeTwo.city[i].lat && o.lng == routeTwo.city[i].lng) }))
    }
    // ambil titik acak yang dijadikan subset
    let geneA = Math.floor(Math.random() * (routeOne.city.length-1))
    let geneB = Math.floor(Math.random() * (routeOne.city.length-1))
    let startGene = Math.min(geneA,geneB)
    let endGene = Math.max(geneA,geneB)
    let subOne = []
    let subTwo = []
    for (let i=startGene; i<=endGene; i++) {
        subOne.push(indexRouteOne[i])
        subTwo.push(indexRouteTwo[i])
    }
    // order crossover
    let tempOne = order(indexRouteOne,indexRouteTwo,subOne.join(' '))
    let tempTwo = order(indexRouteTwo,indexRouteOne,subTwo.join(' '))
    let childA = []
    let childB = []
    // buat index tadi ke bentuk real (lat lng)
    for(let i=0; i<cityList.length; i++) {
        childA.push(cityList[tempOne[i]])
        childB.push(cityList[tempTwo[i]])
    }
    child.push(childA,childB)
    return child
}

function order(p1, p2, sub) {
    var j = 0;
    return p1.map(i => {
        if (sub.includes(i)) {
            return i;
        }
        while (sub.includes(p2[j])) ++j;
        return p2[j++];
    });
}

function showDataChart() {
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Best Distance over generations"
        },
        data: [{        
            type: "line",
              indexLabelFontSize: 16,
            dataPoints: best
        }]
    });
    chart.render();
}