const eventsMap = {
    "Goal": "Goal",
    "Aerial Goal": "Aer. Goal",
    "Overtime Goal": "OT Goal",
    "Assist": "Assist",
    "Save": "Save",
    "Epic Save": "Save",
    "Shot on Goal": "Shot",
    "Demolition": "Demo",
}

function createEvent(player1, player2, eventType, uuid) {
    var eventStr = '<div class="event ' + uuid + '">';
    eventStr += '<span class="event--first event__player1 ' + uuid + '"><div class="event__text">' + player1.name + '</div></span>'

    if (player2.id) {
        eventStr += '<span class="event__type"><div class="event__text">' + eventsMap[eventType] + '</div></span>'
        eventStr += '<span class="event--last event__player2"><div class="event__text">' + player2.name + '</div></span>'
    } else {
        eventStr += '<span class="event--last event__type"><div class="event__text">' + eventsMap[eventType] + '</div></span>'
    }

    eventStr += '</div>'
    return eventStr;
}

function setEventColors(player1, player2, teams, defaultTeams, game_state, uuid) {
    var player1TeamName = game_state['game']['teams'][player1.team_num]['name'];
    var player1TeamInfo = teams.find((team) => team.name.toUpperCase() === player1TeamName.toUpperCase());
    var player1TeamColor = player1TeamInfo ? player1TeamInfo['primaryColor'] : defaultTeams[player1.team_num]['primaryColor'];

    $('.event .event__player1.' + uuid).css('background-color', player1TeamColor);

    if (player2.id) {
        var player2TeamName = game_state['game']['teams'][player2.team_num]['name'];
        var player2TeamInfo = teams.find((team) => team.name.toUpperCase() === player2TeamName.toUpperCase());
        var player2TeamColor = player2TeamInfo ? player2TeamInfo['primaryColor'] : defaultTeams[player2.team_num]['primaryColor'];
    
        $('.event .event__player2').css('background-color', player2TeamColor);
    }
}

$(() => {
    var game_state = null;

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

        game_state = d;
        (!d['game'] || d['game']['hasWinner'] || d['game']['isReplay']) ? $('.events').fadeOut() : $('.events').fadeIn();
    });

    WsSubscribers.subscribe("game", "statfeed_event", (d) => {
        var player1 = d['main_target'];
        var player2 = d['secondary_target'];
        var eventType = d['type'];

        if (eventType in eventsMap) {
            var numEvents = $(".events").children().length;
            if (numEvents >= 4) {
                $('.events .event:first-child').fadeOut(100, () => {
                    $('.events .event:first-child').remove();
                });
            }

            var currentEvents = $('.events').html();
            var uuid = self.crypto.randomUUID();
            var eventStr = createEvent(player1, player2, eventType, uuid);
            currentEvents += eventStr;
            $('.events').html(currentEvents);

            setEventColors(player1, player2, teams, defaultTeams, game_state, uuid);

            setTimeout(() => {
                $('.event.' + uuid).css({
                    'height': 31 + 'px',
                    'padding': 4 + 'px ' + 0 + ' ' + 2 + 'px'
                });
            }, 5);

            setTimeout(() => {
                $('.event.' + uuid).css({
                    'height': 0,
                    'padding': 0
                });
                
                setTimeout(() => {
                    $('.event.' + uuid).remove();
                }, 501);
            }, 4000);
        }
    });

    WsSubscribers.subscribe("game", "match_destroyed", () => location.reload());
});