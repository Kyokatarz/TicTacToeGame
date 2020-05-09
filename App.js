var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            gameArray: ['-', '-', '-', '-', '-', '-', '-', '-', '-'],
            playerTurn: '',
            computerTurn: false,
            winner: ''

        };

        _this.markPosition = _this.markPosition.bind(_this);
        _this.getMove = _this.getMove.bind(_this);
        _this.checkWinCondition = _this.checkWinCondition.bind(_this);
        _this.handleCharacter = _this.handleCharacter.bind(_this);
        return _this;
    }
    //-------------CHARACTER CHOOSE---------------//
    //                                            //
    //--------------------------------------------//


    _createClass(App, [{
        key: 'handleCharacter',
        value: function handleCharacter(playerChoice) {
            var gameState = this.state.gameArray.join('');
            document.getElementById("main-menu").classList.toggle('fadeOut');
            if (playerChoice == 'O') {
                this.setState({ computerTurn: true,
                    playerTurn: 'X' }, this.getMove(gameState, 'X'));
            } else {
                this.setState({ playerTurn: "X" });
            }
        }

        //-------------MARK PLAYER TURN---------------//
        //                                            //
        //--------------------------------------------//

    }, {
        key: 'markPosition',
        value: function markPosition(posNumber) {
            var _this2 = this;

            // mark the Move of the player
            var array = [].concat(_toConsumableArray(this.state.gameArray)); // clone the previous state
            if (array[posNumber] == '-') {
                // if the position in the array is not filled with X or O then:
                array[posNumber] = this.state.playerTurn; //change that position into whose turn it is
                this.setState({ gameArray: array }, function () {
                    return _this2.checkWinCondition();
                });

                if (this.state.playerTurn == 'X') {
                    //change player's turn
                    this.setState({ playerTurn: 'O', computerTurn: true });

                    this.getMove(array.join(''), 'O'); //get next move 
                } else {
                    this.setState({ playerTurn: 'X', computerTurn: true });
                    this.getMove(array.join(''), 'X'); //get next move 
                };
            }
        }

        //-------------GET SUGGESTED MOVE-------------//
        //                                            //
        //--------------------------------------------//

    }, {
        key: 'getMove',
        value: function getMove(gameState, playerTurn) {
            //get moves from the API
            var req = new XMLHttpRequest();
            req.open("GET", "https://stujo-tic-tac-toe-stujo-v1.p.rapidapi.com/" + gameState + "/" + playerTurn);
            req.setRequestHeader("x-rapidapi-host", "stujo-tic-tac-toe-stujo-v1.p.rapidapi.com");
            req.setRequestHeader("x-rapidapi-key", "569596e8f8msh12917b46e6f5b82p1cac7cjsn78ef9cd98130");

            req.send();
            req.onload = function () {
                var _this3 = this;

                document.getElementById('test').innerHTML = req.responseText;
                var json = JSON.parse(req.responseText);
                var array = json.game.split('');
                array[json.recommendation] = playerTurn; //change the recommendation move into an array           
                this.setState({ gameArray: array }, function () {
                    return _this3.checkWinCondition();
                }); //and setState to the array
                if (this.state.playerTurn == 'X') {
                    //change player's turn
                    this.setState({ playerTurn: 'O', computerTurn: false });
                } else {
                    this.setState({ playerTurn: 'X', computerTurn: false });
                };
            }.bind(this);
        }
        //-------------CHECK WIN CONDITION---------------//
        //                                            //
        //--------------------------------------------//

    }, {
        key: 'checkWinCondition',
        value: function checkWinCondition() {

            var winConfig = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]];
            var playerList = ['X', 'O'];
            for (var i = 0; i < playerList.length; i++) {
                var gameState = this.state.gameArray;

                if (this.state.winner != '') break;

                for (var j = 0; j < winConfig.length; j++) {

                    if (gameState[winConfig[j][0]] == playerList[i] // check if the player have won
                    && gameState[winConfig[j][1]] == playerList[i] && gameState[winConfig[j][2]] == playerList[i]) {

                        this.setState({ winner: playerList[i] });
                        break;
                    }
                }
            }
        }

        //---------------RENDERING APP---------------------//

    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var square = this.state.gameArray.map(function (a, i) {
                return React.createElement(Square, { content: a,
                    number: i,
                    markPosition: _this4.markPosition,
                    winner: _this4.state.winner,
                    computerTurn: _this4.state.computerTurn });
            });
            return React.createElement(
                'div',
                { id: 'container' },
                React.createElement(
                    'div',
                    { id: 'main-menu' },
                    React.createElement(
                        'p',
                        null,
                        ' Choose your character: '
                    ),
                    React.createElement(
                        'div',
                        { onClick: function onClick() {
                                return _this4.handleCharacter('X');
                            } },
                        'X'
                    ),
                    React.createElement(
                        'div',
                        { onClick: function onClick() {
                                return _this4.handleCharacter('O');
                            } },
                        'O'
                    )
                ),
                React.createElement(
                    'div',
                    { id: 'winner' },
                    this.state.winner
                ),
                React.createElement(
                    'div',
                    { id: 'square-container' },
                    square
                )
            );
        }
    }]);

    return App;
}(React.Component);

//---------------RENDERING SQUARES---------------------//

var Square = function (_React$Component2) {
    _inherits(Square, _React$Component2);

    function Square(props) {
        _classCallCheck(this, Square);

        return _possibleConstructorReturn(this, (Square.__proto__ || Object.getPrototypeOf(Square)).call(this, props));
    }

    _createClass(Square, [{
        key: 'handleClick',
        value: function handleClick() {
            if (this.props.winner == '') {
                if (this.props.computerTurn == false) {
                    this.props.markPosition(this.props.number); //send the position clicked to the main App
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'squares', onClick: this.handleClick.bind(this) },
                React.createElement(
                    'p',
                    null,
                    this.props.content
                )
            );
        }
    }]);

    return Square;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.querySelector('#App'));