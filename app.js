document.addEventListener('DOMContentLoaded', function() {

  var width = 600;
  var height = 375;
  var INITIAL_YEAR = 1970;
  var chartPadding = {
    top: 30,
    right: 50,
    bottom: 60,
    left: 30
  };

  d3.queue()
    .defer(d3.csv, './attacks.csv')
    .defer(d3.json, './world_countries.json')
    .await(function(error, attacks, countries) {
      if (error) console.log(error);

      var year = document.getElementById("year");
      var maxDestruction = 0;

      // format attack data for joining to countries
      var formattedAttacks = attacks.reduce(function(prev, attack) {
        var countries = getModernCountries(attack.Country);
        var year = attack.Date.split("-")[0];
        if (!Array.isArray(countries)) countries = [countries];
        countries.forEach(function(country) {
          // update fatality and injury counts for each country
          prev[country] = prev[country] || {};
          prev[country][year] = prev[country][year] || {};
          var newFatalities = +attack.Fatalities || 0;
          var newInjured = +attack.Injured || 0;
          var countryYear = prev[country][year];
          countryYear.fatalities = (countryYear.fatalities || 0 ) + newFatalities;
          countryYear.injured = (countryYear.injured || 0 ) + newInjured;
        });
        return prev;
      }, {});

      // attach attack data to country topojson data 
      // and determine maximum destruction
      countries.features.forEach(function(country) {
        var name = country.properties.name;
        country.properties.years = formattedAttacks[name];
        for (var year in country.properties.years) {
          var destruction = fatalitiesAndInjuries(country.properties.years[year]);
          if (destruction > maxDestruction) { maxDestruction = destruction; }
        }
      });

      var colorScale = d3.scaleLinear()
                         .domain([0, 0.01, 0.1, 0.5, 1].map(el => el * maxDestruction))
                         .range(['green', 'yellow', 'orange', 'red', 'black']);
      
      var mapSVG = createMap(countries.features, width, height);
      var chartSVG = createChart(width, height, chartPadding);

      updateMap(mapSVG, INITIAL_YEAR, colorScale);
      updateChart(chartSVG, INITIAL_YEAR, chartPadding, colorScale, maxDestruction);
      
      year.addEventListener('input', function(e) {
        updateMap(mapSVG, +e.target.value, colorScale);
        updateChart(chartSVG, +e.target.value, chartPadding, colorScale, maxDestruction);
      });

    });

});