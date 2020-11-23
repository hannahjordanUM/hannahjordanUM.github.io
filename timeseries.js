// set the dimensions and margins of the graph
var marginT = {top: 30, right: 30, bottom: 10, left: 50},
    widthT = 600 - marginT.left - marginT.right,
    heightT = 300 - marginT.top - marginT.bottom;
// append the svg object to the body of the page
var svgT = d3.select("#timeseries")
  .append("svg")
    .attr("width", widthT + marginT.left + marginT.right)
    .attr("height", heightT + marginT.top + marginT.bottom)
  .append("g")
    .attr("transform",
          "translate(" + marginT.left + "," + marginT.top + ")");


svgT
  .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("height", heightT)
    .attr("width", widthT)
    .style("fill", "EBEBEB")

 svgT.append("text")
    .attr("x", (widthT / 2))             
    .attr("y", 0 - (marginT.top / 2) + 10)
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "bold")  
    .text("Total Number of Earthquakes (Magnitude 2.5 or greater) Per Year");
 

//Read the data
d3.csv("https://raw.githubusercontent.com/hannahjordanUM/Data_Vis_Repo/master/gradProject/eq_by_year.csv",
  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.year), value : d.num }
  },
  // Now I can use this dataset:
  function(data) {
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, widthT ]);
    svgT.append("g")
      .attr("transform", "translate(0," + heightT + ")")
      .call(d3.axisBottom(x).tickSize(-heightT))
      .select(".domain").remove();

    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0, 80])
      .range([ heightT, 0 ]);
    svgT.append("g")
      .call(d3.axisLeft(y).tickSize(-widthT))
      .select(".domain").remove();


          svgT.selectAll(".tick line").attr("stroke", "white")



    var Tooltip = d3.select("#timeseries")
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
          .html("Year: " + d3.timeFormat("%Y")(d.date) + "<br>" + " Number of earthquakes (M > 2.4): " + (d.value))
          .style("left", (d3.mouse(this)[0]+50) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
      }
      var mouseleave = function(d) {
        Tooltip
          .style("opacity", 0)
      }


    // Add the line
    svgT.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#7d94d1")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )
    // Add the points
    svgT
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.date) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 3)
        .attr("stroke","white")
        .attr("stroke-width",0.5)
        .attr("fill", "#7d94d1")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

      svgT.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - marginT.left)
      .attr("x",0 - (heightT / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","12px")
      .text("Number of Earthquakes");

  svgT.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - marginT.left + 15)
      .attr("x",0 - (heightT / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","10px")
      .text("(magnitude 2.5 or greater)");



});


