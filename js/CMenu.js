function CMenu(oData) {
    var _pStartPosAudio;
    var _pStartPosPlay;
    var _pStartPosCredits;
    var _pStartPosFullscreen;

    var _oBg;
    var _oData;
    var _oButPlay;
    var _oButCredits;
    var _oAudioToggle;
    var _oFade;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _difficulty = [];

    this._drawLeaderBoard = function(score) {
        var text = new createjs.Text("Top Score", "30px " + FONT_GAME, "#ffffff");
        var bounds = text.getBounds();
        text.x = ((CANVAS_WIDTH / 2) + 375);
        text.y = 200;
        text.textBaseline = "alphabetic";
        text.shadow = new createjs.Shadow("#000000", 5, 5, 10);
        text.scale = 2;
        s_oStage.addChild(text);

        var verticalPos = 250;
        for (var i = 0; i < score.length; i++) {
            var oSprite = s_oSpriteLibrary.getSprite('player_name');
            new CTextButton(((CANVAS_WIDTH / 2) + 400), verticalPos, oSprite, score[i].name, FONT_GAME, "White", "25", s_oStage);

            var oSprite = s_oSpriteLibrary.getSprite('score_bg');
            new CTextButton(((CANVAS_WIDTH / 2) + 650), verticalPos, oSprite, score[i].score, FONT_GAME, "White", "25", s_oStage);
            verticalPos += 50;
        }
        // return {i: i, oSprite: oSprite, oSprite: oSprite};
    };

    this._init = function ()
    {
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);

        _pStartPosPlay = {
            x: (CANVAS_WIDTH / 2),
            y: CANVAS_HEIGHT - 70
        };


        var __ret = this._drawLeaderBoard(score);

        /*var i = __ret.i;
        var oSprite = __ret.oSprite;
        var oSprite = __ret.oSprite;*/

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {
                x: CANVAS_WIDTH - (oSprite.width * 1.1),
                y: oSprite.height + 10
            };
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSprite.width / 2 - 20, y: oSprite.height / 2 + 40};
        } else {
            _pStartPosFullscreen = {x: CANVAS_WIDTH - (oSprite.height / 2) - 20, y: (oSprite.height / 2) + 40};
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (ENABLE_FULLSCREEN === false) {
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && inIframe() === false) {
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');


            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oFade.visible = false;
        });

        var bitmap = new createjs.Bitmap("sprites/flag-lk.png");
        bitmap.x = CANVAS_WIDTH / 2 / 4;
        bitmap.y = 200;
        bitmap.on("click", this._onButPlayRelease, this, false, "lk");
        s_oStage.addChild(bitmap);

        var bitmap = new createjs.Bitmap("sprites/flag-pk.png");
        bitmap.x = (CANVAS_WIDTH / 2 / 4) + 300;
        bitmap.y = 200;
        bitmap.on("click", this._onButPlayRelease, this, false, "pk");
        s_oStage.addChild(bitmap);

        var bitmap = new createjs.Bitmap("sprites/flag-all.png");
        bitmap.x = (CANVAS_WIDTH / 2 / 4) + 600;
        bitmap.y = 200;
        bitmap.on("click", this._onButPlayRelease, this, false, 'all');
        s_oStage.addChild(bitmap);

        var bitmap = new createjs.Bitmap("sprites/flag-in.png");
        bitmap.x = CANVAS_WIDTH / 2 / 4;
        bitmap.y = 360;
        bitmap.on("click", this._onButPlayRelease, this, false, "in");
        s_oStage.addChild(bitmap);

        var bitmap = new createjs.Bitmap("sprites/flag-bd.png");
        bitmap.x = (CANVAS_WIDTH / 2 / 4) + 300;
        bitmap.y = 360;
        bitmap.on("click", this._onButPlayRelease, this, false, "bd");
        s_oStage.addChild(bitmap);


        var spCheck = s_oSpriteLibrary.getSprite('checkboxen');
        var imageUnchecked = new createjs.Bitmap(spCheck);
        imageUnchecked.sourceRect = new createjs.Rectangle(0, 0, 34, 29);
        imageUnchecked.x =  (CANVAS_WIDTH / 2) - 250;
        imageUnchecked.y = CANVAS_HEIGHT - 480;
        imageUnchecked.on('click', function () {
            s_oStage.removeChild(imageUnchecked);
            s_oStage.addChild(imageChecked);
            $(s_oMain).trigger('toggle_peek', {peek: 1});
        }, this);

        var imageChecked = new createjs.Bitmap(spCheck);
        imageChecked.sourceRect = new createjs.Rectangle(34, 0, 34, 29);
        imageChecked.x =  (CANVAS_WIDTH / 2) - 250;
        imageChecked.y = CANVAS_HEIGHT - 480;
        imageChecked.on('click', function () {
                    s_oStage.addChild(imageUnchecked);
                    s_oStage.removeChild(imageChecked);
                    $(s_oMain).trigger('toggle_peek', {peek: 0});
            }, this);

        if (this._oData.show_cards === 1) s_oStage.addChild(imageChecked);
        else s_oStage.addChild(imageUnchecked);

        var text = new createjs.Text("Peek before start", "30px " + FONT_GAME, "#ffffff");
        var bounds = text.getBounds();
        text.x = ((CANVAS_WIDTH / 2) - 210);
        text.y = CANVAS_HEIGHT - 450;
        text.textBaseline = "alphabetic";
        text.shadow = new createjs.Shadow("#000000", 5, 5, 10);
        text.scale = 2;
        s_oStage.addChild(text);


        var gap = 0; var _that = this;

        for (var i = 0; i < 3; i++) {
            _that._difficulty[i].name = i;
            _that._difficulty[i].on("click", function (e) {
                var idx = e.target.name;
                if (_that._difficulty[idx].color === "#ff00ff") {
                    _that._difficulty[idx].color = "#ffffff";
                } else {
                    _that._difficulty[idx].color = "#ff00ff";
                    _that._oData.diff_level_name = idx; //.name;
                    $(s_oMain).trigger("change_difficulty", {level: idx});
                }
                var ct = [0, 1, 2];
                ct.forEach(function (value) {
                    var _color = "#ffffff";
                    if (_that._oData.diff_level_name === value) {
                        _color = "#ff00ff";
                    }
                    _that._difficulty[value].color = _color;
                });
            }, this);
        }

        _that._difficulty.forEach(function (v) {
            v.x = ((CANVAS_WIDTH / 2) - 400 + (++gap * 150 ));
            v.y = CANVAS_HEIGHT - 550;
            v.textBaseline = "alphabetic";
            v.shadow = new createjs.Shadow("#000000", 5, 5, 10);
            v.scale = 2;
            s_oStage.addChild(v);
        });


        /*var bitmap = new createjs.Bitmap("sprites/flag-in.png");
        bitmap.x = CANVAS_WIDTH / 2 / 4;
        bitmap.y = 400;
        bitmap.on("click", this._onButPlayRelease, this, 'in');
        s_oStage.addChild(bitmap);

        var bitmap = new createjs.Bitmap("sprites/flag-all.png");
        bitmap.x = (CANVAS_WIDTH / 2 / 4) + 300;
        bitmap.y = 400;
        bitmap.on("click", this._onButPlayRelease, this, false, 'all');
        s_oStage.addChild(bitmap);
*/
        //_oButPlay = new CTextButton(_pStartPosPlay.x,_pStartPosPlay.y,oSprite, TEXT_PLAY, FONT_GAME,"White","24",s_oStage);
        //_oButPlay.setScale(2);
        //_oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);

        var text = new createjs.Text("Select Team", "60px " + FONT_GAME, "#ffffff");
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

        var text = new createjs.Text("All rights reserved  2018", "20px " + FONT_GAME, "#ffffff");
        var bounds = text.getBounds();
        text.x = (CANVAS_WIDTH / 2) - (bounds.width / 2);
        text.y = CANVAS_HEIGHT - 50;
        text.textBaseline = "alphabetic";
        text.shadow = new createjs.Shadow("#000000", 5, 5, 10);
        text.scale = 2;
        s_oStage.addChild(text);
        //this.refreshButtonPos(s_iOffsetX,s_iOffsetY);

        /*var bitmap = new createjs.Bitmap("sprites/logo.png");
        bitmap.x = 20;
        bitmap.y = CANVAS_HEIGHT - 150;
        bitmap.addEventListener("click", function () {
            new CCredits();
            return true;
        });
        s_oStage.addChild(bitmap);*/

        /*var shapeNotice  = new createjs.Shape();
        shapeNotice.set({alpha: 0.5});
        shapeNotice.graphics.beginFill("#acbade").drawRect(150, 200, 500, 700);
        s_oStage.addChild(shapeNotice);*/

        /*var text = new createjs.Text("ක්‍රිකටි ක්‍රිඩාව සහ මතකය \nක්‍රිඩා දෙක ආශ්‍රිතව සැකසූ \nනිර්මාණයකි. \n\n\n\nපරිගණකයේ, ජංගම දුරකතන \nසහ ටැබි යන සියල්ලෙන්ම \nවිනදය ලැබිය හැක\n\n\n\nදකුණු පස කොඩිමගින් ඔබට \nකැමති කණ්ඩායම තොරාගන්න ", "35px "+FONT_GAME, "#ffffff");
        var bounds = text.getBounds();
        text.x = 170;
        text.y = 250;
        text.textBaseline = "alphabetic";
        text.shadow = new createjs.Shadow("#000000", 5, 5, 10);
        text.scale = 2;
        s_oStage.addChild(text);*/

        //var noticeBoard = new createjs.Graphics.Rectangle(30, 30, 400, 500);
        //noticeBoard.fill("red");
        //s_oStage.addChild(noticeBoard);


        var playStoreSprite = s_oSpriteLibrary.getSprite('playStore');
        var oPlayStore = {x: CANVAS_WIDTH - playStoreSprite.width, y: CANVAS_HEIGHT - playStoreSprite.height}; //{ x:CANVAS_WIDTH - (playStoreSprite.width/2)*2 - 70, y:(playStoreSprite.height/2) + 20 };
        var playStoreButton = new CGfxButton(oPlayStore.x, oPlayStore.y, playStoreSprite, s_oStage);
        playStoreButton.addEventListener(ON_MOUSE_DOWN, function () {
            document.location.href = PLAY_STORE_URL;
        }, this);
        //s_oStage.addChild(playStoreButton);

    };


    this.unload = function () {
        /* _oButPlay.unload();
         _oButPlay = null;*/
        //_oButCredits.unload();

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.unload();
        }
        s_oStage.removeAllChildren();
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
        //_oButPlay.setPosition(_pStartPosPlay.x,_pStartPosPlay.y - iNewY);
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX, _pStartPosFullscreen.y + iNewY);
        }
        // _oButCredits.setPosition(_pStartPosCredits.x + iNewX, _pStartPosCredits.y + iNewY);
    };

    this._onButPlayRelease = function (me, team) {
        this.unload();
        selectedTeam = team;
        $(s_oMain).trigger("start_session");
        s_oMain.gotoGame();
        s_oMenu = null;
    };

    this._onButCreditsRelease = function () {
        new CCredits();
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

    s_oMenu = this;
    s_oMenu._oData = oData;
    s_oMenu._difficulty = [
        new createjs.Text("o Easy", "35px " + FONT_GAME, "#ff00ff"),
        new createjs.Text("o Avg", "35px " + FONT_GAME, "#ffffff"),
        new createjs.Text("o Hard", "35px " + FONT_GAME, "#ffffff")
    ];
    this._init(oData);

    $(this).on("leaderboard_update", function (e, score) {
       this._drawLeaderBoard(score._s);
    });
}

var s_oMenu = null;
var selectedTeam = 1;