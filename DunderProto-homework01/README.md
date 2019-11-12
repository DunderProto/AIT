# Connectmoji

This is an interactive game made purely with JavaScript. The user faces off with the computer in a game of a modified "Connect 4". The game board length (number of columns and rows) and how many pieces needed to win are all decided by the user after the program prompts them. The pieces themselves can be decided (even emojis, hence the name *Connectmoji*) with any alphabetical letter. Each turn, the user enters a column to put their piece in until they or the computer has reached the required number of lined up pieces in order to win the game.

## Dependencies

*readlineSync* </br>
*wcwidth* </br>
*clear*

## Running the Project

In the src directory of the project's folder, enter *node game.js* in the terminal. Shortly after, the terminal will prompt you to press *ENTER* and will ask a series of questions to set up the board and pieces. 

## Example Game

![Connectmoji](Connectmoji.png)