# Web Scraping and Data Visualization

In this assignment, your goal is to use Python to scrape the web for interesting data, and then visualize that data on a web page using [D3](https://d3js.org/).

### Requirements

Here are the components your finished assignment should have:

1. A Python file which scrapes data from a web page of your choosing using [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/), and places that data in a CSV file;
2. A corresponding CSV file;
3. HTML/CSS/JavaScript files for visualizing the data in the CSV file. You can pull data from a CSV in `d3` using the `d3.csv` method (you can read more about it [here](https://github.com/d3/d3-request/blob/master/README.md#csv)).

### Example

[Here's](http://rithmschool.github.io/visualization_project) an example of a finished project, which uses data from the [Global Terrorism Database](https://www.start.umd.edu/gtd/). This example features two visualizations: one using a world map, and the other a bar chart.

### Visualization Options

Here are some ideas for sources of data. This list is by no means exhaustive, feel free to look online for other data that interests you!

- [Global Terrorism Database](https://www.start.umd.edu/gtd/)
- [Box Office Mojo](http://www.boxofficemojo.com/)
- [Billboard Top 100](http://www.billboard.com/charts/hot-100)
- [ALL THE SPORTS DATA](http://www.sports-reference.com/)
- [MLB Home Run Data](http://www.hittrackeronline.com/)
- [Historical Weather Data](https://www.wunderground.com/history/)
- [The Price is Right Stats](http://tpirstats.com/)
- [Historical Stock Price data](http://www.nasdaq.com/quotes/historical-quotes.aspx)
- [Craigslist](https://sfbay.craigslist.org/)
- [Hacker News](https://news.ycombinator.com/)

### Data Options

Here are some ideas for types of visualizations you could use. 

- **Scatterplot** - For more material on scatterplots, check out [this](https://github.com/rithmschool/intro_to_d3/) project, or our [curriculum](https://github.com/rithmschool/intermediate_javascript/blob/master/unit-02/10-intermediate-d3.md). [This](http://alignedleft.com/tutorials/d3) tutorial also provides a nice introduction, though it's for version 3 of `d3`, not version 4.
- **Bar Chart / Histogram** - Again, our [curriculum](https://github.com/rithmschool/intermediate_javascript/blob/master/unit-02/10-intermediate-d3.md) is a helpful resource here, as is the [tutorial](http://alignedleft.com/tutorials/d3) mentioned above.
- **Pie Chart** - [Here's](https://bl.ocks.org/tezzutezzu/c2653d42ffb4ecc01ffe2d6c97b2ee5e) an example.
- **Force Directed Graph** [Here's](https://bl.ocks.org/mbostock/4062045) an example.
- **Map Chart** - For this, you'll need some JSON data to draw a map. [Here's](http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f) an example of a world map; [here's](https://bl.ocks.org/mbostock/4090848) a United States map; [here's](https://bl.ocks.org/mbostock/4122298) a county-level United States map.
- For even more examples of all the awesome things you can build in `d3`, check out the examples showcased in the [docs](https://github.com/d3/d3/wiki/Gallery).