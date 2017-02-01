function createMap(countryData, width, height) {
  var scale = 90;
  var x = width / 2;
  var y = height / 1.4;
  var svg =  d3.select("#map")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

  var projection = d3.geoMercator()
                     .scale(scale)
                     .translate([x, y]);

  var path = d3.geoPath().projection(projection);

  svg.append("g")
          .attr("class", "countries")
        .selectAll("path")
          .data(countryData)
        .enter().append("path")
          .attr("d", path)
          .attr("class", "country")
          .attr('id', d => d.properties.name)

  svg.append("path")
      .datum(topojson.mesh(countryData, (a, b) => a.id !== b.id ))
      .attr("class", "names")
      .attr("d", path);

  return svg;
}

function updateMap(svg, year, scale) {
  document.getElementById("year-val").innerText = year;
  svg.selectAll(".country")
     .attr('fill', function(d) {
       var total = 0;
       if (d.properties.years) total += fatalitiesAndInjuries(d.properties.years[year]);
       return scale(total);
     });
}