class App{
  constructor(){
    this.emojis = ["🐬","🍕","🎁","🤪","🦁","🔒", "🌻","🥳","🎹", "🐬","🍕","🎁","🤪","🦁","🔒", "🌻","🥳","🎹"];
    this.board = document.getElementById("board");
    this.results = document.getElementById("results");
    this.leaderboard= document.getElementById("leaderboard");
    this.menu = document.getElementById("menu");
    this.btnStartGame = document.getElementById("btnStartGame");
    this.btnStartGame2 = document.getElementById("btnStartGame2");
    this.btnSaveResult = document.getElementById("btnSaveResult");
    this.btnLeaderboard = document.getElementById("btnLeaderboard");
    this.btnDeleteLeaderboard = document.getElementById("btnDeleteLeaderboard");
    this.btnRules= document.getElementById("btnRules");
    this.elections = [];
    this.isGameCompleted = false;
    this.counter = 0;
    this.seconds = 0;
    this.minutes = 0
    this.intervalId = null;
    this.dataLeaderboard = [];
  }

  init(){
    let dataBrowserLeaderboard = localStorage.getItem("leaderboard");
    (dataBrowserLeaderboard != undefined) && (this.dataLeaderboard = JSON.parse(dataBrowserLeaderboard));
    this.btnStartGame.addEventListener("click", ()=>this.startGame());
    this.btnStartGame2.addEventListener("click", ()=>this.startGame());
    this.btnSaveResult.addEventListener("click", ()=>this.saveResult());
    this.btnLeaderboard.addEventListener("click", ()=>this.renderLeaderboard());
    this.btnDeleteLeaderboard.addEventListener("click", ()=>this.deleteLeaderboard());
    this.btnRules.addEventListener("click", ()=>this.renderMainMenu());
    this.renderMainMenu();
  } 

  startGame(){
    this.seconds = 0;
    this.minutes = 0;
    this.counter = 0;
    this.intervalId && clearInterval(this.intervalId)
    this.renderBoard();
    this.startChronometer();
  }

  startChronometer(){
    this.intervalId = setInterval(() => {
      console.log(this.minutes, this.seconds);
      if(this.seconds == 59){
        this.seconds = 0;
        this.minutes++; 
      }else{
        this.seconds++;
      }      
    }, 1000);
  }

  renderMainMenu(){
    this.menu.style.display = "block";
    this.leaderboard.style.display = "none";
    if(this.dataLeaderboard.length == 0){
      this.btnLeaderboard.style.display = "none";
    }
  }

  renderBoard(){
    this.menu.style.display = "none";
    this.leaderboard.style.display = "none";   
    this.board.style.display = "grid";    
    
    for(let i = 0; i < this.emojis.length ; i++){
      let flipCard = document.createElement("div");
      flipCard.className = "board__flip-card";
      flipCard.id = i;

      let flipCardInner = document.createElement("div");
      flipCardInner.className = "board__flip-card-inner";
     
      let flipCardFront = document.createElement("div");
      flipCardFront.className= "board__flip-card-front";

      let flipCardBack = document.createElement("div");
      flipCardBack.className= "board__flip-card-back";

      let emoji = document.createTextNode(this.emojis[i]);
      flipCardBack.appendChild(emoji);

      flipCardInner.appendChild(flipCardFront);
      flipCardInner.appendChild(flipCardBack);

      flipCard.appendChild(flipCardInner);
      this.board.appendChild(flipCard);
    }
    
    this.addEventsToCards();
  }

  addEventsToCards(){
    const boardCardsList = document.querySelectorAll(".board__flip-card");
    const boardCardsArray = [...boardCardsList];
     
    boardCardsArray.forEach(element => {
      element.addEventListener("click", this.saveElectionOfPlayer);
    });
  }
  

  saveElectionOfPlayer = (e)=>{
    let card = e.target.closest(".board__flip-card");
    console.log("haz hecho clik en:", card.id);
    
    if(this.elections.length < 2){
      if(card.id != this.elections[0]){
        console.log("ingresado al array");
        this.elections.push(card.id);
      }
    }

    if(this.elections.length == 2){
      this.compareElections();
      this.elections = []
    }
  }

  compareElections(){
    if(this.emojis[this.elections[0]] === this.emojis[this.elections[1]] ){
        console.log("Has acertado");
        this.blockCards();
        this.counter++;
        this.verifyGameCompleted();  
      }else{
        console.log("Has errado")
      }
  }

  verifyGameCompleted(){
    if(this.counter == (this.emojis.length)/2){
          clearInterval(this.intervalId);
          console.log(this.counter, (this.emojis.length)/2)
          this.renderResult(); 
      }
  }

  blockCards(){
    const card1 = document.getElementById(String(this.elections[0]));
    const card2 = document.getElementById(String(this.elections[1]));
    card1.removeEventListener("click", this.saveElectionOfPlayer);
    card2.removeEventListener("click", this.saveElectionOfPlayer);
  }
 
  renderResult(){
    let resultTime = document.getElementById("results__time");
    let times = document.createTextNode(`${this.minutes}:${this.seconds.toString().padStart(2,'0')}`);
    resultTime.appendChild(times);
    this.board.style.display = "none";
    this.results.style.display = "block";
  }

  renderLeaderboard(){
    const leaderboardTbody = document.getElementById("leaderboardTbody");
    leaderboardTbody.innerHTML = '';
    this.dataLeaderboard.forEach((element, index)=>{
      const tr = document.createElement("tr");
      const tdTextName = document.createElement("td");
      const tdTextTime = document.createElement("td");
      const tdTextPosition = document.createElement("td");
      const textName = document.createTextNode(element.name);
      const textTime = document.createTextNode(`${element.minutes}:${(element.seconds).toString().padStart(2,"0")}`);
      const textPosition = document.createTextNode(index + 1);
      tdTextPosition.appendChild(textPosition);
      tdTextName.appendChild(textName);
      tdTextTime.appendChild(textTime);
      tr.appendChild(tdTextPosition);
      tr.appendChild(tdTextName);
      tr.appendChild(tdTextTime);
      leaderboardTbody.appendChild(tr);
    })

    this.menu.style.display = "none";
    this.results.style.display = "none";
    this.leaderboard.style.display = "block";
  }

  saveResult(){
    let playerName = document.getElementById("playerName").value;
    console.log("playerName", playerName);
    const playerData = {name: playerName, minutes: this.minutes, seconds: this.seconds};
    this.dataLeaderboard.push(playerData);
    this.dataLeaderboard = this.sortLeaderboard();
    console.log("dataLeaderboardSorted", this.dataLeaderboard);
    localStorage.setItem("leaderboard", JSON.stringify(this.dataLeaderboard));
    this.renderLeaderboard();
  }


  sortLeaderboard(){
    let arraySorted = this.dataLeaderboard.sort((a, b) => {
      if(a.minutes == b.minutes){
        return a.seconds - b.seconds;
      }
      return a.minutes - b.minutes;
    });
    return arraySorted;
  }

  deleteLeaderboard(){
    localStorage.removeItem("leaderboard");
    this.dataLeaderboard = [];
  }

}

const app = new App();
app.init();