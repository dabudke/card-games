const ranks=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];const suits=["diams","hearts","spades","clubs"];const suitCodes=["\u2666","\u2665","\u2660","\u2663"];function countCards(deck){let count=0,aces=0;deck.forEach(({rank})=>{if(rank===1)count+=11,aces++;else if(rank>9)count+=10;else count+=rank});while(count>21&&aces>0)count-=10,aces--;return count}function updateScore(winner){if(window.localStorage.key(0)==null){window.localStorage.setItem("ties","0");window.localStorage.setItem("losses","0");window.localStorage.setItem("wins","0")}if(isNaN(parseInt(window.localStorage.getItem("ties"))))window.localStorage.setItem("ties","0");if(isNaN(parseInt(window.localStorage.getItem("losses"))))window.localStorage.setItem("losses","0");if(isNaN(parseInt(window.localStorage.getItem("wins"))))window.localStorage.setItem("wins","0");if(winner==0)window.localStorage.setItem("ties",parseInt(window.localStorage.getItem("ties"))+1);else if(winner==1)window.localStorage.setItem("losses",parseInt(window.localStorage.getItem("losses"))+1);else if(winner==2)window.localStorage.setItem("wins",parseInt(window.localStorage.getItem("wins"))+1)}class Blackjack extends React.Component{constructor(){super();this.state={};this.hit=this.hit.bind(this);this.start=this.start.bind(this);this.stand=this.stand.bind(this);this.dealerMove=this.dealerMove.bind(this);this.componentDidMount=this.start}start(){const cards=[];for(var i=0;i<52;i++){var x=i+1,y=0,z;while(x>13)x-=13,y++;z=["spades","clubs","hearts","diams"][y];cards.push({rank:x,suit:z})}for(var i=0;i<52;i++){let j;do{j=Math.floor(Math.random()*52)}while(i===j);const hold=cards[j];cards[j]=cards[i];cards[i]=hold}const player=[cards.shift(),cards.shift()];const dealer=[cards.shift(),cards.shift()];this.setState({init:true,state:countCards(player)==21?2:0,winner:0,deck:cards,player,dealer})}render(){if(!this.state.init)return null;return/*#__PURE__*/React.createElement("div",{className:"playingCards simpleCards"},/*#__PURE__*/React.createElement("h2",null,"Dealer ",/*#__PURE__*/React.createElement("sub",null,"(",this.state.state==3?countCards(this.state.dealer):"??",")")),/*#__PURE__*/React.createElement(Deck,{cards:this.state.dealer,showFirst:this.state.state!=3}),/*#__PURE__*/React.createElement("h2",null,"Player ",/*#__PURE__*/React.createElement("sub",null,"(",countCards(this.state.player),")")),/*#__PURE__*/React.createElement(Deck,{cards:this.state.player}),/*#__PURE__*/React.createElement(StatusText,{state:this.state.state,winner:this.state.winner}),this.state.winner!==0&&/*#__PURE__*/React.createElement(ScoreData,null),/*#__PURE__*/React.createElement(Buttons,{state:this.state.state,hit:this.hit,stand:this.stand,restart:this.start}))}hit(){var{player,deck}=this.state;player.push(deck.shift());if(countCards(player)>21){this.setState({player,state:1})}else{this.setState({player})}}stand(){this.setState({state:3});setTimeout(this.dealerMove,1000)}dealerMove(){const{dealer,deck}=this.state;if(countCards(dealer)<17){dealer.push(deck.shift());this.setState({dealer});setTimeout(this.dealerMove,1000)}else{const playerScore=countCards(this.state.player),dealerScore=countCards(dealer);if(playerScore>21||dealerScore>playerScore&&dealerScore<=21)this.setState({winner:2});else if(dealerScore>21||playerScore>dealerScore)this.setState({winner:3});else this.setState({winner:1});updateScore(this.state.winner)}}}function StatusText({state,winner}){if(winner!==0){switch(winner){case 1:return/*#__PURE__*/React.createElement("h3",null,"Push");case 2:return/*#__PURE__*/React.createElement("h3",null,"Dealer Wins");case 3:return/*#__PURE__*/React.createElement("h3",null,"You Win");}}switch(state){case 0:return/*#__PURE__*/React.createElement("h3",null,"Your Move");case 1:return/*#__PURE__*/React.createElement("h3",null,"Bust");case 2:return/*#__PURE__*/React.createElement("h3",null,"Blackjack");case 3:return/*#__PURE__*/React.createElement("h3",null,"Dealer Move");}}function Buttons({state,hit,stand,restart}){return/*#__PURE__*/React.createElement(React.Fragment,null,state==0&&/*#__PURE__*/React.createElement("button",{onClick:hit},"Hit"),state!=3&&/*#__PURE__*/React.createElement("button",{onClick:stand},"Stand"),state==3&&/*#__PURE__*/React.createElement("button",{onClick:restart},"Play Again!"))}function ScoreData(){return/*#__PURE__*/React.createElement("p",null,"Wins: ",/*#__PURE__*/React.createElement("strong",null,window.localStorage.getItem("wins")),"  Pushes: ",/*#__PURE__*/React.createElement("strong",null,window.localStorage.getItem("ties")),"  Losses: ",/*#__PURE__*/React.createElement("strong",null,window.localStorage.getItem("losses")))}function Deck({cards,showFirst}){const rendered=[];cards.forEach(({rank,suit},i)=>{if(!showFirst||i==0)rendered.push(/*#__PURE__*/React.createElement("div",{className:"card rank-"+ranks[rank-1].toLowerCase()+" "+suit,key:i},/*#__PURE__*/React.createElement("span",{className:"rank"},ranks[rank-1]),/*#__PURE__*/React.createElement("span",{className:"suit"},suitCodes[suits.indexOf(suit)])));else rendered.push(/*#__PURE__*/React.createElement("div",{className:"card back",key:i},"*"))});return/*#__PURE__*/React.createElement("ul",{className:"table"},rendered)}ReactDOM.render(/*#__PURE__*/React.createElement(Blackjack,null),document.getElementById("blackjack"));
