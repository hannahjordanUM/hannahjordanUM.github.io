

// set the dimensions and margins of the graph
var margin_scatter = {top: 50, right: 20, bottom: 60, left: 40},
    width_scatter = 450 - margin_scatter.left - margin_scatter.right,
    height_scatter = 300 - margin_scatter.top - margin_scatter.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#scatterplot")
  .append("svg")
    .attr("width", width_scatter + margin_scatter.left + margin_scatter.right)
    .attr("height", height_scatter + margin_scatter.top + margin_scatter.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_scatter.left + "," + margin_scatter.top + ")");

svg2
  .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("height", height_scatter)
    .attr("width", width_scatter)
    .style("fill", "EBEBEB")

svg2.append("text")
    .attr("x", (width_scatter / 2))             
    .attr("y", 0 - (margin_scatter.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "14px") 
    .style("text-decoration", "underline")  
    .text("County Size vs Cases per Capita");

//Read the data
d3.csv("https://raw.githubusercontent.com/hannahjordanUM/Data_Vis_Repo/master/VectorPlot/covid_case_scatter.csv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([-20, 3500])
    .range([ 0, width_scatter ]);

  svg2.append("g")
    .attr("transform", "translate(0," + height_scatter + ")")
    .call(d3.axisBottom(x).tickSize(-height_scatter).ticks(10))
    .select(".domain").remove()
  // Add Y axis
  var y = d3.scaleLinear()
    .domain( [0,18])
    .range([ height_scatter, 0 ]);
  svg2.append("g")
    .call(d3.axisLeft(y).tickSize(-width_scatter).ticks(7))
    .select(".domain").remove()

  svg2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin_scatter.left)
    .attr("x",0 - (height_scatter / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size","12px")
    .text("Percentage of Confirmed Cases/County Population");

    svg2.append("text")
    .attr("y", (width_scatter/2) + 10)
    .attr("x", width_scatter/2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size","12px")
    .text("County Population (in thousands)");

    svg2.selectAll(".tick line").attr("stroke", "white")

  
    var tooltip = d3.select("#scatterplot")
        .append("div")
        .style("opacity", 0)
        .attr("class", "d3-tip")




      // A function that change this tooltip when the user hover a point.
      // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
      var mouseover = function(d) {
        tooltip
          .style("opacity", 1)
      }

      var mousemove = function(d) {
        tooltip
          .html("Population: " + d3.format(",.2r")(d.population) + "  Percentage Cases: " + d3.format(".2f")(d.cases_per_pop) + "%")
          .style("left", (d3.mouse(this)[0]-10) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
          .style("top", (d3.mouse(this)[1]) + "px")
      }

      // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
      var mouseleave = function(d) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0)
      }


// Add dots
  svg2.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.pop_thousand); } )
      .attr("cy", function (d) { return y(d.cases_per_pop); } )
      .attr("r", 1.75)
      .style("fill", "#000080")

      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
            

})

