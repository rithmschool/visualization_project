document.addEventListener('DOMContentLoaded', function() {

  var width = 600;
  var height = 375;
  var mapSVG =  d3.select("#map")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);
  var chartPadding = {
    top: 30,
    right: 50,
    bottom: 60,
    left: 30
  };
  var chartSVG = d3.select("#chart")
                   .append("svg")
                   .attr("width", width)
                   .attr("height", height);
  chartSVG.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + ((width - chartPadding.left - chartPadding.right) / 20) + "," + (height - chartPadding.bottom) + ")")
  var colorScale = d3.scaleLinear()
                     .domain([0, 0.01, 0.1, 0.5, 1])
                     .range(['green', 'yellow', 'orange', 'red', 'black']);
  var yearVal = document.getElementById("year-val");
  var year = document.getElementById("year");
  var maxDestruction = 0;
  year.addEventListener('input', function(e) {
    updateMap(mapSVG, +e.target.value, maxDestruction);
    updateChart(chartSVG, +e.target.value);
  });
  var INITIAL_YEAR = 1970;
  var barPadding = 1;

  d3.queue()
    .defer(d3.csv, '/attacks.csv')
    .defer(d3.json, '/world_countries.json')
    .await(function(error, attacks, countries) {

      var formattedAttacks = attacks.reduce(function(prev, attack) {
        var countries = getModernCountries(attack.Country);
        var year = attack.Date.split("-")[0];
        if (!Array.isArray(countries)) countries = [countries];
        countries.forEach(function(country) {
          var curCountry = prev[country];
          if (curCountry) {
            var countryYear = curCountry[year];
            if (countryYear) {
              countryYear.fatalities += +attack.Fatalities || 0;
              countryYear.injured += +attack.Injured || 0;
            } else {
              curCountry[year] = {
                fatalities: +attack.Fatalities || 0,
                injured: +attack.Injured || 0
              }
            }
          } else {
            prev[country] = {};
            prev[country][year] = {
              fatalities: +attack.Fatalities || 0,
              injured: +attack.Injured || 0
            }
          }
        });
        return prev;
      }, {});

      countries.features.forEach(function(country) {
        var name = country.properties.name;
        country.properties.years = formattedAttacks[name];
        for (var year in country.properties.years) {
          var obj = country.properties.years[year];
          if (obj.fatalities + obj.injured > maxDestruction) {
            maxDestruction = obj.fatalities + obj.injured;
          }
        }
      });

      createMap(mapSVG, 90, width / 2, height / 1.4, countries.features);
      updateMap(mapSVG, INITIAL_YEAR, maxDestruction);
      updateChart(chartSVG, INITIAL_YEAR)
    });

    function updateMap(svg, year, scaleFactor) {
      yearVal.innerText = year;
      svg.selectAll(".country")
         .attr('fill', function(d) {
           var total = 0;
           if (d.properties.years) total += fatalitiesAndInjuries(d.properties.years[year]);
           return colorScale(total / scaleFactor);
         });
    }

    function createMap(svg, scale, x, y, countryData) {
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
              .attr('id', d=>d.properties.name)

      svg.append("path")
          .datum(topojson.mesh(countryData, (a, b) => a.id !== b.id ))
          .attr("class", "names")
          .attr("d", path);
    }

    function updateChart(svg, year) {
      var data = getTopCountries(d3.selectAll('.country').data(), year);
      var xScale = d3.scalePoint()
                     .domain(data.map(country => country.properties.name))
                     .range([chartPadding.left, width - chartPadding.right])
      var yScale = d3.scaleLinear()
                     .domain([0, maxDestruction])
                     .range([height - chartPadding.top, chartPadding.bottom])
      
      var rects = svg.selectAll('rect')
                     .data(data);

      var counts = svg.selectAll('.count')
                      .data(data);

      counts.enter()
            .append("text")
            .merge(counts)
              .text(d => fatalitiesAndInjuries(d.properties.years[year]))
              .attr("class", "count")
              .attr("x", d => xScale(d.properties.name) + ((width - chartPadding.left - chartPadding.right) / 20))
              .attr("text-anchor", "middle")
              .attr("y", d => chartPadding.top - chartPadding.bottom - 5 + yScale(fatalitiesAndInjuries(d.properties.years[year])))

      counts.exit().remove();

      rects.enter()
           .append("rect")
           .merge(rects)
             .attr("x", d => xScale(d.properties.name))
             .attr("y", d => chartPadding.top - chartPadding.bottom + yScale(fatalitiesAndInjuries(d.properties.years[year])))
             .attr("width", (width - chartPadding.left - chartPadding.right ) / 10 - barPadding)
             .attr("height", d => height - chartPadding.top - yScale(fatalitiesAndInjuries(d.properties.years[year])))
             .attr('fill', function(d) {
               var total = 0;
               if (d.properties.years) total += fatalitiesAndInjuries(d.properties.years[year]);
               return colorScale(total / maxDestruction);
             });
      rects.exit().remove();

      svg.select(".axis")
         .call(d3.axisBottom(xScale))
         .selectAll('text')
           .attr("transform", "translate(0, 10) rotate(-30)")
    }

    function getTopCountries(data, year) {
      return data.filter(function(ctry) {
        var years = ctry.properties.years;
        return years && years[year];
      }).sort(function(ctry1, ctry2) {
        var ctry1Obj = ctry1.properties.years[year];
        var ctry2Obj = ctry2.properties.years[year];
        return fatalitiesAndInjuries(ctry2Obj) - fatalitiesAndInjuries(ctry1Obj);
      }).slice(0,10);
    }

    function fatalitiesAndInjuries(obj) {
      if (!obj) return 0;
      return (obj.fatalities + obj.injured) || 0;
    }

    function getModernCountries(name) {
      var modernNames = {
        "Serbia-Montenegro": "Serbia",
        "Rhodesia": "Zimbabwe",
        "West Germany (FRG)": "Germany",
        "East Germany (GDR)": "Germany",
        "Yugoslavia": [
          "Bosnia-Herzegovina", 
          "Croatia", 
          "Kosovo", 
          "Macedonia", 
          "Montenegro", 
          "Serbia", 
          "Slovenia" 
        ],
        "Soviet Union": [
          "Russia", 
          "Ukraine", 
          "Belarus", 
          "Armenia", 
          "Azerbaijan", 
          "Estonia", 
          "Georgia", 
          "Kazakhstan", 
          "Kyrgyzstan", 
          "Latvia", 
          "Lithuania", 
          "Moldova", 
          "Tajikistan", 
          "Turkmenistan", 
          "Uzbekistan"
        ]
      }
      return modernNames[name] || name;
    }

});

// 
