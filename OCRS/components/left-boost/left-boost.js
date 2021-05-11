$(() => {
    console.log("start web socket connection");
    WsSubscribers.init(49322, true);
    WsSubscribers.subscribe("game", "update_state", (d) => {
        if (d['game']['hasWinner'] || d['game']['isReplay']) {
            $('.left-boost').hide();
        } else {
            $('.left-boost').show();
        }
        
        var players = Object.values(d['players'])
        var team = players.filter((player) => player.team == 0);

        $('.left-boost .left-boost__player1 .left-boost__player__name').text(team[0].name);
        $('.left-boost .left-boost__player1 .left-boost__player__boost .left-boost__player__boost--fill').css('width', team[0].boost / 100 * 175 + 'px');
        $('.left-boost .left-boost__player1 .left-boost__player__boost .left-boost__player__boost__text').text(team[0].boost);

        $('.left-boost .left-boost__player2 .left-boost__player__name').text(team[1]['name']);
        $('.left-boost .left-boost__player2 .left-boost__player__boost .left-boost__player__boost--fill').css('width', team[1].boost / 100 * 175 + 'px');
        $('.left-boost .left-boost__player2 .left-boost__player__boost .left-boost__player__boost__text').text(team[1].boost);

        $('.left-boost .left-boost__player3 .left-boost__player__name').text(team[2]['name']);
        $('.left-boost .left-boost__player3 .left-boost__player__boost .left-boost__player__boost--fill').css('width', team[2].boost / 100 * 175 + 'px');
        $('.left-boost .left-boost__player3 .left-boost__player__boost .left-boost__player__boost__text').text(team[2].boost);
    });
});