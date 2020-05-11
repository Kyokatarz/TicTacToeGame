class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            gameArray: ['-','-','-',
                        '-','-','-',
                        '-','-','-'],
            playerTurn: '',
            computerTurn: false,
            winner: ''
            
        }
        
        this.markPosition = this.markPosition.bind(this);
        this.getMove = this.getMove.bind(this);
        this.checkWinCondition = this.checkWinCondition.bind(this);
        this.handleCharacter = this.handleCharacterChoice.bind(this);
        this.resetHandler = this.resetHandler.bind(this);
    }
    //-------------CHARACTER CHOICE---------------//
    //                                            //
    //--------------------------------------------//
    handleCharacterChoice(playerChoice){
        let gameState = this.state.gameArray.join('');
        this.animation('main-menu', 'fadeOut')
        if (playerChoice == 'O'){
            this.setState({computerTurn: true,
                          playerTurn: 'X'}, this.getMove(gameState, 'X'))
            
        } else {
            this.setState({playerTurn: "X"})
        }
        
    }

    //-------------MARK PLAYER TURN---------------//
    //                                            //
    //--------------------------------------------//
    markPosition(posNumber){ // mark the move of the active player
        let array = [...this.state.gameArray]; // clone the previous state
        if (array[posNumber] == '-'){ // if the position in the array is not filled with X or O then:
            array[posNumber] = this.state.playerTurn; //change that position into whose turn it is
            this.setState({gameArray: array}, () => this.checkWinCondition());
            
            
            if (this.state.playerTurn == 'X'){ //change player's turn
                this.setState({playerTurn: 'O', computerTurn: true})
                
                this.getMove(array.join(''),'O')//get next move 
                
            } else {
                this.setState({playerTurn: 'X', computerTurn: true})
                this.getMove(array.join(''),'X')//get next move 
            };
            
        }
    }
    
    //-------------GET SUGGESTED MOVE-------------//
    //                                            //
    //--------------------------------------------//
    getMove(gameState, playerTurn){ //get moves from the API
        var req = new XMLHttpRequest();
        req.open("GET", "https://stujo-tic-tac-toe-stujo-v1.p.rapidapi.com/" + gameState +"/" + playerTurn);
        req.setRequestHeader("x-rapidapi-host", "stujo-tic-tac-toe-stujo-v1.p.rapidapi.com");
        req.setRequestHeader("x-rapidapi-key", "569596e8f8msh12917b46e6f5b82p1cac7cjsn78ef9cd98130");

        req.send();
        req.onload = function(){
            
            var json = JSON.parse(req.responseText);
            let array = json.game.split(''); 
            array[json.recommendation] = playerTurn; //change the recommendation move into an array           
            this.setState({gameArray: array}, () => this.checkWinCondition())   //and setState to the array
            if (this.state.playerTurn == 'X'){ //change player's turn
                this.setState({playerTurn: 'O', computerTurn: false})
            } else {
                this.setState({playerTurn: 'X', computerTurn: false})
            };
            
    }.bind(this)
}
    //-------------CHECK WIN CONDITION---------------//
    //                                            //
    //--------------------------------------------//
    checkWinCondition(){
        
        let winConfig = 
            [
                [0,1,2],
                [3,4,5],
                [6,7,8],
                [0,3,6],
                [1,4,7],
                [2,5,8],
                [0,4,8],
                [6,4,2]
            ];
        let playerList = ['X','O'];
        for (let i = 0; i < playerList.length; i++){
            let gameState = this.state.gameArray;
            
            if (this.state.winner != '') break;
            
            for (let j = 0; j < winConfig.length; j++){
                if (gameState[winConfig[j][0]] == playerList[i] // check if the player have won
                && gameState[winConfig[j][1]] == playerList[i]  
                && gameState[winConfig[j][2]] == playerList[i]){
                    
                    this.setState({winner: playerList[i] + ' WON!'});
                    this.animation('winner-announcer','fadeIn')
                    break;
                }  
            }
        }
    }
    
    animation(elemById, type){
        switch (type) {
            case 'fadeIn':
                document.getElementById(elemById).classList.add('fadeIn');
                break;

            case 'fadeOut':
                document.getElementById(elemById).classList.add('fadeOut');
                
            default:
                break;
        }
    }

    resetHandler(){
        console.log('Click!')
        this.setState({gameArray: ['-','-','-','-','-','-','-','-','-'],
                    playerTurn: '',
                    computerTurn: false,
                    winner: '',
            }
        )
        document.getElementById('main-menu').classList.remove('fadeOut');
        document.getElementById('winner-announcer').classList.remove('fadeIn');
        
    }


    //---------------RENDERING APP---------------------//
    render(){
        let square = this.state.gameArray.map((a,i) => (<Square content = {a} 
                                                            number = {i} 
                                                            markPosition = {this.markPosition} 
                                                            winner = {this.state.winner}
                                                            computerTurn = {this.state.computerTurn}/>))
        return(
        <div id='container'>
            <div id='reset-button' onClick = {this.resetHandler}>RESET</div>
            <div id = 'main-menu'>
                <p> Choose your character: <br/>
                <span onClick = {() => this.handleCharacterChoice('X')}>X</span>
                <span onClick = {() => this.handleCharacterChoice('O')}>O</span>
                </p>
            </div>    
            <div id = 'winner-announcer'>{this.state.winner}</div>
            <div id = 'square-container'>{square}</div>
        </div>
            
        )
    }
}

    //---------------RENDERING SQUARES---------------------//

class Square extends React.Component{
    constructor(props){
        super(props);
        
    }
    
    handleClick(){
        if (this.props.winner == ''){
            if (this.props.computerTurn == false){
                this.props.markPosition(this.props.number);    //send the position clicked to the main App
            }
        }
    }
    
    render(){
        return(
            <div className = 'squares' onClick = {this.handleClick.bind(this)}>
                <p>{this.props.content}</p>
            </div>
        )
        
    } 
     
}
    

    
    ReactDOM.render(<App/>, document.querySelector('#App'))