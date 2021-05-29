# Broadcast overlay for Ontario Collegiate Rocket Soccer (OCRS)
<img src="https://user-images.githubusercontent.com/55890109/120055665-81347400-c005-11eb-9ecb-0cc7880d6a1b.png" width="200" height="200">

## Dependencies:

1. Node.js (Download: https://nodejs.org/en/)
2. BakkesMod (Download: https://www.bakkesmod.com/)
3. SOS Plugin - tested using v1.6.0 (Download: https://gitlab.com/bakkesplugins/sos/sos-plugin/-/releases)
4. Color Changer Plugin (Download: https://bakkesplugins.com/plugins/view/150)
5. Live streaming software (tested in OBS Studio: https://obsproject.com/)
6. Rocket League :)

## Getting Started:

1. Set up SOS and the web socket connection: https://www.youtube.com/watch?v=QE816DBuwI4
2. Add all `.html` files to OBS as browser sources (1920 x 1080, keep default custom CSS)
3. Load OCRS colours into BakkesMod
4. Change variables in `scripts/constants.js` to required variables

Important: Use default install paths and settings for all dependencies, issues may arise in custom installs.

Important: When launching OBS it's a good idea to refresh each layer before starting the broadcast just in case.

## Constants:
### To use:
1. Edit consts in this file
2. Save this file
3. Refresh scorebug browser source in OBS

Important: Make sure to stay within the type restrictions mentioned, as the overlay may break if these typings are not followed!

### `const bracketStage`
- sets current stage of bracket
- type: string
- default value: "Quarterfinal 1"

### `const seriesLength`
- sets length of series being played
- type: int (oneof 3, 5, 7)
- default value: 5

### `const gameNum`
- sets current game in series
- type: int (range(1, 7))
- default value: 1

### `const teamLeftGamesWon`
- sets games won by left (blue) team
- type: int (range(0, 4))
- default value: 0

### `const teamRightGamesWon`
- sets games won by right (orange) team
- type: int (range(0, 4))
- default value: 0

## Questions? Contact me at:

Discord: Yujuice#1369

Email: rayalbertz@gmail.com
