
    var boundaryStyle = {
      "color": "#b3d1ff",
      "weight": 1.5,
      "fillColor": "none"
    }

    var faultStyle = {
      "color": "#ffa73b",
      "weight": 1,
    }


var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  maxZoom: 16
});
/*
var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 18,
  ext: 'png'
});
*/
    var map = L.map('map', { 
        center: [44.55, -110.55],
        zoom: 9 });

     var layer = Esri_WorldGrayCanvas.addTo(map);
      //var layer = L.esri.basemapLayer('Topographic').addTo(map);


      map.addLayer(layer);

function getFill(d) {
  if (d < 1.5) return '#fffccc';
  else if (d >= 1.5 && d < 2) return '#FEF001';
  else if (d >= 2 && d < 2.5) return '#FFCE03';
  else if (d >= 2.5 && d < 3) return '#FD9A01';
  else if (d >= 3 && d < 3.5) return '#FD6104';
  else if (d >= 3.5 && d < 4) return '#FF2C05';
  else if (d >= 4) return '#af0404';

  
}
     
     var earthquakes = [];
var eqOverlay = L.d3SvgOverlay(function(sel,proj){
  
  var minLogMag = d3.min(earthquakes,function(d){return d.mag;});
  var eqUpd = sel.selectAll('circle').data(earthquakes);
  eqUpd.enter()
    .append('circle')
    .attr('r',function(d){return d.mag*1.5;})
    .attr('cx',function(d){return proj.latLngToLayerPoint(d.latLng).x;})
    .attr('cy',function(d){return proj.latLngToLayerPoint(d.latLng).y;})
    .attr('stroke','black')
    .attr('stroke-width',1)
    .attr('opacity',0.9)
    .attr('fill',function(d){ return getFill(d.mag) ;});
});

var boundaryPath = L.geoJson(boundary, {
  style: boundaryStyle
}).addTo(map);

var calderaPath = L.geoJson(caldera, {
  style: function(feature) {
    switch (feature.properties.LTYPE) {
      case 'Outer Ring Fault': return { color: "#009933", weight: 2, opacity:0.75, dashArray: '6,6' };
      case 'Inner Ring Fault': return { color: "#5f876a", weight: 2, opacity:0.75, dashArray: '6,6' };
      case 'Caldera Rim': return { color: "#e60000",  weight: 2 };
      case 'Resurgent Dome': return { color: "#009933", weight: 1.5,  dashArray: '6,6' };

    }
  }
}).addTo(map);

var faultPath = L.geoJson(faults, {
  style: faultStyle
}).addTo(map);


d3.csv("https://raw.githubusercontent.com/hannahjordanUM/Data_Vis_Repo/master/gradProject/eq_19.csv",function(data){
  earthquakes = data.map(function(d){
    d.latLng = [+d.latitude,+d.longitude];
    d.population = (d.mag == '') ? 2000 : +d.mag; //NAs
    return d;
  });

  

  eqOverlay.addTo(map);
});




  
      
