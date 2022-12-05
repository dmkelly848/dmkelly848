# CS 171 Final Project by Danielle Kelly, Rohan Sheth, and Nick Lauer

## URLs:
Website: https://dmkelly848.github.io/dmkelly848/
Screencast Video:

## How To:

Our project is about performance in Olympic Track and Field. We have several visualizations which cover various elements of the history of the sport.

-We start with a profile of Usain Bolt, widely considered one of the greatest athletes of all time. From there, we transition
into a discussion about the background of track and field, with an interactive visualization on how each of the events work. To use, click on
the different icons to learn more about the events!

-After this, we visualize performance over time by country, with an interactive dashboard showing overall medals won by country, along with 
details showing the events and years the medals were won in, with the opportunity to filter by country. To use, click on the different country blocks
to learn more about their Olympic medals won!

-Next, we dive more into individual performance, with a visualization simulating 100m race times (in real time!)
for every gold medal winner, for both men and women, where we see how much faster recent champions are
than the champions of the early 20th century. To use, click on buttons to watch either the men's or women's race!

-We follow this with a visualization of how high jump and pole vault winning marks have changed over time as well,
where we see a very similar trend, this time through the use of rising bar. To use, select an event and gender, and
use the slider to watch the bar move over time!

-We take a step back next, looking at a much more macro picture of how records are being broken, with an interactive linked visualization
showing the records broken in each games as well as how long each record stands for before being broken. We see that new olympic records are set
all the time. To use, click the previous and next buttons to look at each games and watch as records are set and broken!

-Finally, we hypothesize as to why this might be the case, taking a look at 6 factors that could be explaining the apparent improved
performance seen across the board in Olympic track and field. To use, click on each icon to learn more about how that factor may explain
changes in Olympic performance!

## What is included:

## dmkelly848: code for website:

### css
-fullpage.css: courtesy of fullpage to enable scrolling
-styles.css: Contains our custom styling for website

### data
-clean_results.csv: Data from Kaggle (https://www.kaggle.com/datasets/jayrav13/olympic-track-field-results),
after cleaning/preprocessing in Python

-continent_mapping.csv: Data to map the country codes to their names and continents, from: https://statisticstimes.com/geography/countries-by-continents.php

-event_descriptions.csv: Custom descriptions for each track and field event, generated off of https://www.momsteam.com/sports/track-and-field-events
-event_descriptions.xlsx: Excel document used to modify descriptions, which are then saved and pulled as a csv (above), also from source above

-hosts.csv: Contains Summer Olympic Years and hosts for globe vis (created manually using main dataset and wikipedia)

-records.csv: Contains all record-setting marks, made using Python with main kaggle dataset

### img

-icons: a folder with icons representing each of the events in our dataset, edited from: https://www.vectorstock.com/royalty-free-vector/sport-pictograph-icon-set-02-track-and-field-vector-1000098

-other images used elsewhere in our project, courtesy of Google Image search

-jpeg images of our team

## fullPage.js-master

Code courtesy of fullpage, to provide template for webpage

### js

-main.js: central JS file where global functions and variables are stored: our code

-others, all of which represent different visualization classes used in our project: our code

### html

-index.html: central webpage liked to other files which is the homepage for the entire project