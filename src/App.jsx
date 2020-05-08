class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            gameArray: ['-','-','-',
                        '-','-','-',
                        '-','-','-'],
            playerTurn: 'X',
            computerTurn: false
            
        }
        
        this.markPosition = this.markPosition.bind(this);
        this.getMove = this.getMove.bind(this);
    }
    
    markPosition(posNumber){ // changing to X O in state
        let array = [...this.state.gameArray]; // clone the previous state
        if (array[posNumber] == '-'){ // if the position in the array is not filled with X or O then:
            array[posNumber] = this.state.playerTurn; //change that position into whose turn it is
            this.setState({gameArray: array}) 
            if (this.state.playerTurn == 'X'){ //change player's turn
                this.setState({playerTurn: 'O'})
                this.getMove(array.join(''),'O')//get next move 
            } else {
                this.setState({playerTurn: 'X'})
                this.getMove(array.join(''),'X')//get next move 
            };
            
        }
    }
    
    getMove(gameState, playerTurn){ //get moves from the API
        var req = new XMLHttpRequest();
        req.open("GET", "https://stujo-tic-tac-toe-stujo-v1.p.rapidapi.com/" + gameState +"/" + playerTurn);
        req.setRequestHeader("x-rapidapi-host", "stujo-tic-tac-toe-stujo-v1.p.rapidapi.com");
        req.setRequestHeader("x-rapidapi-key", "569596e8f8msh12917b46e6f5b82p1cac7cjsn78ef9cd98130");

        req.send();
        req.onload = function(){
            document.getElementById('test').innerHTML = req.responseText;
            var json = JSON.parse(req.responseText);
            let array = json.game.split(''); 
            array[json.recommendation] = playerTurn; //change the recommendation move into an array
            this.setState({gameArray: array})   //and setState to the array
            if (this.state.playerTurn == 'X'){ //change player's turn
                this.setState({playerTurn: 'O'})
            } else {
                this.setState({playerTurn: 'X'})
            };
            
    }.bind(this)
}

    
    render(){
        let square = this.state.gameArray.map((a,i) => (<Square content = {a} number = {i} markPosition = {this.markPosition}/>))
        return(
        <div>
            <div id = 'square-container'>
                {square}
            </div>
        </div>
            
        )
    }
}



class Square extends React.Component{
    constructor(props){
        super(props);
        
    }
    
    handleClick(){
        this.props.markPosition(this.props.number);    //send the position clicked to the main App
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