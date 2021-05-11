$(() => {
    console.log("start web socket connection");
    WsSubscribers.init(49322, true);
    WsSubscribers.subscribe("game", "update_state", (d) => {
        if (d['game']['hasWinner'] || d['game']['isReplay']) {
            $('.right-boost').hide();
        } else {
            $('.right-boost').show();
        }
        
        var players = Object.values(d['players'])
        var team = players.filter((player) => player.team == 1);

        $('.right-boost .right-boost__player1 .right-boost__player__name').text(team[0].name);
        $('.right-boost .right-boost__player1 .right-boost__player__boost .right-boost__player__boost--fill').css('width', team[0].boost / 100 * 175 + 'px');
        $('.right-boost .right-boost__player1 .right-boost__player__boost .right-boost__player__boost__text').text(team[0].boost);

        $('.right-boost .right-boost__player2 .right-boost__player__name').text(team[1]['name']);
        $('.right-boost .right-boost__player2 .right-boost__player__boost .right-boost__player__boost--fill').css('width', team[1].boost / 100 * 175 + 'px');
        $('.right-boost .right-boost__player2 .right-boost__player__boost .right-boost__player__boost__text').text(team[1].boost);

        $('.right-boost .right-boost__player3 .right-boost__player__name').text(team[2]['name']);
        $('.right-boost .right-boost__player3 .right-boost__player__boost .right-boost__player__boost--fill').css('width', team[2].boost / 100 * 175 + 'px');
        $('.right-boost .right-boost__player3 .right-boost__player__boost .right-boost__player__boost__text').text(team[2].boost);
    });
});