class Result {
  static playerWins = 0;
  static computerWins = 0;

  constructor(whoWon) {
    this.whoWon = whoWon;

    this.addPoint();
  }

  addPoint() {
    if (this.whoWon === "player") {
      this.playerWin();
    } else if (this.whoWon === "computer") {
      this.computerWin();
    } else {
      console.log("tie result");
      this.computerWin();
      this.playerWin();
    }
  }

  playerWin() {
    Result.playerWins++;
  }
  computerWin() {
    Result.computerWins++;
  }
  static getResults() {
    return `${Result.playerWins}-${Result.computerWins}`;
  }
}

class TicTacToe {
  constructor(player, announcer, tiles, playerDisplay, resultX, resultO) {
    this.board = ["", "", "", "", "", "", "", "", ""];
    this.isGameActive = true;
    this.player = player;
    this.computer = player === "X" ? "O" : "X";
    this.announcer = announcer;
    this.tiles = tiles;
    this.playerDisplay = playerDisplay;
    this.resultX = resultX;
    this.resultO = resultO;

    this.PLAYER_WON = `PLAYER ${this.player} WON`;
    this.COMPUTER_WON = "COMPUTER WON";
    this.TIE = "TIE";
    this.currentTurn = "player";

    this.winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    document.querySelector(".player").classList.add(`player${this.player}`);
    document.querySelector(".computer").classList.add(`player${this.computer}`);

    this.displayTurn();
    this.game();
  }

  static showResults(playerResult, computerResult) {
    let playerPoints = Result.getResults().split("-")[0];
    let computerPoints = Result.getResults().split("-")[1];
    playerResult.innerText = playerPoints;
    computerResult.innerText = computerPoints;
  }

  handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
      const winCondition = this.winningConditions[i];
      const a = this.board[winCondition[0]];
      const b = this.board[winCondition[1]];
      const c = this.board[winCondition[2]];
      if (a === "" || b === "" || c === "") {
        continue;
      }
      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      this.announce(
        this.currentTurn === "player" ? this.PLAYER_WON : this.COMPUTER_WON
      );
      const result = new Result(this.currentTurn);
      TicTacToe.showResults(this.resultX, this.resultO);
      this.isGameActive = false;
      return;
    }

    if (!this.board.includes("")) {
      this.announce(this.TIE);
      this.isGameActive = false;
      let tier = new Result("tie");
      TicTacToe.showResults(this.resultX, this.resultO);
    }
  }

  isValidAction(tile) {
    if (tile.innerText === "X" || tile.innerText === "O") {
      return false;
    }
    return true;
  }

  announce(type) {
    switch (type) {
      case this.PLAYER_WON:
        this.announcer.innerHTML = `Player <span class="player${this.player}">${this.player}</span> Won`;
        break;
      case this.COMPUTER_WON:
        this.announcer.innerHTML = `Computer <span class="player${this.computer}">${this.computer}</span> Won`;
        break;
      case this.TIE:
        this.announcer.innerText = "Tie";
    }
    this.announcer.classList.remove("hide");
  }

  displayTurn() {
    this.playerDisplay.innerText = this.currentTurn;
    this.playerDisplay.classList.add(
      `player${this.currentTurn === "player" ? this.player : this.computer}`
    );
  }

  turn() {
    this.playerDisplay.classList.remove(
      `player${this.currentTurn === "player" ? this.player : this.computer}`
    );
    this.currentTurn = `${
      this.currentTurn === "player" ? "computer" : "player"
    }`;
    this.displayTurn();
  }

  updateBoard(index, player) {
    this.board[index] = player;
  }

  userAction(tile, index) {
    console.log("useraction");
    if (this.isValidAction(tile) && this.isGameActive) {
      tile.innerText = this.player;
      tile.classList.add(`player${this.player}`);
      this.updateBoard(index, this.player);
      this.handleResultValidation();
      this.turn();
    }
  }

  computerAction() {
    console.log("computeraction");
    if (this.isGameActive) {
      let options = [];
      for (let i = 0; i < this.board.length; i++) {
        if (this.board[i] === "") {
          options.push(i);
        }
      }
      let choose = options[Math.floor(Math.random() * options.length)];
      for (let i = 0; i <= 7; i++) {
        const winCondition = this.winningConditions[i];
        const a = this.board[winCondition[0]];
        const b = this.board[winCondition[1]];
        const c = this.board[winCondition[2]];
        let ai = `${this.computer}`;
        let p = `${this.player}`;
        if (a === ai && b === ai && c == "") {
          choose = winCondition[2];
          console.log("win choose", choose);
        }
        if (a === ai && c === ai && b == "") {
          choose = winCondition[1];
          console.log("win choose", choose);
        }
        if (b === ai && c === ai && a == "") {
          choose = winCondition[0];
          console.log("win choose", choose);
        }
        if (a === p && b === p && c == "") {
          choose = winCondition[2];
          console.log("counter choose", choose);
        }
        if (a === p && c === p && b == "") {
          choose = winCondition[1];
          console.log("counter choose", choose);
        }
        if (b === p && c === p && a == "") {
          choose = winCondition[0];
          console.log("counter choose", choose);
        }
      }
      console.log("calculated choose", choose);
      options = [];
      this.tiles[choose].innerText = `${this.computer}`;
      this.tiles[choose].classList.add(`player${this.computer}`);
      this.updateBoard(choose, this.computer);
      this.handleResultValidation();
      this.turn();
    }
  }

  resetBoard() {
    this.board = ["", "", "", "", "", "", "", "", ""];
    this.isGameActive = true;
    this.currentTurn = "player";
    this.announcer.classList.add("hide");
    this.tiles.forEach((tile) => {
      tile.innerText = "";
      tile.classList.remove("playerX");
      tile.classList.remove("playerO");
    });
    this.playerDisplay.classList.remove(`player${this.computer}`);
    this.displayTurn();
  }

  game() {
    setInterval(() => {
      console.log(this.currentTurn);
      if (this.isGameActive) {
        if (this.currentTurn === "player") {
          this.tiles.forEach((tile, index) => {
            tile.addEventListener("click", () => this.userAction(tile, index));
          });
        }
        if (this.currentTurn === "computer") {
          this.computerAction();
        }
      }
    }, 1000);
  }
}
window.addEventListener("DOMContentLoaded", () => {
  const tiles = Array.from(document.querySelectorAll(".tile"));
  const playerDisplay = document.querySelector(".display-player");
  const resetButton = document.querySelector("#reset");
  const announcer = document.querySelector(".announcer");
  const resultX = document.querySelector(".resultX-count");
  const resultO = document.querySelector(".resultO-count");

  let choosedPlayer = "X";
  const t = new TicTacToe(
    choosedPlayer,
    announcer,
    tiles,
    playerDisplay,
    resultX,
    resultO
  );

  resetButton.addEventListener("click", () => {
    t.resetBoard();
  });
});
