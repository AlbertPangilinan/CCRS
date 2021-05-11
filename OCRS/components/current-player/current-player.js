$(() => {
    console.log("start web socket connection");
    WsSubscribers.init(49322, true);
    WsSubscribers.subscribe("game", "update_state", (d) => {
        if (d['game']['hasTarget']) {
            $('.current-player').show();
        } else {
            $('.current-player').hide();
        }

        var currentPlayer = d['players'][d['game']['target']];
        var currentPlayerTeam = d['game']['teams'][currentPlayer.team]['name'];
        var currentPlayerTeamPrimaryColor = d['game']['teams'][currentPlayer.team]['color_primary'];
        var currentPlayerTeamSecondaryColor = d['game']['teams'][currentPlayer.team]['color_secondary'];

        var currentPlayerTeamColor = getTeamColor(currentPlayerTeamPrimaryColor, 1)
        var currentPlayerTeamColorLight = getTeamColor(currentPlayerTeamPrimaryColor, 0.75)
        
        $('.current-player .current-player__name').css("background-color", currentPlayerTeamColor);
        $('.current-player .current-player__stats .current-player__stats__values').css("background-color", currentPlayerTeamColorLight);
        $('.current-player .current-player__stats .current-player__stats__labels').css("background-color", currentPlayerTeamColor);

        $('.current-player .current-player__name .current-player__name__school').text(currentPlayerTeam);
        $('.current-player .current-player__name .current-player__name__name').text(currentPlayer['name']);

        $('.current-player .current-player__stats .current-player__stats__values .current-player__stats__value--goals').text(currentPlayer.goals);
        $('.current-player .current-player__stats .current-player__stats__values .current-player__stats__value--assists').text(currentPlayer.assists);
        $('.current-player .current-player__stats .current-player__stats__values .current-player__stats__value--shots').text(currentPlayer.shots);
        $('.current-player .current-player__stats .current-player__stats__values .current-player__stats__value--saves').text(currentPlayer.saves);
        $('.current-player .current-player__stats .current-player__stats__values .current-player__stats__value--touches').text(currentPlayer.touches);
        $('.current-player .current-player__stats .current-player__stats__values .current-player__stats__value--demos').text(currentPlayer.demos);

        $('.current-player .current-player__boost--fill').css('width', currentPlayer.boost + '%');
    });
});