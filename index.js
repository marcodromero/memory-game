class App{

    #emojis = ["🐬","🍕","🎁","🤪","❤️","🔒", "🌻","🥳","🎹", "🎅","🐬","🍕","🎁","🤪","❤️","🔒", "🌻","🥳","🎹","🎅"];
    #board = document.getElementById("board");
    #results = document.getElementById("results");
    #leaderboard= document.getElementById("leaderboard");
    #menu = document.getElementById("menu");
    #btnStartGame = document.getElementById("btnStartGame");
    #btnStartGame2 = document.getElementById("btnStartGame2");
    #btnSaveResult = document.getElementById("btnSaveResult");
    #btnLeaderboard = document.getElementById("btnLeaderboard");
    #btnDeleteLeaderboard = document.getElementById("btnDeleteLeaderboard");
    #btnRules= document.getElementById("btnRules");
    #elections = [];
    #counter = 0;
    #seconds = 0;
    #minutes = 0
    #intervalId = null;
    #dataLeaderboard = [];
    #audioWin = document.getElementById("audioWin");
    #audioCorrect = document.getElementById("audioCorrect");
    #audioIncorrect= document.getElementById("audioIncorrect");
    #btnExit = document.getElementById("btnExit");

  constructor(){   
    let dataBrowserLeaderboard = localStorage.getItem("leaderboard");
    (dataBrowserLeaderboard != undefined) && (this.#dataLeaderboard = JSON.parse(dataBrowserLeaderboard));
    this.#btnStartGame.addEventListener("click", ()=>this.#startGame());
    this.#btnStartGame2.addEventListener("click", ()=>this.#startGame());
    this.#btnSaveResult.addEventListener("click", (e)=>{e.preventDefault(); this.#saveResult()});
    this.#btnLeaderboard.addEventListener("click", ()=>this.#renderLeaderboard());
    this.#btnDeleteLeaderboard.addEventListener("click", ()=>this.#deleteLeaderboard());
    this.#btnRules.addEventListener("click", ()=>this.#renderMainMenu());
    this.#btnExit.addEventListener("click", ()=>this.#renderMainMenu());
    this.#renderMainMenu();
  }

  #startGame(){
    this.#seconds = 0;
    this.#minutes = 0;
    this.#counter = 0;
    this.#elections = [];
    this.#shuffleArrayEmojis(this.#emojis);
    this.#intervalId && clearInterval(this.#intervalId)
    this.#renderBoard();
    this.#startChronometer();
  }

  #startChronometer(){
    this.#intervalId = setInterval(() => {
      
      if(this.#seconds == 59){
        this.#seconds = 0;
        this.#minutes++; 
      }else{
        this.#seconds++;
      }      
    }, 1000);
  }

  #shuffleArrayEmojis(array){
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  #renderMainMenu(){
    this.#board.style.display = "none";
    this.#btnExit.style.display = "none";
    this.#menu.style.display = "block";
    this.#leaderboard.style.display = "none";
    if(this.#dataLeaderboard.length == 0){
      this.#btnLeaderboard.style.display = "none";
    }else{
      this.#btnLeaderboard.style.display = "block";
    }
  }

  #renderBoard(){
    this.#board.innerHTML = '';
    this.#menu.style.display = "none";
    this.#leaderboard.style.display = "none";   
    this.#board.style.display = "grid";
    const notificationContainer = document.createElement("div");
    notificationContainer.id = "notification";
    this.#board.appendChild(notificationContainer);
    this.notification = document.getElementById("notification");
    this.#btnExit.style.display = "block";
    
    for(let i = 0; i < this.#emojis.length ; i++){
      let flipCard = document.createElement("div");
      flipCard.className = "board__flip-card";
      flipCard.id = i;

      let flipCardInner = document.createElement("div");
      flipCardInner.className = "board__flip-card-inner";
     
      let flipCardFront = document.createElement("div");
      flipCardFront.className= "board__flip-card-front";

      let flipCardBack = document.createElement("div");
      flipCardBack.className= "board__flip-card-back";

      let emoji = document.createTextNode(this.#emojis[i]);
      flipCardBack.appendChild(emoji);

      flipCardInner.appendChild(flipCardFront);
      flipCardInner.appendChild(flipCardBack);

      flipCard.appendChild(flipCardInner);
      this.#board.appendChild(flipCard);
    }
    
    this.#addEventsToCards();
  }

  #addEventsToCards(){
    const boardCardsList = document.querySelectorAll(".board__flip-card");
    const boardCardsArray = [...boardCardsList];
     
    boardCardsArray.forEach(element => {
      element.addEventListener("click", this.#saveElectionOfPlayer);
    });
  }
  

  #saveElectionOfPlayer = (e)=>{
    let card = e.target.closest(".board__flip-card");
    const flipCardInner = card.children[0];
    flipCardInner.classList.add("animation__show-card");
 
   
    
    if(this.#elections.length < 2){
      if(this.#elections.length == 0  || this.#elections[0]?.id != card.id){
       
        this.#elections.push({flipCardInner, id:card.id});
      }
    }

    if(this.#elections.length == 2){
      this.#compareElections();
      
    }
  }

   #compareElections(){
    this.#protectBoard()
    if(this.#emojis[this.#elections[0].id] === this.#emojis[this.#elections[1].id] ){
        setTimeout(() => {
          this.#showNotification("¡ACERTASTE!✔️")
          this.#playAudio(this.#audioCorrect);
          this.#applyFilterToCards();
          this.#elections = []
        }, 1000);
        
        this.#counter++;
        this.#verifyGameCompleted();
        this.#removeEventClickOfCards();
        
        

    }else{
      setTimeout(() => {
        this.#showNotification("¡ERRASTE!❌")
        this.#playAudio(this.#audioIncorrect);
      }, 1000);
        setTimeout(()=>{
          this.#elections[0].flipCardInner.classList.remove("animation__show-card");
          this.#elections[1].flipCardInner.classList.remove("animation__show-card");
          this.#elections = []
        }, 2000)
    }
  }

  #showNotification(text){
    this.notification.innerHTML = '';
    const textContainer = document.createElement("p");
    const textNode = document.createTextNode(text);
    textContainer.appendChild(textNode);
    this.notification.appendChild(textContainer);
    notification.style.display = "flex";
    setTimeout(() => {
      notification.style.display = "none";
    }, 1000);
  }

  #verifyGameCompleted(){
    if(this.#counter == (this.#emojis.length)/2){
          clearInterval(this.#intervalId);
          setTimeout(() => {
            this.#playAudio(this.#audioWin);
            this.#btnExit.style.display = "none";
            this.#renderResult(); 
          }, 2000);
         
      }
  }

  #protectBoard(){
    let protectionElement = document.getElementById("protection");
    protectionElement.style.display = "block"
 
    setTimeout(() => {
       protectionElement.style.display = "none"
    }, 2000);
  }

  #applyFilterToCards(){
    this.#elections[0].flipCardInner.children[1].style.filter= "grayscale(1)";
    this.#elections[0].flipCardInner.children[1].style.backgroundColor= "#d3d3d3";
    this.#elections[1].flipCardInner.children[1].style.filter= "grayscale(1)";
    this.#elections[1].flipCardInner.children[1].style.backgroundColor= "#d3d3d3";
  } 

  #removeEventClickOfCards(){
    document.getElementById(String(this.#elections[0].id)).removeEventListener("click", this.#saveElectionOfPlayer);
    document.getElementById(String(this.#elections[1].id)).removeEventListener("click", this.#saveElectionOfPlayer);
  }
 
  #renderResult(){
    let resultTime = document.getElementById("results__time");
    resultTime.innerHTML = "";
    let times = document.createTextNode(`${this.#minutes}:${this.#seconds.toString().padStart(2,'0')}`);
    resultTime.appendChild(times);
    this.#board.style.display = "none";
    const alert = document.getElementById("alert");
    alert.style.display = "none";
    this.#results.style.display = "block";
  }

  #renderLeaderboard(){
    const leaderboardTbody = document.getElementById("leaderboardTbody");
    leaderboardTbody.innerHTML = '';
    this.#dataLeaderboard.forEach((element, index)=>{
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

    this.#menu.style.display = "none";
    this.#results.style.display = "none";
    this.#leaderboard.style.display = "block";
     
  }

  #saveResult(){
    let playerName = document.getElementById("playerName").value;
    playerName = playerName.trim();
    if(playerName.length >= 3 && playerName.length <= 10){
      const playerData = {name: playerName, minutes: this.#minutes, seconds: this.#seconds};
      this.#dataLeaderboard.push(playerData);
      this.#dataLeaderboard = this.#sortLeaderboard();
      
      localStorage.setItem("leaderboard", JSON.stringify(this.#dataLeaderboard));
      this.#renderLeaderboard();
    }else{
      const alert = document.getElementById("alert");
      alert.style.display = "block";
    }
  
    
  }


  #sortLeaderboard(){
    let arraySorted = this.#dataLeaderboard.sort((a, b) => {
      if(a.minutes == b.minutes){
        return a.seconds - b.seconds;
      }
      return a.minutes - b.minutes;
    });
    return arraySorted;
  }

  #deleteLeaderboard(){
    localStorage.removeItem("leaderboard");
    this.#dataLeaderboard = [];
    leaderboardTbody.innerHTML = '';
  }

  #playAudio(audio){
    audio.play();
  }

}

const app = new App();