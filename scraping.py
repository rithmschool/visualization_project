from bs4 import BeautifulSoup
import requests
import csv

url = "https://www.start.umd.edu/gtd/search/Results.aspx"
payload = {
  'expanded': 'no', 
  'search': 'attack',
  'ob': 'GTDID',
  'od': 'desc',
  'page': 1,
  'count': 1000
}

def get_table(url, payload):
  raw_html = requests.get(url, params=payload).text
  soup = BeautifulSoup(raw_html, "html.parser")
  return soup.find(id="results-table")

with open('attacks.csv', 'a') as csvfile:
  writer = csv.writer(csvfile)
  writer.writerow([
        "Date", 
        "Country", 
        "City",
        "Perpetrator Group",
        "Fatalities",
        "Injured"
      ])
  table = get_table(url, payload)
  while table:
    for row in table.find_all("tr")[1:]:
      columns = row.find_all("td")
      if columns[5].text != '0' or columns[6].text != '0': 
        writer.writerow([col.text for col in columns[1:7]])
    print("page " + str(payload["page"]) + " complete")
    payload['page'] += 1
    table = get_table(url, payload)
