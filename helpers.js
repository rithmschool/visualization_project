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