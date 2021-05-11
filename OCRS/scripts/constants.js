// Constants for editing game information in scorebug overlay component
//
// To use:
// 1. Edit consts in this file
// 2. Save this file
// 3. Refresh scorebug browser source in OBS
//
// Important: Make sure to stay within the type restrictions mentioned,
// as the overlay may break if these typings are not followed!

// Set bracket stage
// type: string
// default value: "Quarterfinal 1"
const bracketStage = "Quarterfinal 1"

// Set series length
// type: int (oneof 3, 5, 7)
// default value: 5
const seriesLength = 5

// Set current game in series
// type: int (range(1, 7))
// default value: 1
const gameNum = 1

// Set games won by left (blue) team
// type: int (range(0, 4))
// default value: 0
const teamLeftGamesWon = 0

// Set games won by right (orange) team
// type: int (range(0, 4))
// default value: 0
const teamRightGamesWon = 0
