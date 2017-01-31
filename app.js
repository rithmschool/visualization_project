document.addEventListener('DOMContentLoaded', function() {

  var mapWidth = 600;
  var mapHeight = 375;
  var mapSVG =  d3.select("#map")
                  .append("svg")
                  .attr("width", mapWidth)
                  .attr("height", mapHeight);
  var colorScale = d3.scaleLinear()
                     .domain([0, 0.01, 0.1, 0.5, 1])
                     .range(['green', 'yellow', 'orange', 'red', 'black']);
  var yearVal = document.getElementById("year-val");
  var year = document.getElementById("year");
  var maxDestruction = 0;
  year.addEventListener('input', function(e) {
    updateMap(mapSVG, +e.target.value, maxDestruction);
  });

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
      // debugger;
      createMap(mapSVG, 90, mapWidth / 2, mapHeight / 1.4, countries.features);
      updateMap(mapSVG, 1970, maxDestruction);
    });

    function updateMap(svg, year, scaleFactor) {
      yearVal.innerText = year;
      svg.selectAll(".country")
         .attr('fill', function(d) {
           var total = 0;
           if (d.properties.years) { 
             for (var key in d.properties.years[year]) {
               total += d.properties.years[year][key];
             }
           }
           if (total > 0) {
             console.log(d.properties.name, total)
           }
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
          .datum(topojson.mesh(countryData, function(a, b) { return a.id !== b.id; }))
          .attr("class", "names")
          .attr("d", path);
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
