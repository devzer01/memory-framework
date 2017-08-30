function CMenu(){
    var _pStartPosAudio;
    var _pStartPosPlay;
    var _pStartPosCredits;
	var _pStartPosFullscreen;
    
    var _oBg;
    var _oButPlay;
    var _oButCredits;
    var _oAudioToggle;
    var _oFade;
	var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function()
    {
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);
	
	    _pStartPosPlay = {
	                        x: (CANVAS_WIDTH/2),
                            y:  CANVAS_HEIGHT - 70
	                     };



        //_oButPlay = new CTextButton(_pStartPosPlay.x,_pStartPosPlay.y,oSprite, TEXT_PLAY, FONT_GAME,"White","24",s_oStage);
	    //_oButPlay.setScale(2);
        //_oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        
/*        var oSpriteCredits = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosCredits = {
            x:oSpriteCredits.width  /2 + 10,
            y:oSpriteCredits.height /2 + 40};
        _oButCredits = new CGfxButton(_pStartPosCredits.x, _pStartPosCredits.y, oSpriteCredits, s_oStage);
        _oButCredits.addEventListener(ON_MOUSE_UP, this._onButCreditsRelease, this);*/

        var text = new createjs.Text("ලෝකසූරයන්", "30px "+FONT_GAME, "#ffffff");
        var bounds = text.getBounds();
        text.x =((CANVAS_WIDTH / 2) + 375);
        text.y = 200;
        text.textBaseline = "alphabetic";
        text.shadow = new createjs.Shadow("#000000", 5, 5, 10);
        text.scale = 2;
        s_oStage.addChild(text);

        var verticalPos = 250;
        for (var i = 0; i < 14; i++) {
            var oSprite = s_oSpriteLibrary.getSprite('player_name');
            new CTextButton(((CANVAS_WIDTH / 2) + 400), verticalPos, oSprite, "Player " + i, FONT_GAME, "White", "18", s_oStage);

            var oSprite = s_oSpriteLibrary.getSprite('score_bg');
            new CTextButton(((CANVAS_WIDTH / 2) + 650), verticalPos, oSprite, parseInt((Math.random() * 100)) + "/" + parseInt(Math.random() * 10), FONT_GAME, "White", "18", s_oStage);

            verticalPos += 50;
        }

        /*var oSprite = s_oSpriteLibrary.getSprite('player_name');
        new CTextButton(((CANVAS_WIDTH / 2) + 350), 300, oSprite, "Player 1", FONT_GAME,"White","18", s_oStage);

        var oSprite = s_oSpriteLibrary.getSprite('score_bg');
        new CTextButton(((CANVAS_WIDTH / 2) + 600), 300, oSprite, "35/3", FONT_GAME,"White","18", s_oStage);

        var oSprite = s_oSpriteLibrary.getSprite('player_name');
        new CTextButton(((CANVAS_WIDTH / 2) + 350), 350, oSprite, "Player 1", FONT_GAME,"White","18", s_oStage);

        var oSprite = s_oSpriteLibrary.getSprite('score_bg');
        new CTextButton(((CANVAS_WIDTH / 2) + 600), 350, oSprite, "35/3", FONT_GAME,"White","18", s_oStage);*/

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {
                x: CANVAS_WIDTH - (oSprite.height/2)- 20,
                y: (oSprite.height/2) + 40};
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);   
            _pStartPosFullscreen = {x:_pStartPosAudio.x-oSprite.width/2 - 20,y:oSprite.height/2 + 40};
        }else{
             _pStartPosFullscreen = {x: CANVAS_WIDTH - (oSprite.height/2)- 20, y: (oSprite.height/2) + 40};
	}
		
		var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
		
		if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && inIframe() === false){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
           

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
		
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){
            _oFade.visible = false;
        });

        var bitmap = new createjs.Bitmap("sprites/flag-lk.png");
        bitmap.x = (CANVAS_WIDTH / 2) - 100;
        bitmap.y = 200;
        s_oStage.addChild(bitmap);

        var bitmap = new createjs.Bitmap("sprites/flag-pk.png");
        bitmap.x = (CANVAS_WIDTH / 2) - 100;
        bitmap.y = 400;
        s_oStage.addChild(bitmap);

        var bitmap = new createjs.Bitmap("sprites/flag-bd.png");
        bitmap.x = (CANVAS_WIDTH / 2) - 100;
        bitmap.y = 600;
        s_oStage.addChild(bitmap);

        var bitmap = new createjs.Bitmap("sprites/flag-in.png");
        bitmap.x = (CANVAS_WIDTH / 2) - 100;
        bitmap.y = 800;
        s_oStage.addChild(bitmap);

        var text = new createjs.Text("කන්ඩායම තොරාගන්න", "60px "+FONT_GAME, "#ffffff");
        var bounds = text.getBounds();
        text.x = (CANVAS_WIDTH / 2) - (bounds.width / 2);
        text.y = 100;
        text.textBaseline = "alphabetic";
        text.shadow = new createjs.Shadow("#000000", 5, 5, 10);
        text.scale = 2;
        s_oStage.addChild(text);

/*        var text = new createjs.Text("කන්ඩායම තොරාගන්න", "60px "+FONT_GAME, "#ffffff");
        var bounds = text.getBounds();
        text.x = (CANVAS_WIDTH / 2) - (bounds.width / 2);
        text.y = 100;
        text.textBaseline = "alphabetic";
        text.shadow = new createjs.Shadow("#000000", 5, 5, 10);
        text.scale = 2;
        s_oStage.addChild(text);*/

        var text = new createjs.Text("පිටුව ප්‍රකාශකය ෝ සියලුම හිමිකම් සහිතයි 2017", "20px "+FONT_GAME, "#ffffff");
        var bounds = text.getBounds();
        text.x = (CANVAS_WIDTH / 2) - (bounds.width / 2);
        text.y = CANVAS_HEIGHT - 50;
        text.textBaseline = "alphabetic";
        text.shadow = new createjs.Shadow("#000000", 5, 5, 10);
        text.scale = 2;
        s_oStage.addChild(text);
	    //this.refreshButtonPos(s_iOffsetX,s_iOffsetY);

        var bitmap = new createjs.Bitmap("sprites/logo.png");
        bitmap.x = 20;
        bitmap.y = CANVAS_HEIGHT - 150;
        bitmap.addEventListener("click", function () {
            new CCredits();
            return true;
        });
        s_oStage.addChild(bitmap);

    };
    
    this.unload = function(){
        _oButPlay.unload(); 
        _oButPlay = null;
        _oButCredits.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && inIframe() === false){
            _oButFullscreen.unload();
        }
        s_oStage.removeAllChildren();
    };
	
    this.refreshButtonPos = function(iNewX,iNewY) {
        _oButPlay.setPosition(_pStartPosPlay.x,_pStartPosPlay.y - iNewY);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && inIframe() === false){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        }
        _oButCredits.setPosition(_pStartPosCredits.x + iNewX,_pStartPosCredits.y + iNewY);
    };
    
    this._onButPlayRelease = function(){
        this.unload();
        $(s_oMain).trigger("start_session");
        s_oMain.gotoGame();
	    s_oMenu = null;
    };
    
    this._onButCreditsRelease = function(){
        new CCredits();
    };

    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
            _fCancelFullScreen.call(window.document);
            s_bFullscreen = false;
        }else{
            _fRequestFullScreen.call(window.document.documentElement);
            s_bFullscreen = true;
        }
        
        sizeHandler();
    };
	
	s_oMenu = this;
    
    this._init();
}

var s_oMenu = null;