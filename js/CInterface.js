function CInterface(szTimeLeft) {
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosScoreText;
    var _pStartPosTimeText;
    var _pStartPosFullscreen;

    var _oTimeLeft;
    var _oBallsFormat;
    var _oTimeLeft;
    var _oScore;
    var _oAudioToggle;
    var _szTimeLeft;
    var _oButExit;
    var _oScoreMultText;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    //modification to score card and other stuff needs to happen here
    this._init = function (szTimeLeft) {

        _pStartPosTimeText = {x: 30, y: 75};
        _szTimeLeft = TEXT_TIMELEFT + szTimeLeft;
        _oTimeLeft = new createjs.Text(_szTimeLeft, "36px " + FONT_GAME, "#fff");
        _oTimeLeft.x = _pStartPosTimeText.x;
        _oTimeLeft.y = _pStartPosTimeText.y;
        _oTimeLeft.textBaseline = "alphabetic";
        _oTimeLeft.shadow = new createjs.Shadow("#000000", 2, 2, 2);
        s_oStage.addChild(_oTimeLeft);

        _oBallsFormat = new createjs.Text(TEXT_OVERS + " 0.0", "39px " + FONT_GAME, "#fff");
        _oBallsFormat.x = 30;
        _oBallsFormat.y = 180;
        _oBallsFormat.textAlign = "left";
        _oBallsFormat.textBaseline = "alphabetic";
        _oBallsFormat.shadow = new createjs.Shadow("#000000", 2, 2, 2);
        s_oStage.addChild(_oBallsFormat);

        _pStartPosScoreText = {x: CANVAS_WIDTH / 2, y: 75};
        _szScore = TEXT_SCORE + 0 + "/" + 0;
        _oScore = new createjs.Text(_szScore, "36px " + FONT_GAME, "#fff");
        _oScore.x = _pStartPosScoreText.x;
        _oScore.y = _pStartPosScoreText.y;
        _oScore.textAlign = "center";
        _oScore.textBaseline = "alphabetic";
        _oScore.shadow = new createjs.Shadow("#000000", 2, 2, 2);
        s_oStage.addChild(_oScore);

        //this can be a decorator but who did decorator made you money>?
        _oScoreMultText = new createjs.Text("X2", "150px " + FONT_GAME, "#fff");
        _oScoreMultText.textAlign = "center";
        _oScoreMultText.textBaseline = "alphabetic";
        _oScoreMultText.x = CANVAS_WIDTH / 2;
        _oScoreMultText.y = CANVAS_HEIGHT / 2;
        _oScoreMultText.shadow = new createjs.Shadow("#000000", 2, 2, 2);
        _oScoreMultText.scaleX = _oScoreMultText.scaleY = 0.1;
        _oScoreMultText.visible = false;
        s_oStage.addChild(_oScoreMultText);

        var exitSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (exitSprite.width / 2) - 20, y: (exitSprite.height / 2) + 20};
        var oSprite2 = s_oSpriteLibrary.getSprite('audio_icon');
        _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite2.width / 2) * 2 - 10, y: (oSprite2.height / 2) + 20};

        var playStoreSprite = s_oSpriteLibrary.getSprite('playStore');
        var oPlayStore = {x: CANVAS_WIDTH - playStoreSprite.width, y: CANVAS_HEIGHT - playStoreSprite.height}; //{ x:CANVAS_WIDTH - (playStoreSprite.width/2)*2 - 70, y:(playStoreSprite.height/2) + 20 };
        var playStoreButton = new CGfxButton(oPlayStore.x, oPlayStore.y, playStoreSprite, s_oStage);
        playStoreButton.addEventListener(ON_MOUSE_DOWN, function () {
            document.location.href = PLAY_STORE_URL;
        }, this);

        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, exitSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite2, s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            _pStartPosFullscreen = {x: _pStartPosAudio.x - exitSprite.width - 20, y: _pStartPosAudio.y};
        } else {
            _pStartPosFullscreen = {x: _pStartPosExit.x - exitSprite.width - 20, y: _pStartPosExit.y};
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (ENABLE_FULLSCREEN === false) {
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && inIframe() === false) {
            var oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
        _oScore.y = _pStartPosScoreText.y + iNewY;

        _oTimeLeft.x = _pStartPosTimeText.x + iNewX;
        _oTimeLeft.y = _pStartPosTimeText.y + iNewY;

        _oButExit.setPosition(_pStartPosExit.x - iNewX, iNewY + _pStartPosExit.y);
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX, _pStartPosFullscreen.y + iNewY);
        }
    };

    this.unload = function () {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
        }
        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.unload();
        }
        _oButExit.unload();

        s_oStage.removeChild(_oTimeLeft);
        s_oStage.removeChild(_oScore);
        s_oInterface = null;
    };

    this.refreshBalls = function (balls) {
        console.log("balls received " + balls);
        _oBallsFormat.text = TEXT_OVERS + " " + balls;
    };

    this.refreshScore = function (iScore) {
        _oScore.text = TEXT_SCORE + iScore;
    };

    this.showMultiplier = function (iMult) {
        _oScoreMultText.text = "X" + iMult;
        _oScoreMultText.visible = true;

        createjs.Tween.get(_oScoreMultText).to({scaleX: 1, scaleY: 1}, 300, createjs.Ease.cubicOut).call(function () {
            createjs.Tween.get(_oScoreMultText).to({
                scaleX: 0.1,
                scaleY: 0.1
            }, 300, createjs.Ease.cubicIn).call(function () {
                _oScoreMultText.visible = false;
            });
        });
    };

    this._openPlayStore = function () {
        document.location.href = "https://play.google.com/store/apps/details?id=org.gnuzero.memory";
    };

    this.updateBalls = function (balls) {

    };

    this.update = function (szTimeLeft) {
        _oTimeLeft.text = TEXT_TIMELEFT + szTimeLeft;
    };

    this._onExit = function () {
        s_oGame.unload(true);
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onFullscreenRelease = function () {
        if (s_bFullscreen) {
            _fCancelFullScreen.call(window.document);
            s_bFullscreen = false;
        } else {
            _fRequestFullScreen.call(window.document.documentElement);
            s_bFullscreen = true;
        }

        sizeHandler();
    };


    s_oInterface = this;

    this._init(szTimeLeft);

    return this;
}

var s_oInterface = null;
