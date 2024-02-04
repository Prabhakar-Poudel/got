# Game of Three

![Won](https://github.com/Prabhakar-Poudel/got/blob/main/public/assets/images/won.png)
![Lost](https://github.com/Prabhakar-Poudel/got/blob/main/public/assets/images/lost.png)

## Goal
The goal is to implement a game with two independent units – the players –
communicating with each other using an API.
Description
When a player starts, it incepts a random (whole) number and sends it to the second
player as an approach to starting the game.
The receiving player can now always choose between adding one of {-1, 0, 1} to get
to a number that is divisible by 3. Divide it by three. The resulting whole number is
then sent back to the original sender.
The same rules are applied until one player reaches the number 1 (after the division).
See the example below.

![Example](https://github.com/Prabhakar-Poudel/got/blob/main/public/assets/images/example.png)


For each "move", a sufficient output should be generated (mandatory: the added, and
the resulting number).

Both players should be able to play automatically without user input. One of the players
should optionally be adjustable by a user.

## Game Flow
Any whole number can be converted to a number divisible by 3 using the available options (-1, 0, +1).
And there is only one way this can be done. As illustrated in example below. And if we look up starting from 1 there
is a range of numbers that if a player gets can decide if they win or loose over the course of the game

1 -> Not possible<br />
2 -> +1, /3 = 1 Win<br />
3 -> +0, /3 = 1 Win<br />
4 -> -1, /3 = 1 Win<br />
5 -> +1, /3 = 2 Loss(Next player wins at 2)<br />
6 -> +0, /3 = 2 Loss(Next player wins at 2)<br />
7 -> -1, /3 = 2 Loss(Next player wins at 2)<br />
8 -> +1, /3 = 3 Loss(Next player wins at 3)<br />
9 -> +0, /3 = 3 Loss(Next player wins at 3)<br />
10 -> -1, /3 = 3 Loss(Next player wins at 3)<br />
11, 12, 13 -> +1, 0, -1 {} /3 = 4 Loss(Next player wins at 4)<br />
14, 15, ... , 40 => 5 Win<br />
41 ... 121 -> +1/3 = 14 Loss<br />
...<br />

# Architecture

To not add complexity that we probably do not need (which keeps architecture simple), we (I) will make some assumptions on the system.
- Users do not cheat
- Users do not need to sign up (register)
- We render a simple UI (server rendered)
- 2 players are needed to start the game
- 1st player to join will wait until other player joins the game
- All aspects of authentication, authorization, security etc are out of scope. But should be easy to add them on later iterations
- In memory cache used for the POC. Should be trivial to replace with cache store in later iterations
- Server is delebrately kept stateless except for keeping single game with one player, until another player joins. In later iterations we could levarage the cache store to keep track of game state, allow multiple people in same game, keep players, games records etc
- We use socket.io which will use socket if available at the client or fallback to long polling. But the impact should be opaque to us.
- UI is delebrately kept simple. In later iterations it makes sense to create a separate application for it.


### The high level components

- A nestJS server using MVC pattern to serve simple HTML built with handlebars templating

![Basic architecture](https://github.com/Prabhakar-Poudel/got/blob/main/public/assets/images/architecture.png)


### The game

- Users enters their name to join a game.
- Sever checks for available game if any or creates a new game and returns game ID to the client (browser)
- The server only knows if there is any game witing for another player. The game itself is a logical concept at this pont, mwwrly an ID of the game. Beside game ID server also sends the initial random number that is used to start the game. And a session id for this client.
- Client connects to server using socket connection to join the game and subscribe to events in the game
- Server simply relays all the events it receives to the client. Note again here that server trusts the client to make right decision through the game. This pattern of course is not ideal but is very good to illustrate the communication layer and overall architecture of the system
- There are too many ways the system could be erroneous, connection error, client disconnects midway, wrong data from client etc. And apart from usual connection error nothing is assumed but all error handlings is too vast for a POC
- Game ends when 1 of the player gets the result of calculation equal 1.

![Architectural flow diagram](https://github.com/Prabhakar-Poudel/got/blob/main/public/assets/images/flow-diagram.png)


### Message flow via socket

- After receiving game ID, client will create connection to the server.
- Client will send a `join` message with game id, user's session id (session because user sounds like person), among other details.
- Server will broadcast user joined the game in the game room.
- Server willl add user to the room specific to this game.
- This will repeat when second player joins.
- After receiving player join event, the first client will send a `begin` message to signal starting game. Client also makes an initial move at the same time, with move just being the initial number.
- The game follows by each player sending a `move` event, adding their next move to the list of moves (in a setup with database, server can store the move without clientss having to track them)
- Game ends when one of the player makes a move that results to 1.

![Socket diagram](https://github.com/Prabhakar-Poudel/got/blob/main/public/assets/images/socket-diagram.png)

# Devlopement

The application is built on NestJS for simplicity.

Install dependencies
`npm install`

Run server
`npm run dev`

# Manual testing

After starting the server. Open two tabs pointing to the server (default http://localhost:3000)
Enter your name and hit the play button, one after another in both tabs
The game should proceed automatically until it finishes

# Automatic testing

Unit tests `npm run test`
End to end test `npm run test:e2e`
