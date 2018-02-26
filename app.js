/* jshint esversion: 6 */
const game = (function () {
    "use strict";

    let canvas,
        canvasContext,
        ballX = 50,
        ballY = 50,
        ballSpeedX = 10,
        ballSpeedY = 5,
        paddle1Y = 250,
        paddle2Y = 250,
        player1Score = 0,
        player2Score = 0,
        showingWinScreen = false;

    const PADDLE_HEIGHT = 100,
        WINNING_SCORE = 3;

    const calculateMousePosition = function calculateMousePosition(event) {
        let rect = canvas.getBoundingClientRect(),
            root = document.documentElement,
            mouseX = event.clientX - rect.left - root.scrollLeft,
            mouseY = event.clientY - rect.top - root.scrollTop;
        return {
            x: mouseX,
            y: mouseY
        };
    }

    const handleMouseClick = function handleMouseClick() {
        if (showingWinScreen) {
            player1Score = 0;
            player2Score = 0;
            showingWinScreen = false;
        }
    }

    const moveEverything = function moveEverything() {
        if (showingWinScreen) {
            return;
        }
        ballX = ballX + ballSpeedX;
        ballY = ballY + ballSpeedY;
        ai();
        if (ballX < 0) {
            if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;
                let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
                ballSpeedY = deltaY * 0.35;
            } else {
                player2Score++;
                ballReset();
            }
        }
        if (ballX > canvas.width) {
            if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;
                let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
                ballSpeedY = deltaY * 0.35;
            } else {
                player1Score++;
                ballReset();
            }
        }

        if (ballY < 0) {
            ballSpeedY = -ballSpeedY;
        }
        if (ballY > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }
    }

    const drawRect = function drawRect(leftX, topY, width, height, color) {
        canvasContext.fillStyle = color;
        canvasContext.fillRect(leftX, topY, width, height);
    }

    const drawCircle = function drawCircle(centerX, centerY, radius, color) {
        canvasContext.fillStyle = color;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        canvasContext.fill();
    }


    const drawNet = function drawNet() {
        for (let i = 0; i < canvas.height; i += 40) {
            drawRect(canvas.width / 2 - 1, i, 2, 20, "white");
        }
    }

    const drawEverything = function draw() {
        /* background */
        drawRect(0, 0, canvas.width, canvas.height, "black");
        /* win screen */
        if (showingWinScreen) {
            canvasContext.fillStyle = "white";
            canvasContext.fillText("Click to continue !", 350, 500);
            if (player1Score >= WINNING_SCORE) {
                canvasContext.fillText("Left Player WON !", 350, 200);
            }
            if (player2Score >= WINNING_SCORE) {
                canvasContext.fillText("Right Player 2 WON !", 350, 200);
            }
            return;
        }
        /* net */
        drawNet();
        /* player 1 paddle */
        drawRect(0, paddle1Y, 20, 100, "red");
        /* player 2 paddle */
        drawRect(canvas.width - 20, paddle2Y, 20, 100, "green");
        /* ball */
        drawCircle(ballX, ballY, 10, "white");
        /* score */
        canvasContext.fillText(player1Score, 100, 100);
        canvasContext.fillText(player2Score, canvas.width - 100, 100);
    }

    const ai = function ai() {
        let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
        if (paddle2YCenter < ballY - 35) {
            paddle2Y += 8;
        } else if (paddle2Y > ballY + 35) {
            paddle2Y -= 8;
        }
    }

    const ballReset = function ballReset() {
        if (player1Score >= WINNING_SCORE ||
            player2Score >= WINNING_SCORE) {
            showingWinScreen = true;
        }

        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
    }

    window.onload = function () {
        canvas = document.getElementById("gameCanvas");
        canvasContext = canvas.getContext('2d');

        let framePerSecond = 30;
        setInterval(function () {
            moveEverything();
            drawEverything();
        }, 1000 / framePerSecond);

        canvas.addEventListener("mousedown", handleMouseClick);

        canvas.addEventListener("mousemove",
            function (evt) {
                let mousePos = calculateMousePosition(evt);
                paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
            }
        )
    }
}());