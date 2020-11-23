// set the dimensions and margins of the graph

var margin = {top: 30, right: 30, bottom: 10, left: 60},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
// append the svg object to the body of the page
var svg2 = d3.select("#scatterplot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

svg2
  .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("height", height)
    .attr("width", width)
    .style("fill", "EBEBEB")

 svg2.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2) + 10)
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "bold")  
    .text("Yearly Earthquakes (magnitude 2.5 or greater)");
 

//Read the data
d3.csv("https://raw.githubusercontent.com/hannahjordanUM/Data_Vis_Repo/master/gradProject/earthquakes_no_extras.csv",
  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.date), magnitude : d.magnitude }
  },
  // Now I can use this dataset:
  function(data) {

  	var y = d3.scaleLinear()
      .domain( [2.4, 7.0])
      .range([ height, 0 ]);
    svg2.append("g")
      .call(d3.axisLeft(y).tickSize(-width))
      .select(".domain").remove()

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(-height))
      .select(".domain").remove();
    // Add Y axis

     svg2.selectAll(".tick line").attr("stroke", "white")



    var Tooltip = d3.select("#scatterplot")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("width", "300px")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function(d) {
        Tooltip
          .style("opacity", 1)
      }
      var mousemove = function(d) {
        Tooltip
          .html("Date: " + d3.timeFormat("%m-%d-%Y")(d.date) + "<br>" + " Magnitude: " + (d.magnitude))
          .style("left", (d3.mouse(this)[0]+50) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
      }
      var mouseleave = function(d) {
        Tooltip
          .style("opacity", 0)
      }

    // Add the line

    // Add the points
    svg2
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.date) } )
        .attr("cy", function(d) { return y(d.magnitude) } )
        .attr("r", 3)
        .attr("stroke","white")
        .attr("stroke-width",0.5)
        .attr("opacity",0.75)
        .attr("fill", "#7d94d1")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

     svg2.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","12px")
      .text("Magnitude (Scale from 0-10");


      

})
