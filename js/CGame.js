function CGame(oData){
    
    var _bUpdatesSuspended = true;
    var _iCardsNum = 4;
    var _iCurrentLevel = 0;
    var _iFlippedCards = 0;
    var _iTimeLeft; // in ms
    var _iTimeElapsBetweenMatching;
    var _iScore = 0;
    var _iWickets = 0;
    var _iCurMatchMult;

    var _iLevelScore = 0;
    var _iLevelTimeBonus = 0;
    
    var _aCards = [];
    var _oBgContainer;
    var _oInterface;
    var _oNextLevelUI;
    var _oGameOverUI;
    var _oVictoryUI;
    var _oAttachCard;
    var peek;

    this._init = function(){

        peek = oData.show_cards !== 0;

        // load spritesheet
        console.log("in game");
        console.log(selectedTeam);

        var oSpriteSheetPNG = s_oSpriteLibrary.getSprite('card_' + selectedTeam);
        var oSpriteSheetData = {
                                    images: [oSpriteSheetPNG],
                                    frames: {width: CARD_WIDTH, height: CARD_HEIGHT, regX: CARD_WIDTH/2, regY: CARD_HEIGHT/2},
                                    animations: { card0: [0],
                                                    card1: [1],
                                                    card2: [2],
                                                    card3: [3],
                                                    card4: [4],
                                                    card5: [5],
                                                    card6: [6],
                                                    card7: [7],
                                                    card8: [9],
                                                    card9: [10],
                                                    card10: [11],
                                                    card11: [12],
                                                    card12: [13],
                                                    card13: [14],
                                                    card14: [15],
                                                    card15: [16],
                                                    back: [17]}
        }
        this.spriteSheet = new createjs.SpriteSheet(oSpriteSheetData);

        // Level background
        _oBgContainer = new createjs.Container();
        s_oStage.addChild(_oBgContainer);
		
		_oAttachCard = new createjs.Container();
        s_oStage.addChild(_oAttachCard);
		
        // setup GUI
        _oInterface = new CInterface(formatTime(_iTimeLeft));
        _oNextLevelUI = new CNextLevel();
        _oGameOverUI = new CGameOver();
        _oVictoryUI = new CVictory();

        // level & GUI setup
        this.nextLevel();
    };

    this.unload = function(bFromExit){
        for (var i = 0; i < _aCards.length; i++) {
            _aCards[i].unload();
        };

        s_oStage.removeAllChildren();
        _oInterface.unload();
        
        if(bFromExit){
            $(s_oMain).trigger("end_level",_iCurrentLevel);
        }
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("share_event",_iScore);
        
        s_oMain.gotoMenu();
    };

    this.cardClicked = function(oCard,sCardType){
        if (oCard.isFolded() === true && _bUpdatesSuspended === false) {
            if (_iFlippedCards < 2) {
                oCard.flipCard();
            } else {
            	//playsound noball and wide
            } 
        };
    };

    this.addFlippedCard = function(){
        _iFlippedCards++;
        if (_iFlippedCards === 2 && _bUpdatesSuspended === false) {
            balls++;
            _oInterface.refreshBalls(this.oversFormat());
            this.checkMatching();
        };
    };

    this.oversFormat = function() {
       return parseInt(balls / 6) + "." + parseInt(balls % 6);
    };

    this.checkMatching = function(){
        var foldedCardsId = [];
        var foldedCardsType = [];

        for (var i = 0; i < _iCardsNum; i++) {
            if (_aCards[i].isFolded() === false) {
                foldedCardsType.push(_aCards[i].getType());
                foldedCardsId.push(i);
            };
        };

        if (foldedCardsType[0] === foldedCardsType[1]) {
            var iMult = 1;
            if(_iTimeElapsBetweenMatching < TIME_FOR_MATCH_MULT) {
                    //PLAYER GET BONUS MULTIPLIER
                    _iTimeElapsBetweenMatching = 0;
                    _oInterface.showMultiplier(_iCurMatchMult);

                    iMult = _iCurMatchMult;

                    _iCurMatchMult++;
            } else{
                    _iCurMatchMult = 2;
                    _iTimeElapsBetweenMatching = 0;
            }

            playSound("right", 1, false);
			
            _aCards[foldedCardsId[0]].eliminateCard();
            _aCards[foldedCardsId[1]].eliminateCard();

            _aCards.splice(foldedCardsId[0],1);
            _aCards.splice(foldedCardsId[1] - 1,1);

            _iCardsNum -= 2;

            _iScore += (SCORE_MATCH_CARD * iMult);
            _iLevelScore += (SCORE_MATCH_CARD * iMult);

            _oInterface.refreshScore(_iScore + "/" + _iWickets);


            if (_iCardsNum === 0 &&  _iCurrentLevel <= s_aCardsPerLevel.length) {
                _bUpdatesSuspended = true;
				var oParent =  this;
                setTimeout(function(){oParent.checkVictory();}, 1000);
            };

        } else {
            var out1 = _aCards[foldedCardsId[0]].incorrect();
            _aCards[foldedCardsId[0]].flipCard();
            _aCards[foldedCardsId[0]].clickListener();

            var out2 = _aCards[foldedCardsId[1]].incorrect();
            _aCards[foldedCardsId[1]].flipCard();
            _aCards[foldedCardsId[1]].clickListener();

            if (out1 >= 3 || out2 >= 3) {
                _iWickets++;
                _oInterface.refreshScore(_iScore + "/" + _iWickets);
                playSound("win", 1, false);
            }
            if (_iWickets == 10) {
                _bUpdatesSuspended = true;
                _iTimeLeft = 0;

                playSound("game_over", 1, false);
                _oGameOverUI.display(_iScore);

                _iCurrentLevel = 1;
            }
    };

        _iFlippedCards = 0;
    };

    this.checkVictory = function(){
        _bUpdatesSuspended = true;

        _iLevelTimeBonus = Math.round((_iTimeLeft / 1000) * SCORE_TIME_LEFT_MULT);

        _iScore += _iLevelTimeBonus;
		
        // Update Interface
        _oInterface.refreshScore(_iScore + "/" + _iWickets);
        
        $(s_oMain).trigger("end_level",_iCurrentLevel);
        if (_iCurrentLevel < s_aCardsPerLevel.length) {
                playSound("next_level", 1, false);
                _oNextLevelUI.display(_iLevelScore,
                    _iLevelTimeBonus, this.oversFormat(),
                    _iScore + "/" + _iWickets,
                    _iCurrentLevel);
        }else{
                playSound("win", 1, false);
                _oVictoryUI.display(_iScore);
        }
    };
	
    this.nextLevel = function(){
        _iCurrentLevel++;
        $(s_oMain).trigger("start_level",_iCurrentLevel);
        _oBgContainer.removeAllChildren();

        var bg = createBitmap(s_oSpriteLibrary.getSprite("bg_" + ((Math.floor(Math.random()*NUM_BACKGROUNDS))+1)));
        _oBgContainer.addChild(bg);

        // level setup
        var _oLevelData = CLevels(_iCurrentLevel);
        _iCardsNum = _oLevelData.cardsNum;
        _iTimeLeft = _oLevelData.timeAllotted;
	_iTimeElapsBetweenMatching = TIME_FOR_MATCH_MULT;

        var aChosenCards = [];
		
		//same set of cards for lower level? //CHANGE
        for (var i = 0; i < _iCardsNum/2; i++) {
            aChosenCards[i] = i;
            aChosenCards[i+_iCardsNum/2] = i; 
        };

        for (var i = 0; i < _iCardsNum; i++) {
            var iChosenCard = Math.floor(Math.random()*aChosenCards.length);
            var sCardType = "card" + aChosenCards[iChosenCard];

            _aCards[i] = new CCard(_oLevelData.cardsPos[i][0],
                                   _oLevelData.cardsPos[i][1],
								    sCardType,
								   _oLevelData.cardZoomFactor,
								   _oAttachCard, peek);

            aChosenCards.splice(iChosenCard,1); 
        };

        // Score management
        _iLevelScore = 0;
        _iLevelTimeBonus = 0;
        _iGameOverScore = 0;
        _iCurMatchMult = 2;

        _bUpdatesSuspended = false;
    };

    this.suspendUpdates = function(){
        _bUpdatesSuspended = true;
    };

    this.restartUpdates = function(){
        if (_iCardsNum > 0) {
            _bUpdatesSuspended = false;
        };
    };
	
    this.update = function(){
        if(_bUpdatesSuspended){
                return;
        }
		
        // time mngmnt
        _iTimeLeft -= s_iTimeElaps;
		
        _iTimeElapsBetweenMatching += s_iTimeElaps;
        if(_iTimeLeft < 0){
            _bUpdatesSuspended = true;
            _iTimeLeft = 0;

            playSound("game_over", 1, false);
            _oGameOverUI.display(_iScore);

            _iCurrentLevel = 1;
        }else{
            _oInterface.update(formatTime(_iTimeLeft));
        }
    };

    this.spriteSheet = {};
    
    s_oGame = this;
	
	SCORE_MATCH_CARD = oData.score_match_card;
	SCORE_TIME_LEFT_MULT = oData.score_time_left_mult;
	TIME_FOR_MATCH_MULT = oData.time_match_mult;
	s_aCardsPerLevel = oData.card_per_level;
	s_aSecsPerLevel = oData.time_level;
	TIME_SHOW_CARDS = oData.show_cards * 1000;
	ENABLE_FULLSCREEN = oData.fullscreen;
	
    this._init();
}

var s_aCardsPerLevel;
var s_aSecsPerLevel;
var s_oGame;
var balls = 0;