import L from 'leaflet';

function setupRouter(map, url) {
    // L.Routing.Itinerary.hide();
    var options = { serviceUrl: url }; 
    var osrmRouter = new L.Routing.OSRMv1(options);
  
    var routerIn = L.Routing.control({
        router: osrmRouter,
        createMarker: function() { return null; },  // this disables the marker display
        lineOptions: {
            styles: [
                { color: '#004499', opacity: 0.8, weight: 5 },
                { color: '#0044bb', opacity: 1, weight: 2 }
            ],
            addWaypoints: false
        },
        formatter: new L.Routing.Formatter({ units: 'imperial' }),
        routeWhileDragging: false,
        show: false
    }).addTo(map);
  
    // This is a hack because the "show" property does not work 
    routerIn._container.style.display = "None";
    return routerIn;
  }

  function setWaypoints(router, points) {
    let waypoints = [];
    points.forEach((element) => {
        waypoints.push(L.Routing.waypoint(L.latLng(element[0], element[1])));
    });
    router.setWaypoints(waypoints);
}
  
export {setupRouter, setWaypoints};