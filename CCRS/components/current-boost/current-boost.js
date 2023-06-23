$(() => {
    var teams = [];
    var defaultTeams = [];

    $.getJSON(cfg_ip + cfg_port + teams_filename, teamData => {
        console.log(cfg_ip + cfg_port + teams_filename);
        defaultTeams = teamData.slice(0, 3);
        teams = teamData.slice(3);
    });

    var connected = false;
    console.log("start web socket connection");
    WsSubscribers.init(true);
    setTimeout(() => { !connected && (location.reload()); }, 3000);

    WsSubscribers.subscribe("game", "update_state", (d) => {
        connected = true;
        $('.current-boost').css('display', 'flex');

        d['game']['hasTarget'] ? $('.current-boost').css('margin-right', 0) : $('.current-boost').css('margin-right', -425 + 'px');

        var currentPlayer = d['players'][d['game']['target']];
        var currentPlayerTeamName = d['game']['teams'][currentPlayer.team]['name'];        
        var currentPlayerTeamInfo = teams.find((team) => team.name.toUpperCase() === currentPlayerTeamName.toUpperCase());
        var currentPlayerTeamColor = currentPlayerTeamInfo ? currentPlayerTeamInfo['primaryColor'] : defaultTeams[currentPlayer.team]['primaryColor'];
        
        $('.current-boost .current-boost__boost--fill').css({
            'background-color': currentPlayerTeamColor,
            'width': currentPlayer.boost / 100 * 250 + 'px'
        });
        $('.current-boost .current-boost__boost--text').text(currentPlayer.boost);
    });

    WsSubscribers.subscribe("game", "match_destroyed", () => location.reload());
});