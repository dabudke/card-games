const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["diams", "hearts", "spades", "clubs"];
const suitCodes = ["♦", "♥", "♠", "♣"];

function countCards(deck) {
    let count = 0, aces = 0;

    deck.forEach(({rank}) => {
        if (rank === 1) count += 11, aces++;
        else if (rank > 9) count += 10;
        else count += rank;
    });

    while (count > 21 && aces > 0) count -= 10, aces--;

    return count;
}

function updateScore(winner) {
    if (window.localStorage.key(0) == null) {
        window.localStorage.setItem("ties","0");
        window.localStorage.setItem("losses","0");
        window.localStorage.setItem("wins","0");
    }
    if (isNaN(parseInt(window.localStorage.getItem("ties")))) window.localStorage.setItem("ties", "0");
    if (isNaN(parseInt(window.localStorage.getItem("losses")))) window.localStorage.setItem("losses", "0");
    if (isNaN(parseInt(window.localStorage.getItem("wins")))) window.localStorage.setItem("wins", "0");
    if (winner == 0) window.localStorage.setItem("ties", parseInt(window.localStorage.getItem("ties")) + 1);
    else if (winner == 1) window.localStorage.setItem("losses", parseInt(window.localStorage.getItem("losses")) + 1);
    else if (winner == 2) window.localStorage.setItem("wins", parseInt(window.localStorage.getItem("wins")) + 1);
}

class Blackjack extends React.Component {
    constructor() {
        super();

        this.state = {};

        this.hit = this.hit.bind(this);
        this.start = this.start.bind(this);
        this.stand = this.stand.bind(this);
        this.dealerMove = this.dealerMove.bind(this);

        this.componentDidMount = this.start;
    }

    start() {
        const cards = [];
        for (var i = 0; i < 52; i++) {
            var x = i + 1, y = 0, z;

            while (x > 13) x -= 13, y++;

            z = ['spades','clubs','hearts','diams'][y];

            cards.push({
                rank: x,
                suit: z
            });
        }

        for (var i = 0; i < 52; i++) {
            let j;
            do {
                j = Math.floor(Math.random() * 52);
            } while (i === j)

            const hold = cards[j];
            cards[j] = cards[i];
            cards[i] = hold;
        }

        const player = [cards.shift(),cards.shift()];
        const dealer = [cards.shift(),cards.shift()];

        this.setState({
            init: true,
            state: countCards(player) == 21 ? 2 : 0,
            winner: 0,
            deck: cards,
            player,
            dealer
        });
    }

    render() {
        if (!this.state.init) return null;
        return <div className="playingCards simpleCards">
            <h2>Dealer <sub>({this.state.state == 3 ? countCards(this.state.dealer) : "??"})</sub></h2>
            <Deck cards={this.state.dealer} showFirst={this.state.state != 3}/>
            <h2>Player <sub>({countCards(this.state.player)})</sub></h2>
            <Deck cards={this.state.player}/>
            <StatusText state={this.state.state} winner={this.state.winner}/>
            {this.state.winner !== 0 && <ScoreData />}
            <Buttons state={this.state.state} hit={this.hit} stand={this.stand} restart={this.start}/>
        </div>
    }

    hit() {
        var { player, deck } = this.state;
        player.push(deck.shift());

        if (countCards(player) > 21) {
            this.setState({
                player,
                state: 1
            })
        } else { this.setState({ player }) }
    }

    stand() {
        this.setState({ state: 3 });
        setTimeout(this.dealerMove,1000);
    }

    dealerMove() {
        const { dealer, deck } = this.state;

        if (countCards(dealer) < 17) {
            dealer.push(deck.shift());
            this.setState({ dealer });
            setTimeout(this.dealerMove,1000);
        } else {
            const playerScore = countCards(this.state.player), dealerScore = countCards(dealer);

            if (playerScore > 21 || dealerScore > playerScore && dealerScore <= 21) this.setState({ winner: 2 })
            else if ( dealerScore > 21 || playerScore > dealerScore ) this.setState({ winner: 3 });
            else this.setState({ winner: 1 })

            updateScore(this.state.winner);
        }
    }
}

function StatusText({ state, winner }) {
    if (winner !== 0) {
        switch(winner) {
            case 1: return <h3>Push</h3>;
            case 2: return <h3>Dealer Wins</h3>;
            case 3: return <h3>You Win</h3>;
        }
    }
    switch(state) {
        case 0: return <h3>Your Move</h3>;
        case 1: return <h3>Bust</h3>;
        case 2: return <h3>Blackjack</h3>;
        case 3: return <h3>Dealer Move</h3>;
    }
}

function Buttons({ state, hit, stand, restart }) {
    return <>
        {state == 0 && <button onClick={hit}>Hit</button>}
        {state != 3 && <button onClick={stand}>Stand</button>}
        {state == 3 && <button onClick={restart}>Play Again!</button>}
    </>;
}

function ScoreData() {
    return <p>Wins: <strong>{window.localStorage.getItem("wins")}</strong>  Pushes: <strong>{window.localStorage.getItem("ties")}</strong>  Losses: <strong>{window.localStorage.getItem("losses")}</strong></p>;
}

function Deck({ cards, showFirst }) {
    const rendered = [];
    cards.forEach(({ rank, suit },i) => {
        if (!showFirst || i == 0) rendered.push(<div className={"card rank-"+ ranks[rank -1].toLowerCase() +" "+ suit} key={i}><span className="rank">{ranks[rank -1]}</span><span className="suit">{suitCodes[suits.indexOf(suit)]}</span></div>);
        else rendered.push(<div className="card back" key={i}>*</div>)
    });
    return <ul className="table">{rendered}</ul>;
}

ReactDOM.render(<Blackjack/>, document.getElementById("blackjack"));
