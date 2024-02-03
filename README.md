# Game of Three - Coding Challenge

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

[Example](https://github.com/Prabhakar-Poudel/got/blob/main/public/assets/images/example.png)
[[https://github.com/Prabhakar-Poudel/got/blob/main/public/assets/images/example.png|alt=example]]

For each "move", a sufficient output should be generated (mandatory: the added, and
the resulting number).

Both players should be able to play automatically without user input. One of the players
should optionally be adjustable by a user.

## Game Flow
Any whole number can be converted to a number divisible by 3 using the available options (-1, 0, +1).
And there is only one way this can be done. As illustrated in example below. And if we look up starting from 1 there
is a range of numbers that if a player gets can decide if they win or loose over the course of the game

1 -> Not possible
2 -> +1, /3 = 1 Win
3 -> +0, /3 = 1 Win
4 -> -1, /3 = 1 Win
5 -> +1, /3 = 2 Loss(Next player wins at 2)
6 -> +0, /3 = 2 Loss(Next player wins at 2)
7 -> -1, /3 = 2 Loss(Next player wins at 2)
8 -> +1, /3 = 3 Loss(Next player wins at 3)
9 -> +0, /3 = 3 Loss(Next player wins at 3)
10 -> -1, /3 = 3 Loss(Next player wins at 3)
11, 12, 13 -> +1, 0, -1 {} /3 = 4 Loss(Next player wins at 4)
14, 15, ... , 40 => 5 Win
41 ... 121 -> +1/3 = 14 Loss
...

# Architecture

To not add complexity that we probably do not need (which keeps architecture simple), we (I) will make some assumptions on the system.
- Users do not cheat
- Users do not need to sign up (register)
- We render a simple UI (server rendered)
- Players


[Basic architecture](https://github.com/Prabhakar-Poudel/got/blob/main/public/assets/images/architecture.png)
[[https://github.com/Prabhakar-Poudel/got/blob/main/public/assets/images/architecture.png|alt=architecture]]



[Architectural flow diagram](https://github.com/Prabhakar-Poudel/got/blob/main/public/assets/images/flow-diagram.png)
[[https://github.com/Prabhakar-Poudel/got/blob/main/public/assets/images/flow-diagram.png|alt=user-flow]]



[Socket diagram](https://github.com/Prabhakar-Poudel/got/blob/main/public/assets/images/socket-diagram.png)
[[https://github.com/Prabhakar-Poudel/got/blob/main/public/assets/images/socket-diagram.png|alt=socket-flow]]

# Devlopement

The application is built on NestJS for simplicity.

Install dependencies
`npm install`

Run server
`npm run dev`
