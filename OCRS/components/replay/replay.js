$(() => {
    var goalData = null;
    console.log("start web socket connection");
    WsSubscribers.init(49322, true);
    WsSubscribers.subscribe("game", "goal_scored", (d) => {
        goalData = d
    });
    WsSubscribers.subscribe("game", "update_state", (d) => {
        if (!d['game']['hasWinner'] && d['game']['isReplay']) {
            $('.replay').show();
        } else {
            $('.replay').hide();
        }

        var goalScorer = goalData['scorer'];
        var assister = goalData['assister'];
        if (!goalData['assister'].name) {
            var assister = { name: 'None' };
        } else {
            var assister = goalData['assister'];
        }
        var ballSpeed = goalData['goalspeed'];

        var teamPrimaryColor = d['game']['teams'][goalScorer.teamnum]['color_primary'];
        var teamSecondaryColor = d['game']['teams'][goalScorer.teamnum]['color_secondary'];

        var teamColor = getTeamColor(teamPrimaryColor, 1)
        var teamColorLight = getTeamColor(teamPrimaryColor, 0.75)
        
        $('.replay .replay__goalscorer').css("background-color", teamColor);
        $('.replay .replay__goal-info').css("background-color", teamColorLight);

        $('.replay .replay__goalscorer .replay__goalscorer__name').text(goalScorer.name);
        $('.replay .replay__goal-info .replay__goal-info__speed .replay__goal-info__speed__value').text(Math.round(ballSpeed) + " km/h");
        $('.replay .replay__goal-info .replay__goal-info__assister .replay__goal-info__assister__name').text(assister.name);
    });
});