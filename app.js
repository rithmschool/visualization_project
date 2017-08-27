document.addEventListener("DOMContentLoaded", function(){
  // access and load data from the CSV file
  d3.csv("AdolescentFertilityRate_BirthsPer1000_ages15-19.csv", function(row) {
    return {
      country: row["Country or Area"],
      year: row["Year"],
      birthsPerThousand: +row["Value"]
    }
  }, function(error, data) {
    if (error) throw error;

    // make sure data is accessed properly from csv
    console.log(data);

    // var xScale = d3.scaleLinear()
    //                .domain(d3.extent(birthData2011, d => d.lifeExpectancy))
    //                .range([padding, width - padding]);

    // var yScale = d3.scaleLinear()
    //                .domain(d3.extent(birthData2011, d => d.population / d.area))
    //                .range([height - padding, padding]);

    // var xAxis = d3.axisBottom(xScale);
    // var yAxis = d3.axisLeft(yScale);

    var svg = d3.select("svg");
    var width = 960;
    var height = 600;
    var padding = 50;

    // grabbing all unique countries for the dropdown list
    var countries = new Set(data.map(function(val) {
      return val.country;
    }));

    // convert countries back to arr because d3 won't work with a set
    countries = [...countries];
    console.log(countries);

    var dropdown = d3.select(".country-list");
    dropdown
      .selectAll("option")
      .data(countries)
      .enter()
      .append("option")
        .text(function(d) { 
          return d;
        })
        .attr("value", function(d) {
          return d;
        });

    // need to know which country we are selecting
    dropdown
      .on("change", renderDataForCountry);

    function renderDataForCountry() {
      var selectedCountry = d3.select("select").property("value");
      var dataForSelectedCountry = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].country === selectedCountry) {
          dataForSelectedCountry.push(data[i]);
        }
      }

      console.log("data for selected country is\n");
      console.log(dataForSelectedCountry);
      var xScale = d3.scaleLinear()
                    .domain(d3.extent(dataForSelectedCountry, d => d.year))
                    .range([padding, width - padding]);

      var yScale = d3.scaleLinear()
                     .domain(d3.extent(dataForSelectedCountry, d => d.birthsPerThousand))
                     .range([height - padding, padding]);
      var xAxis = d3.axisBottom(xScale);
      var yAxis = d3.axisLeft(yScale);

      svg
        .selectAll("rect")
        .data(dataForSelectedCountry)
        .enter()
        .append("rect")
        .attr("x", function(d) { return xScale(d.year); })
        .attr("width", 10)
        // .attr("y", dataForSelectedCountry.birthsPerThousand)
        .attr("y", function(d) {return yScale(d.birthsPerThousand); })
        .attr("height", function(d) {return height-yScale(d.birthsPerThousand)})
        .attr("fill", "red");

      // // go back into the data and get necessary information
      // // bind to things
      console.log(selectedCountry);
    }
  }); // end second callback
}); // end DOMload