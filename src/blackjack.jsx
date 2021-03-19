/* 
    Hey, you shouldn't be here!  This is private code and...
    
    Ah, who am I kidding?  It's open source, take a big o' whiff of
    sloppy code and bad choices, it's blackjack!  Although, you
    definetly could cheat...  Just type in 'console.log(cards)'
    and you can look at the whole deck!
*/

console.warn("Hey, you shouldn't be here!  What are you doing, get out of the console!  Oh, if your mother knew you were here...");

const cards = []

for (var i = 0; i < 52; i++) {
    /*
     * 1 - Spade
     * 2 - Club 
     * 3 - Heart
     * 4 - Diamond
     */
    var x = i + 1;
    var y = 0;
    var z;

    while (x > 13) {
        x -= 13;
        y++;
    }

    z = ["spades", "clubs", "hearts", "diams"][y];

    cards.push({
        rank: x,
        suit: z,
        flipped: false,
    });
}

for (var i = 0; i < 52; i++) {
    var int = Math.floor(Math.random() * 52);
    while (int == i) {
        int = Math.floor(Math.random() * 52);
    }

    var hold = cards[int];

    cards[int] = cards[i];
    cards[i] = hold;
}

class Blackjack extends React.Component {
    constructor(props) {
        super(props);

        var card;

        var dealer = [];
        card = cards.shift();
        card.flipped = true;
        dealer.push(card);
        dealer.push(cards.shift());

        var player = []
        card = cards.shift();
        card.flipped = true;
        player.push(card);
        card = cards.shift();
        card.flipped = true;
        player.push(card);

        this.state = {
            state: 1,
            dealer: dealer,
            player: player,
            winner: 0,
            win: false
        };

        this.hit = this.hit.bind(this);
        this.stand = this.stand.bind(this);
        this.dealerMove = this.dealerMove.bind(this);
        this.getStatusText = this.getStatusText.bind(this);
    }

    render() {
        return(<div className="playingCards simpleCards">
            <h2>Dealer</h2>
            <ul className="table">
                {this.renderCards(this.state.dealer)}
            </ul>
            <h2>Player</h2>
            <ul className="table">
                {this.renderCards(this.state.player)}
            </ul>
            {this.getStatusText()}
            {this.state.state == 1 && <button onClick={this.hit}>Hit</button>}
            {this.state.state != 4 && <button onClick={this.stand}>Stand</button>}
            {this.state.win && <button onClick={this.reload}>Play again!</button>}
        </div>); //TODO: Refactor for no refresh.
    }
    
    reload() {
        window.location.reload();
    }

    getStatusText() {
        if (this.state.win) {
            switch(this.state.winner) {
                case 0:
                    return <h3>Push!</h3>;

                case 1:
                    return <h3>Dealer wins...</h3>;

                case 2:
                    return <h3>You win!</h3>;
            }
        }
        switch (this.state.state) {
            case 1:
                return <h3>Your move</h3>;

            case 2:
                return <h3>Busted!</h3>;

            case 3:
                return <h3>Blackjack!</h3>

            case 4:
                return <h3>Dealer's move</h3>;
        }
    }

    renderCards(deck) {
        var cards = [];
        var ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        var suits = ["diams", "hearts", "spades", "clubs"];
        var suitCodes = ["♦", "♥", "♠", "♣"];

        deck.forEach((card, index) => {
            if (card.flipped) {
                cards.push(<div className={"card rank-"+ ranks[card.rank -1].toLowerCase() +" "+ card.suit} key={index}><span className="rank">{ranks[card.rank -1]}</span><span className="suit">{suitCodes[suits.indexOf(card.suit)]}</span></div>);
            } else {
                cards.push(<div className="card back" key={index}>*</div>);
            }
        });

        return cards;
    }

    hit() {
        var player = this.state.player;
        var card = cards.shift();
        card.flipped = true;
        player.push(card);

        if (this.busted(player)) {
            this.setState({
                player: player,
                state: 2
            });
        } else if (this.blackjack(player)) {
            this.setState({
                player: player,
                state: 3
            });
        } else {
            this.setState({
                player: player
            });
        }
    }

    stand() {
        var dealer = this.state.dealer;
        dealer[1].flipped = true;

        this.setState({
            state: 4,
            dealer: dealer
        });

        setTimeout(this.dealerMove, 1000);
    }

    busted(deck) {
        return this.countCards(deck) > 21;
    }

    blackjack(deck) {
        return this.countCards(deck) == 21;
    }

    dealerMove() {
        var dealer = this.state.dealer;

        if (this.countCards(dealer) < 17) {
            var card = cards.shift();
            card.flipped = true;
            dealer.push(card);
            this.setState({
                dealer: dealer
            });
        } else {
            // round finish
            var player = this.state.player;
            var dealerScore, playerScore;

            if (this.busted(dealer)) {
                dealerScore = 0;
            } else {
                dealerScore = this.countCards(dealer);
            }

            if (this.busted(player)) {
                playerScore = 0;
            } else {
                playerScore = this.countCards(player);
            }

            if (dealerScore > playerScore) {
                this.setState({
                    win: true,
                    winner: 1
                });
            } else if (dealerScore < playerScore) {
                this.setState({
                    win: true,
                    winner: 2
                });
            } else if (dealerScore == playerScore) {
                this.setState({
                    win: true,
                    winner: 0
                });
            }
        }

        if (!this.state.win) {
            setTimeout(this.dealerMove, 1000);
        }
    }

    countCards(deck) {
        var count = 0;
        var aceCount = 0;

        deck.forEach((card, index) => {
            if (card.rank == 1) {
                count += 11;
                aceCount++;
            } else if (card.rank > 9) {
                count += 10;
            } else {
                count += card.rank;
            }
        });

        while (count > 21 && aceCount > 0) {
            count -= 10;
            aceCount--;
        }

        return count;
    }

    componentDidMount() {
        if (this.blackjack(this.state.player)) {
            this.setState({
                state: 3
            });
        }
    }
}

ReactDOM.render(<Blackjack cheater="Wow, you must really want to cheat!" nothing="Nothing here except cards and state." />, document.getElementById("blackjack"))