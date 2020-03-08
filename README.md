# NFL Pick'em Webservice

NOTE!
This project is not actively maintained.
It does not run live, but I will in near future make it available on heroku and/or try to finish it.

## Project

This is a NFL pick'em game, for thos who do not know how it works. It is a very simple game where people choose a winner from each game. The person who gets the most correct wins, wins the competition.

Below is a description on some points of the projects. If you have any question feel free to send them to me einargudnig@gmail.com

## Origin

Originally this was a school project made by Ólafur Sverrir Kjartansson my teacher in web development 2.
This was supposed to be a webservice for a online store.
I used the same authentication method that was before.
That is the reason the two users below are what they are, they pre-exist in the database.
I used a lot of his work, mainly because when I started I thought it would be hard to me to start a project like this from scratch.

### Users

* Admin with the username `admin`, password `hóp1-2019-admin`
* Non-admin with the username `oli`, password `hallóheimur`

## Data

The data used in this project was just the 2019/2020 schedule for the NFL. This data was gathered using a link like http://www.nfl.com/ajax/scorestrip?season=2019&seasonType=REG&week=2 here we can see the schedule for week 2 of the 2019 season.
I only have week one already in the database. The reason for that was I wanted to test if the things I was trying to do worked and if not, fix them. Later it would be easy to add more weeks to the database.

How I ended up making this work was:
* There is one table for users
* One table for the scheduele
* One table where I insert user id and a single game euid.
  * That table connects users to games that they can pick winner
* This last table has reference to the user from the user table and the game from the schedule table. The last column in this table holds the winner.

### Next steps

I made some simple tests in Postman and this should work, it's not complicated so the table that holds the winner also has connection to each user. So the plan was to make a frontend solution in Typescript that would showcase the functionality of this webservice. Unfortunately I did not manage to finish that. But hopefully I will have time to update this project and finish it before the start of 2020/2021 NFL season.

