# Match-System

---

Implementation of a Match-System NodeJS module.

##  Feature Set

* PlayOff Bracket sets (8, 16, 32)
* Match/Bracket overview
* Multi-User Tournament SignUp
* Announce Match Score | Winner/Loser
* Track the score of each match
* Announce next players
* Remind/Alert next players (Push, Annotation, etc.) (depends if there is a library or api available)

### Routes

* users
  * signin
  * signup
  * profile
  * playerlist
* brackets
  * groups
  * tree
  * (timeline)



## Technologie

* Express JS
* mongoDB (www.mongodb.org) / levelDB
* mongoose
* Jade - HTML Templating-Engine
* passport sigin module / auth module

## Aufteilung im Team

* User sign up form with template
* Database connector and some abstraction stuff for saving user data
* User list template
* Filters and sorting for user list

## Zeitplan

### Milestone 1:

* setup project, repository and dependencies
* initial database setup (draft)
** Player (username, name, surname)
** vs (player1, player2, round)
* score (bracket, p_id, score)
* Sign up frontend for players and logic for saving players to database
* (User sign up with nickname, password, email, … + sign in for existing users)
* Template for player list

### Milestone 2:

* One hard coded bracket system (e.g. 8 players)
* Display of bracket system only


### Milestone 3:

* Track the score of played games
* Add the score of each game to the bracket display


### Milestone 4:

* Define next player based on the score of the games
* Scale the display of the bracket system for multiple numbers of players


### Milestone 5:

* Scale the logic of the bracket system for multiple number of players
