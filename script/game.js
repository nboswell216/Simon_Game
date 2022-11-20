
//Initial Values at page startup
var gamePattern = [];
var playerPattern = [];
var gameLevel = 1;
var isGameOver = false;

// $(document).one("keydown", readyNewGame);
$("#inner-circle").one("click",readyNewGame);

//Set up array constant that holds the 4 button colors
const buttonColors = ["green", "red", "yellow", "blue"];


//At the beginning of each new level, create the next color to add to the sequence
function nextInSequence() {
    var randomNumber = chooseRandomNumber();
    gamePattern.push(buttonColors[randomNumber - 1]);
}

//Pick a random number between 1-4 in order to correlate that to a color tile to choose
function chooseRandomNumber() {
    return Math.floor((Math.random() * 4) + 1);
}

//When player clicks color, check to see if it is a match with the same color in sequence as displayed
function checkAnswer(colorToCheck, trueColor) {
    if (colorToCheck !== trueColor) {
        isGameOver = true;
        gameOverCssChanges();
    } else {
        //this line first checks if an answer has already been marked wrong so that a preceding wrong answer is not overwritten as a correct response
        isGameOver ? isGameOver = true : isGameOver = false;
    }
}

//Blink the button for the current color in sequence
function blinkColorButton(color) {
    $(`#${color}`).fadeOut(150).fadeIn(150);
}

//When player clicks a color button, animate the press by invoking .pressed CSS custom class
function animatePress(clickedColor) {
    $(`#${clickedColor}`).addClass("pressed");
    setTimeout(() => {
        $(`#${clickedColor}`).removeClass("pressed");
    }, 50);
}

//Plays sounds to accompany when player clicks color button; Plays sounds when next color in sequence is blinked; plays wrong sound when player makes wrong choice
function playColorSounds(colorToPlay) {
    var colorSound = new Audio(`sounds/${colorToPlay}.mp3`);
    colorSound.play();
}

//Prepare game for next level: increment game level variable, reset the player chosen color sequence array, and display current level at top
function readyNextLevel() {
    gameLevel++;
    playerPattern = [];
    $("#current-level").removeClass("invisible").text(`LEVEL ${gameLevel}`);
    gamePlay(gameLevel, evalLevelSuccess);
}


//Upon start of new game indicated by keypress, prepare new game: remove game over title if present, reset all game tracking variables including reset level to 1
function readyNewGame() {
    $("#start-title").removeClass("invisible");
    $(".game-over-title").addClass("invisible");
    isGameOver = false;
    gamePattern = [];
    playerPattern = [];
    gameLevel = 1;
    gamePlay(gameLevel, evalLevelSuccess);
    // $(document).one("keypress", function () {
    //     gamePlay(gameLevel, evalLevelSuccess);
    // });
}

//Many features on the page change, and sound is played when wrong answer is color sequence is chosen. Also invoked when user takes longer than 60 seconds to respond
function gameOverCssChanges() {
    $("#start-title").addClass("invisible");
    $("#current-level").addClass("invisible")
    $(".game-over-title").removeClass("invisible");
    playColorSounds("wrong");
    $("body").addClass("game-over");
    setTimeout(() => {
        $("body").removeClass("game-over");
    }, 100);
}

//Document is always listening for clicks on the four color buttons. When clicked, check if correct color, animate, and play sound
$(".bttn").on("click", (event) => {
    var playerChosenColor = event.target.id;
    animatePress(playerChosenColor);
    playColorSounds(playerChosenColor);
    playerPattern.push(playerChosenColor);
    var correspondingColor = gamePattern[(playerPattern.length - 1)]
    checkAnswer(playerChosenColor, correspondingColor);
});

//This is a callback function for the main gamePlay() function. Created as callback so that it is only invoked once the player has completed the correct array sequence, chooses a wrong answer, or takes more than 60 seconds to respond
function evalLevelSuccess() {
    isGameOver ? $("#inner-circle").one("click",readyNewGame)/*$(document).one("keydown", readyNewGame)*/ : setTimeout(readyNextLevel, 1000);
}

//Game Play function - main game code || Second parameter is callback function evalLevelSuccess(). Invoked by readyNewGame() and readyNextLevel()
function gamePlay(thisLevel, evalNextMove) {
    //Modify heading to display current level
    $("#start-title").addClass("invisible");
    if (!isGameOver) {
        $("#current-level").removeClass("invisible").text(`LEVEL ${thisLevel}`);

        //Retrieve the next color for the color sequence maintained for entire current game
        nextInSequence();

        //Display the most recent color selected to the player
        blinkColorButton(gamePattern[thisLevel - 1]);
        playColorSounds(gamePattern[thisLevel - 1]);

        //Set interval is used to continually check for the user's response. The interval will continue looping until the user's response is completely correct, or when it is wrong once, or when 60 seconds have elapsed.
        //After the interval is cleared, callback function evalLevelSuccess() is invoked to direct either the next level or game over
        var intervalCounter = 0
        var intervalIndex = 0;
        intervalIndex = setInterval(() => {
            intervalCounter++;
            if (intervalCounter > 120) {
                isGameOver = true;
                gameOverCssChanges();
            }
            if ((playerPattern.length >= gamePattern.length) || isGameOver) {
                clearInterval(intervalIndex);
                if (gamePattern.length === thisLevel) {
                    evalNextMove();
                }
            }
        }, 500);
    } else {
        $("#current-level").addClass("invisible");
        // $(document).one("keydown", readyNewGame);
        $("#inner-circle").one("click",readyNewGame);
    }
}