const eventsMap = {
    "Goal": "Goal",
    "Aerial Goal": "Aer. Goal",
    "Win": "Win",
    "MVP": "MVP",
    "Backwards Goal": "Back. Goal",
    "Pool Shot": "Pool Shot",
    "Overtime Goal": "OT Goal",
    "Hat Trick": "Hat Trick",
    "Assist": "Assist",
    "Playmaker": "Playmaker",
    "Save": "Save",
    "Epic Save": "Epic Save",
    "Savior": "Savior",
    "Shot on Goal": "Shot",
    "Center Ball": "Center",
    "Clear Ball": "Clear",
    "Demolition": "Demo",
    "First Touch": "First Touch"
}

function createEvent(player1, player2, eventType, uuid) {
    var eventStr = '<div class="event ' + uuid + '">';

    eventStr += '<span class="event__player1 ' + uuid + '"><div class="event__text">' + player1.name + '</div></span>'

    eventStr += '<span class="event__type"><div class="event__text">' + eventsMap[eventType] + '</div></span>'

    if (player2.id) {
        eventStr += '<span class="event__player2"><div class="event__text">' + player2.name + '</div></span>'
    }

    eventStr += '</div>'
    return eventStr;
}

function setEventColors(player1, player2, game_state, uuid) {
    var player1TeamPrimaryColor = game_state['game']['teams'][player1.team_num]['color_primary'];
    var player1TeamSecondaryColor = game_state['game']['teams'][player1.team_num]['color_secondary'];

    var player1TeamColor = getTeamColor(player1TeamPrimaryColor, 1)
    var player1TeamColorLight = getTeamColor(player1TeamPrimaryColor, 0.75)

    $('.event .event__player1.' + uuid).css("background-color", player1TeamColor);

    if (player2.id) {
        var player2TeamPrimaryColor = game_state['game']['teams'][player2.team_num]['color_primary'];
        var player2TeamSecondaryColor = game_state['game']['teams'][player2.team_num]['color_secondary'];

        var player2TeamColor = getTeamColor(player2TeamPrimaryColor, 1)
        var player2TeamColorLight = getTeamColor(player2TeamPrimaryColor, 0.75)

        $('.event .event__player2').css("background-color", player2TeamColor);
    }
}

$(() => {
    var game_state = null;
    console.log("start web socket connection");
    WsSubscribers.init(49322, true);
    WsSubscribers.subscribe("game", "update_state", (d) => {
        game_state = d
    });
    WsSubscribers.subscribe("game", "statfeed_event", (d) => {
        var player1 = d['main_target'];
        var player2 = d['secondary_target'];
        var eventType = d['type'];

        if (eventType in eventsMap) {
            var numEvents = $(".events").children().length;
            if (numEvents == 3) {
                $(".events .event:first-child").fadeOut("fast").remove();
            }

            var currentEvents = $('.events').html();
            var uuid = uuidv4();
            var eventStr = createEvent(player1, player2, eventType, uuid);
            currentEvents += eventStr;
            $('.events').html(currentEvents);
            // $('.' + uuid).hide().fadeIn("fast");
    
            setEventColors(player1, player2, game_state, uuid);
            setTimeout(function() {
                $('.event.' + uuid).animate({ height: 0, opacity: 0 }, 'fast', function() { $('.' + uuid).remove(); });
            }, 4000);
        }
    });
});