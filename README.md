# actualityIOService
This project is developped to make a REST API fetchable like a socket.

# Refresh System

The aim is to be able to update the data at interesting times for the user.

To do this, it's possible to set in the configuration 2 moments in a day where the api will emit a refresh event:
- firstTimeRefresh
- secondTimeRefresh

However, if the user starts the first Client/Server link call at a different time than the two refresh hours, it will be necessary to calculate the time before reaching the nearest refresh time. This will initiate the continuous call cycle.

In order to avoid refresh calls too close to the first link call it's possible to set a time range (a time before the next refresh). 
- timeBeforeRefresh

This will make it possible to bypass the potential refresh time present in this range
