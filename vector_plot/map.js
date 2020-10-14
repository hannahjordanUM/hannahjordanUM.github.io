
function load() {

var width = 950;
var height = 650;



var svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var Perc_Infected = d3.map();
var State = d3.map();
var County = d3.map();
var Cases = d3.map();
var Population = d3.map();
var path = d3.geoPath();
var lowColor = 'rgb(245, 245, 255)'; // teal hued
//var highColor = '#004d4d';
var highColor = '#000080'; // purple

/*
var color = d3.scaleQuantize([2, 18], 
      d3.schemeOranges[9])
*/
var color = d3.scaleLinear().domain([0,16]).range([lowColor, highColor])

var g = svg.append("g");

    // add a legend
    var w = 20, h = 200;

    svg.append("text")
        .attr("x",750)             
        .attr("y",40)
        .attr("font-family", "sans-serif")
        .attr("text-anchor","middle")
        .style("font-size", "10px") 
        .text("Percentage of Confirmed Cases/County Population");
/*
    var key = d3.select("svg")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("class", "legend");
*/
    var legend = svg.append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", highColor)
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", lowColor)
      .attr("stop-opacity", 1);

  

    svg.append("rect")
      .attr("width", w )
      .attr("height", h+1)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(850,50) rotate(90)");


    var yScale = d3.scaleLinear()
      .range([h, 0])
      .domain([0, 16]);

    const ticksAmount = 2;
    const tickStep = (16 - 0) / (ticksAmount);
    const step = Math.ceil(tickStep);
    var yAxis = d3.axisRight(yScale)
        .ticks(ticksAmount)
        .tickValues(d3.range(0, 16 + step, step));


    //var yAxis = d3.axisRight(y).tickValues(d3.range(0, 0 + 8, 16));


    svg.append("g")
      .attr("transform", "translate(850,70) rotate(90)")
      .call(yAxis)
        .selectAll("text")
        .style("text-anchor","end")
        .attr("dx","-.6em")
        .attr("dy","1.5em")
        .attr("transform","rotate(-90)");


var promises = [
  d3.json("https://raw.githubusercontent.com/hannahjordanUM/Data_Vis_Repo/master/VectorPlot/counties-albers-10m.json"),
  d3.csv("https://raw.githubusercontent.com/hannahjordanUM/Data_Vis_Repo/master/VectorPlot/covid_confirmed_usafacts_updated.csv", function(d) {
        Perc_Infected.set(d.countyFIPS,d.cases_per_pop); 
        State.set(d.countyFIPS,d.State);
        County.set(d.countyFIPS,d.County_Name);
        Cases.set(d.countyFIPS,d.num_cases);
        Population.set(d.countyFIPS,d.population);
    }),

]


Promise.all(promises).then(ready)

function ready([us]) {


  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("fill", function(d) { 
        return color(d.cases_per_pop = Perc_Infected.get(d.id)); })
      .attr("d", path)
      .on('mouseover', tip.show)
       .on('mouseout', tip.hide);




  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);
}

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([140, 140])
  .html(function(d) {
   
    return "<div style='opacity:0.8;font-family:monospace;padding:8px;;color:white'>"+
            "<b>" + County.get(d.id) + ", " + State.get(d.id) + "</b><br/><br/>" + 
            "Percentage of Population Cases: " + d3.format("0.2f")(Perc_Infected.get(d.id)) + "%<br/>" + 
            "Number of Cases: " + Cases.get(d.id) + "<br/>" + 
            "County Population: " + Population.get(d.id) 

            "</div>";
  })
  g.call(tip);


}


  

