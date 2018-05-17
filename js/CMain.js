function CMain(oData) {
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;

    var _oData;
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function () {
        s_oStage = new createjs.Stage("canvas");
        createjs.Touch.enable(s_oStage);

        s_bMobile = jQuery.browser.mobile;
        if (s_bMobile === false) {
            s_oStage.enableMouseOver(20);
        } else if(navigator.userAgent.match(/android/i)) {
            window.location.href = "https://play.google.com/store/apps/details?id=lk.pituwa.memory";
        }

        s_iPrevTime = new Date().getTime();

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", this._update);

        if (navigator.userAgent.match(/Windows Phone/i)) {
            DISABLE_SOUND_MOBILE = true;
        }

        s_oSpriteLibrary = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();

        _bUpdate = true;
    };

    this.soundLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);

        if (_iCurResource === RESOURCE_TO_LOAD) {
            _oPreloader.unload();

            this.gotoMenu();
        }
    };

    this._initSounds = function () {

        var aSoundsInfo = new Array();
        aSoundsInfo.push({path: './sounds/', filename: 'card', loop: false, volume: 1, ingamename: 'card'});
        aSoundsInfo.push({path: './sounds/', filename: 'next_level', loop: false, volume: 1, ingamename: 'next_level'});
        aSoundsInfo.push({path: './sounds/', filename: 'game_over', loop: false, volume: 1, ingamename: 'game_over'});
        aSoundsInfo.push({path: './sounds/', filename: 'win', loop: false, volume: 1, ingamename: 'win'});
       /* aSoundsInfo.push({path: './sounds/', filename: 'right1', loop: false, volume: 1, ingamename: 'right1'});
        aSoundsInfo.push({path: './sounds/', filename: 'right2', loop: false, volume: 1, ingamename: 'right2'});
        aSoundsInfo.push({path: './sounds/', filename: 'right3', loop: false, volume: 1, ingamename: 'right3'});*/
        aSoundsInfo.push({path: './sounds/', filename: 'click', loop: false, volume: 1, ingamename: 'click'});

        RESOURCE_TO_LOAD += aSoundsInfo.length;

        s_aSounds = new Array();
        for (var i = 0; i < aSoundsInfo.length; i++) {
            s_aSounds[aSoundsInfo[i].ingamename] = new Howl({
                src: [aSoundsInfo[i].path + aSoundsInfo[i].filename + '.mp3', aSoundsInfo[i].path + aSoundsInfo[i].filename + '.ogg'],
                autoplay: false,
                preload: true,
                loop: aSoundsInfo[i].loop,
                volume: aSoundsInfo[i].volume,
                onload: s_oMain.soundLoaded()
            });
        }

    };

    this._loadImages = function () {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
        s_oSpriteLibrary.addSprite("but_menu_bg", "./sprites/but_menu_bg.png");
        s_oSpriteLibrary.addSprite("player_name", "./sprites/player-name.png");
        s_oSpriteLibrary.addSprite("score_bg", "./sprites/score-bg.png");
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("playStore","./sprites/play.png");
        s_oSpriteLibrary.addSprite("bg_1", "./sprites/bg_1.jpg");
        s_oSpriteLibrary.addSprite("bg_2", "./sprites/bg_2.jpg");
        s_oSpriteLibrary.addSprite("bg_3", "./sprites/bg_3.jpg");
        s_oSpriteLibrary.addSprite("bg_4", "./sprites/bg_4.jpg");
        s_oSpriteLibrary.addSprite("bg_5", "./sprites/bg_5.jpg");
        s_oSpriteLibrary.addSprite("bg_6", "./sprites/bg_6.jpg");
        s_oSpriteLibrary.addSprite("bg_7", "./sprites/bg_7.jpg");
        s_oSpriteLibrary.addSprite("bg_8", "./sprites/bg_8.jpg");
        s_oSpriteLibrary.addSprite("card_spritesheet", "./sprites/card_spritesheet.png");
        s_oSpriteLibrary.addSprite("card_lk",  "./sprites/card_lk.png");
        s_oSpriteLibrary.addSprite("card_pk", "./sprites/card_pk.png");
        s_oSpriteLibrary.addSprite("card_bd", "./sprites/card_bg.png");
        s_oSpriteLibrary.addSprite("card_in", "./sprites/card_id.png");
        s_oSpriteLibrary.addSprite("card_all", "./sprites/card_all.png");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("but_credits", "./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("checkboxen", "./sprites/checkboxen.jpg");


        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();

        s_oSpriteLibrary.loadSprites();
    };

    this._onImagesLoaded = function () {
        _iCurResource++;

        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);

        if (_iCurResource === RESOURCE_TO_LOAD) {
            _oPreloader.unload();

            this.gotoMenu();
        }
    };

    this._onAllImagesLoaded = function () {

    };

    this.onAllPreloaderImagesLoaded = function () {
        this._loadImages();
    };

    this.preloaderReady = function () {
        this._loadImages();

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            this._initSounds();
        }

        _bUpdate = true;
    };

    this.gotoMenu = function () {
        if (s_oMain._oMenu == null) {
            s_oMain._oMenu = new CMenu(s_oMain._oData);
        } else {
            s_oMain._oMenu._init(s_oMain._oData);
        }
        _iState = STATE_MENU;
    };

    this.gotoGame = function () {
        _oGame = new CGame(_oData);

        _iState = STATE_GAME;
    };

    this.gotoHelp = function () {
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };

    this.stopUpdate = function () {
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display", "block");

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            Howler.mute(true);
        }

    };

    this.startUpdate = function () {
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display", "none");

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            if (s_bAudioActive) {
                Howler.mute(false);
            }
        }

    };

    this._update = function (event) {
        if (_bUpdate === false) {
            return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;

        if (s_iCntTime >= 1000) {
            s_iCurFps = s_iCntFps;
            s_iCntTime -= 1000;
            s_iCntFps = 0;
        }

        if (_iState === STATE_GAME) {
            _oGame.update();
        }

        s_oStage.update(event);

    };

    s_oMain = this;
    _oData = oData;
    s_oMain._oData = oData;
    s_oMain._oData.diff_level_name = s_oMain._oData.diff_level_name || 0;

    ENABLE_CHECK_ORIENTATION = oData.check_orientation;

    this.initContainer();

    $(this).on("save_score", function (e, score) {
        updateScore(score);
    });

    $(this).on("leaderboard_update", function (e, score) {
        $(_oMenu).trigger("leaderboard_update", {_s: score._s});
    });

    $(this).on("toggle_peek", function (e, data) {
       oData.show_cards = data.peek;
       _oData.show_cards = oData.show_cards;
    });

    $(this).on("change_difficulty", function (e, lvl) {
        oData.diff_level_name = lvl.level;
        s_oMain._oData.diff_level_name = lvl.level;
        oData.card_per_level = oData._card_per_level.map(function (v) {
           return parseInt(v) * (parseInt(lvl.level) + 1);
        });
        oData.time_level = oData._time_level.map(function (v) {
            return parseInt(v) * Math.ceil((parseInt(lvl.level) + 1) * 0.5);
        });
        _oData.card_per_level = oData.card_per_level;
        _oData.time_level = oData.time_level;
        /*oData.show_cards = (oData.show_cards === 0) ? 1 : 0;
        _oData.show_cards = oData.show_cards;*/
    });
}

var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oGameSettings;
var s_bFullscreen = false;
var s_aSounds;

