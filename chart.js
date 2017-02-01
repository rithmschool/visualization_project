function createChart(width, height, padding) {
  var x = (width - padding.left - padding.right) / 20;
  var y = height - padding.bottom;
  var svg = d3.select("#chart")
              .append("svg")
                .attr("width", width)
                .attr("height", height)
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + x + "," + y + ")")
  
  return svg;
}


function updateChart(svg, year, padding, scale, max) {
  var barPadding = 1;
  var width = +svg.attr('width');
  var height = +svg.attr('height');
  var data = getTopCountries(d3.selectAll('.country').data(), year);
  var xScale = d3.scalePoint()
                 .domain(data.map(country => country.properties.name))
                 .range([padding.left, width - padding.right]);

  var yScale = d3.scaleLinear()
                 .domain([0, max])
                 .range([height - padding.top, padding.bottom]);
  
  var rects = svg.selectAll('rect')
                 .data(data);

  var counts = svg.selectAll('.count')
                  .data(data);

  counts.enter()
        .append("text")
        .merge(counts)
          .text(d => fatalitiesAndInjuries(d.properties.years[year]))
          .attr("class", "count")
          .attr("x", d => xScale(d.properties.name) + ((width - padding.left - padding.right) / 20))
          .attr("text-anchor", "middle")
          .attr("y", d => padding.top - padding.bottom - 5 + yScale(fatalitiesAndInjuries(d.properties.years[year])))

  counts.exit().remove();

  rects.enter()
       .append("rect")
       .merge(rects)
         .attr("x", d => xScale(d.properties.name))
         .attr("y", d => padding.top - padding.bottom + yScale(fatalitiesAndInjuries(d.properties.years[year])))
         .attr("width", (width - padding.left - padding.right ) / 10 - barPadding)
         .attr("height", d => height - padding.top - yScale(fatalitiesAndInjuries(d.properties.years[year])))
         .attr('fill', function(d) {
           var total = 0;
           if (d.properties.years) total += fatalitiesAndInjuries(d.properties.years[year]);
           return scale(total);
         });
         
  rects.exit().remove();

  svg.select(".axis")
     .call(d3.axisBottom(xScale))
     .selectAll('text')
       .attr("transform", "translate(0, 10) rotate(-30)");
}