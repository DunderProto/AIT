// main.js
document.addEventListener("DOMContentLoaded", function(){
    let playBtn = document.getElementsByClassName("play-btn")[0];
    let start = document.getElementsByClassName("start")[0];
    let game = document.getElementsByClassName("game")[0];
    let errorMessage = document. getElementsByClassName("error-message")[0];

    let totalCards;
    let maxTurns;
    let cardFaces;

    let hasFlippedCard = false;
    let firstCard, secondCard;

    let turns = 0;
    let revealed = 0;
    let lastTurns;

    let noMatchEle = document.createElement("h3");
    noMatchEle.className = "noMatch";
    noMatchEle.innerHTML += "No Match.";
    document.getElementsByTagName('body')[0].appendChild(noMatchEle);

    let matchEle = document.createElement("h3");
    matchEle.className = "match";
    matchEle.innerHTML += "Match."

    let playerWin = document.createElement("h2");
    playerWin.className = "win";
    playerWin.innerHTML += "YOU WON!!!";

    let playerLose = document.createElement("h2");
    playerLose.className = "lose";
    playerLose.innerHTML += "YOU LOSE.";


    document.getElementsByTagName('body')[0].appendChild(matchEle);

    document.getElementsByClassName("match")[0].style.display = "none";
    document.getElementsByClassName("noMatch")[0].style.display = "none";

    flipCard = (card) => {
        card.childNodes[0].style.visibility = 'visible';

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = card;
            firstCard.style['pointer-events'] = "none";
        } else {
            hasFlippedCard = false;
            secondCard = card;
            secondCard.style['pointer-events'] = "none";
        }

        if (firstCard && secondCard) {
            checkMatch(firstCard, secondCard, firstCard.id, secondCard.id);
        }
    }

    checkMatch = (first, second, firstID, secondID) => {
        turns++;
        if (first.dataset.name === second.dataset.name) {
            document.getElementsByClassName("game")[0].style['pointer-events'] = 'none';
            document.getElementsByClassName("match")[0].style.display = "inline";
            firstCard = undefined;
            secondCard = undefined;
            revealed += 2;

            if (turns < maxTurns && revealed === totalCards) {
                setTimeout(() => {
                    document.getElementsByClassName("game")[0].style.display = "none";
                    document.getElementsByTagName('body')[0].appendChild(playerWin);

                    lastTurns = document.createElement("h3");
                    lastTurns.className = "lastTurns";
                    lastTurns.innerHTML += turns + " / " + maxTurns + " TURNS"       

                    document.getElementsByTagName('body')[0].appendChild(lastTurns);
                    
                }, 1000)
            } else if (turns >= maxTurns && revealed < totalCards) {
                setTimeout(() => {
                    document.getElementsByClassName("game")[0].style.display = "none";
                    document.getElementsByTagName('body')[0].appendChild(playerLose);

                    lastTurns = document.createElement("h3");
                    lastTurns.className = "lastTurns";
                    lastTurns.innerHTML += turns + " / " + maxTurns + " TURNS"       

                    document.getElementsByTagName('body')[0].appendChild(lastTurns);
                }, 1000)
            }

            setTimeout(() => {
                document.getElementsByClassName("game")[0].style['pointer-events'] = "auto";
                document.getElementsByClassName("match")[0].style.display = "none";
                document.getElementsByClassName("turns")[0].innerHTML = 'TURN ' + turns + ' / ' + maxTurns
                first.style['pointer-events'] = "auto";
                second.style['pointer-events'] = "auto";
            }, 1000);
            
        } else {
            document.getElementsByClassName("game")[0].style['pointer-events'] = 'none';
            // document.getElementsByTagName('body')[0].innerHTML += "<h3 class='match'>No Match.</h3>";
            document.getElementsByClassName("noMatch")[0].style.display = "inline";
            if ( turns >= maxTurns) {
                setTimeout(() => {
                    
                    document.getElementsByClassName("game")[0].style.display = "none";
                    document.getElementsByTagName('body')[0].appendChild(playerLose);

                    lastTurns = document.createElement("h3");
                    lastTurns.className = "lastTurns";
                    lastTurns.innerHTML += turns + " / " + maxTurns + " TURNS"       

                    document.getElementsByTagName('body')[0].appendChild(lastTurns);
                }, 1000)
            }
            setTimeout(() => {
                // firstCard.childNodes[0].style.color = "red";
                document.getElementsByClassName("card")[firstID].childNodes[0].style.visibility = "hidden";
                document.getElementsByClassName("card")[secondID].childNodes[0].style.visibility = "hidden";
                document.getElementsByClassName("game")[0].style['pointer-events'] = "auto";
                document.getElementsByClassName("noMatch")[0].style.display = "none";
                document.getElementsByClassName("turns")[0].innerHTML = 'TURN ' + turns + ' / ' + maxTurns
                first.style['pointer-events'] = "auto";
                second.style['pointer-events'] = "auto";
            }, 1000);
            firstCard = undefined;
            secondCard = undefined;
            
        }
        
    }

    playBtn.addEventListener("click", function(){
        totalCards = parseInt(document.getElementById("total-cards").value);
        maxTurns = parseInt(document.getElementById("max-turns").value);
        cardFaces = document.getElementById("card-faces").value;

        let listInputs = cardFaces.split(',');

        let toBe = false;
        let stored = [];
        let unique = [];

        // Check for exactly 2 of every element
        for (let i = 0; i < listInputs.length; i++) {
            if (unique.includes(listInputs[i])) {
                continue;
            } else {
                unique.push(listInputs[i]);
            }
            let count = 1;
            for (let j = i; j < listInputs.length; j++) {
                if (listInputs[j+1] === listInputs[i]) {
                    count++;
                    console.log(count);
                }
            }
            if (count === 2) {
                stored.push(listInputs[i]);
            }
        }

        if (stored.length === listInputs.length/2) {
            toBe = true;
        }

        if (totalCards % 2 === 1 || totalCards < 2 || totalCards > 36 || maxTurns < totalCards/2 || listInputs.length !== totalCards || toBe === false) {
            errorMessage.style.display = "block";
            return;
        }

        start.style.display = "none";
        errorMessage.style.display = "none";
        game.style.display = "flex";

        let board = "";
        board += '<h2 class="turns">TURN ' + turns + ' / ' + maxTurns + '</h2>'

        for (let i = 0; i < totalCards; i++) {
            let card = "<div class='card' id=" + i + " onclick='flipCard(this)' data-name="+listInputs[i]+"><p class='cardValue'>"+listInputs[i]+"</p></div>";
            board += card;
        }

        game.innerHTML = board;
        
    });
});

