(function () {
    var CSS = {
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)',
            overflow: 'hidden'
        },
        ball: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: parseInt(localStorage.getItem('ball-top')) || 0,
            left: parseInt(localStorage.getItem('ball-left')) || 350,
            borderRadius: 50,
            background: '#C6A62F'
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F'
        },
        stick1: {
            left: parseInt(localStorage.getItem('stick1-left')) || 0,
            top: parseInt(localStorage.getItem('stick1-top')) || 150
        },
        stick2: {
            left: 0,
            top: parseInt(localStorage.getItem('stick2-top')) || 100
        },
        scoreBoard: {
            background: 'white',
            position: 'fixed',
            zIndex: '10000',
            width: '20%',
            height: '10%',
            top: '0%',
            left: '40%',
            border: '.25vmin solid black',
            'margin-top': '20px',
            'font-size': '50px',
            'font-weight': 'bold',
            'text-align': 'center',
        },
        player1: {
            position: 'absolute',
            width: '50%',
            height: '100%',
            top: 0,
            left: 0,
        },
        player2: {
            position: 'absolute',
            width: '50%',
            height: '100%',
            top: 0,
            left: '50%',
        },
        scoreLine: {
            position: 'absolute',
            width: 0,
            height: '100%',
            borderLeft: '2px dashed black',
            top: 0,
            left: '50%'
        }
    };

    var CONSTS = {
    	gameSpeed: parseInt(localStorage.getItem('gameSpeed')) || 20,
        score1: parseInt(localStorage.getItem('score1')) || 0,
        score2: parseInt(localStorage.getItem('score2')) || 0,
        stick1Speed: parseInt(localStorage.getItem('stick1Speed')) || 0,
        stick2Speed:  parseInt(localStorage.getItem('stick2Speed')) || 0,
        ballTopSpeed:  parseFloat(localStorage.getItem('ballTopSpeed')) || 0,
        ballLeftSpeed:  parseFloat(localStorage.getItem('ballLeftSpeed')) || 0,
        init: true 
    };

    function start() {
        draw();
        setEvents();
        roll();
        loop();
    }

    function draw() {
        $('<div/>', {id: 'score-board'}).css(CSS.scoreBoard).appendTo('body');
        $('#score-board').css('margin-top', '20px');
        $('<div/>', {id: 'score-line'}).css(CSS.scoreLine).appendTo('#score-board');
        $('<div/>', {id: 'player-1'}).css(CSS.player1).appendTo('#score-board');
        $('<div/>', {id: 'player-2'}).css(CSS.player2).appendTo('#score-board');
        $('#player-1').text(CONSTS.score1);
        $('#player-2').text(CONSTS.score2);

        $('<div/>', {id: 'pong-game'}).css(CSS.arena).appendTo('body');
        $('<div/>', {id: 'pong-line'}).css(CSS.line).appendTo('#pong-game');
        $('<div/>', {id: 'pong-ball'}).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', {id: 'stick-1'}).css($.extend(CSS.stick1, CSS.stick)).appendTo('#pong-game');

        CSS.stick2.left = CSS.arena.width - CSS.stick.width;
        $('<div/>', {id: 'stick-2'}).css($.extend(CSS.stick2, CSS.stick)).appendTo('#pong-game');
    }

    function setEvents() {
        $(document).on('keydown', function (e) {
            // w = 87, s = 83, up = 38, down = 40
            if (e.keyCode == 87) {
                CONSTS.stick1Speed = -10;
            }

            if (e.keyCode == 83) {
                CONSTS.stick1Speed = 10;
            }

            if (e.keyCode == 38) {
                CONSTS.stick2Speed = -10;
            }

            if (e.keyCode == 40) {
                CONSTS.stick2Speed = 10;
            }
        });

        $(document).on('keyup', function (e) {
            if (e.keyCode == 87) {
                CONSTS.stick1Speed = 0;
            }

            if (e.keyCode == 83) {
                CONSTS.stick1Speed = 0;
            }

            if (e.keyCode == 38) {
                CONSTS.stick2Speed = 0;
            }

            if (e.keyCode == 40) {
                CONSTS.stick2Speed = 0;
            }
        });
    }

    function loop() {
        window.pongLoop = setInterval(function () {
            CSS.stick1.top += CONSTS.stick1Speed;
            CSS.stick2.top += CONSTS.stick2Speed;
            
            // stick boundary control
            if(CSS.stick1.top < 0){
                CSS.stick1.top = 0;
            }

            if(CSS.stick1.top + CSS.stick.height > CSS.arena.height){
                CSS.stick1.top = CSS.arena.height - CSS.stick.height;
            }

            if(CSS.stick2.top < 0){
                CSS.stick2.top = 0;
            }

            if(CSS.stick2.top + CSS.stick.height > CSS.arena.height){
                CSS.stick2.top = CSS.arena.height - CSS.stick.height;
            }
            // update sticks
            $('#stick-1').css('top', CSS.stick1.top);
            $('#stick-2').css('top', CSS.stick2.top);

            if (CSS.ball.top <= 0 ||
                CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                    CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;                    
            }

            // ball stick collision check
            if(collision($('#pong-ball'), $('#stick-1'))){
                CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1;
            }

            if(collision($('#pong-ball'), $('#stick-2'))){
                CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1;
            }

            CSS.ball.top += CONSTS.ballTopSpeed;
            CSS.ball.left += CONSTS.ballLeftSpeed;
            $('#pong-ball').css({top: CSS.ball.top,left: CSS.ball.left});
            
            if (CSS.ball.left <= 0){
                CONSTS.score2 += 1;
                $('#player-2').text(CONSTS.score2);
                roll();
            }

            if(CSS.ball.left >= CSS.arena.width - CSS.ball.width){
                CONSTS.score1 += 1;
                $('#player-1').text(CONSTS.score1);
                roll();
            }

            if(CONSTS.score1 == 5 || CONSTS.score2 == 5){
                clearInterval(window.pongLoop);
            }

            setDataToLocal();
        }, CONSTS.gameSpeed);
    }

    function roll() {
        if(CONSTS.init === true){
            console.log("1 time", parseInt(localStorage.getItem('ball-top')))
            console.log("2 time", parseInt(localStorage.getItem('ball-left')))

            CSS.ball.top = parseInt(localStorage.getItem('ball-top')) || 250;
            CSS.ball.left = parseInt(localStorage.getItem('ball-left')) || (CSS.arena.width/2) - CSS.ball.width/2 + 1
            CONSTS.init = false;
        }
        else{
            CSS.ball.top = 250;
            CSS.ball.left = (CSS.arena.width/2) - CSS.ball.width/2 + 1;
        }
        

        var side = -1;

        if (Math.random() < 0.5) {
            side = 1;
        }

        CONSTS.ballTopSpeed = Math.random() * -2 - 3;
        CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);
    }

    function setDataToLocal(){
        // store CONSTS
        window.localStorage.setItem('gameSpeed', CONSTS.gameSpeed);
        window.localStorage.setItem('score1', CONSTS.score1);
        window.localStorage.setItem('score2', CONSTS.score2);
        window.localStorage.setItem('stick1Speed', CONSTS.stick1Speed);
        window.localStorage.setItem('stick2Speed', CONSTS.stick2Speed);
        window.localStorage.setItem('ballTopSpeed', CONSTS.ballTopSpeed);
        window.localStorage.setItem('ballLeftSpeed', CONSTS.ballLeftSpeed);

        // store ball and stick data
        window.localStorage.setItem('stick1-top', CSS.stick1.top);
        window.localStorage.setItem('stick2-top', CSS.stick2.top);

        window.localStorage.setItem('stick1-left', CSS.stick1.left);
        window.localStorage.setItem('stick2-left', CSS.stick2.left);

        window.localStorage.setItem('ball-top', CSS.ball.top);
        window.localStorage.setItem('ball-left', CSS.ball.left);
    }
    


    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;
    
        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }

    start();
})();