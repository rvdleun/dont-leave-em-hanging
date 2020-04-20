# Development
The focus of this game is fairly simple: Give high fives and fist bumps to your adoring fans. It's meant to be a simple game for players to quickly pick up and get a smile out of it.

Essentially, that's also what is meant to be reflected into everything. The fanboys are happy and excited to see you. If you high five them, they're over the moon. Even if you make a mistake, they're still amused. Only if you don't give them a high five will they show any sign of disappointment. After all, you're doing the opposite of what the title of the game is suggesting.

## How can I contribute?
I'll be honest: I am a developer and, I think, the game mostly consists of [programmer art](https://en.wikipedia.org/wiki/Programmer_art) at the moment. What's currently in there is likely the best I can produce at the moment, so that says a lot.

So if you are interested in doing anything with the graphics or the sounds, you're most welcome. I just have very little experience in that field and would love to have some input. Even just designs ideas are welcome, I could always implement these myself(or someone else).

However, there's a list of code-related issues I'd also like to pick up. [Consult the issues page](https://github.com/rvdleun/dont-leave-em-hanging/issues) to get an overview of where help is needed. Please leave a message there if you intend to help out.

## Code setup
Granted, the project start out as a bit of a fun experiment, and then turned into a game that was cobbled together over a week. I do think the code reflects this a bit, and I'm hoping to clean this up over time.

### Overview
* The smileys are labelled as `fanboys` throughout the code.
* The two most important components for the game are `fanboy-spawner` and `game`.
  * The `fanboy-spawner` will continually spawn new fanboys running up the user.
  * The `game` component will set everything up when the game starts. This means hiding the title screen and keeping track of how much time is left before the session ends.
  * When the session ends, the `game` component will disable the spawner, play an applause, and then trigger the title screen again.
* The `button-difficulty`, `button-duration` and `button-radius` update the settings by changing the attributes on the `fanboy-spawner` and `game` components.
* A fanboy can be five different states...
  * `approved`: The player has performed the right response. Fanboy is over the moon.
  * `not-approved`: The player has responded, but did so badly. Fanboy is amused.
  * `sad`: The user waited too long. Fanboy isn't mad, just disappointed.
  * `waiting`: The fanboy is eagerly waiting for the player's response.
  * `worried`: The player is taking his time responding. Fanboy is getting worried.
* A different high score is stored for every available permutation of the settings.

#### Components

##### button
| Name | Type | Description | Default |
|------|------|-------------|---------|
| backgroundColor | string | The background color | #000
| color | string | Text color | #fff
| text | string | The text on top of the button | No text |

This component will create a button via planes and a text primitive on top. It will change the color of the border and text to yellow when a cursor hovers over it.

It will listen to the `triggerdown` event on the hand-controls and emit a `click` event if the user is hovering over it.

##### button-difficulty
| Name | Type | Description | Default |
|------|------|-------------|---------|
| highScore | selector | Selects the high score entity | [high-score]
| spawner | selector | Selects the fanboy spawner entity | [fanboy-spawner]

This component will set the right difficulty on the `fanboy-spawner` component. It stores the setting in the local storage and retrieves it on init.

##### button-duration
| Name | Type | Description | Default |
|------|------|-------------|---------|
| game | selector | Selects the game entity | [game]
| spawner | selector | Selects the fanboy spawner entity | [fanboy-spawner]

This component will set the right difficulty on the `game` component. It stores the setting in the local storage and retrieves it on init.

##### button-radius
| Name | Type | Description | Default |
|------|------|-------------|---------|
| highScore | selector | Selects the high score entity | [high-score]
| spawner | selector | Selects the fanboy spawner entity | [fanboy-spawner]

This component will set the right radius on the `fanboy-spawner` component. It stores the setting in the local storage and retrieves it on init.

##### button-start
| Name | Type | Description | Default |
|------|------|-------------|---------|
| fanboyCircle | selector | Selects the fanboy circle entity | [fanboy-circle]
| game | selector | Selects the game entity | [game]
| titleScreen | selector | Selects the title screen entity | [title-screen]

When the user clicks on this button, it will disable the fanboy circle, enable the game and hide the title screen.

##### fanboy
| Name | Type | Description | Default |
|------|------|-------------|---------|
| active | boolean | If the fanboy is active and can get disappointed | false |
| canContact | boolean | If the user can interact with the fanboy's hand | true |
| debugContact | boolean | If the fanboy will get a contact event after 3 seconds | false |
| debugContactApproved | boolean | Whether the fanboy will approve or not when `debugContact` is true | false |
| distance | number | How close the fanboy should be to the player | 0
| distanceDuration | number | How long it will take before the fanboy reaches his destination | 5000
| hand | string | What hand will be shown: `left` or `right` | right |
| hasSound | boolean | Whether the entity should have a sound entity | true
| lane | number | In which lane the fanboy is spawned | -1
| type | string | What type of hand will be used: `hand` or `fist` | hand |

This component is responsible for everything surrounding a single fanboy. It will create all the necessary child entities on init(face and hand).

If `active` is set to true, a timer will start in which the user has to respond. If the time runs out, he will disappear and 

##### fanboy-circle
| Name | Type | Description | Default |
|------|------|-------------|---------|
| distance | number | The distance from the center | 3.5 |
| enabled | boolean | If the fanboys should be shown | false |
| noFanboys | number | How many fanboys should be displayed | 30 |
| radius | number | In what radius the fanboys will be shown | 270 |

This component will show a number of fanboys around the player.

##### fanboy-spawner
| Name | Type | Description | Default |
|------|------|-------------|---------|
| camera | selector | Selects the camera entity | [camera] |
| enabled | boolean | Whether fanboys should be spawned | false |
| radius | number | In what radius the fanboys should spawn | 180 |
| type | string | What type of hands will be used: `hand` or `fist`. When empty, both are used | null |

This component will continually spawn a new fanboy every 0-1.2 seconds.

The area around the player is divided into six lanes from which they'll spawn. A little randomization is added to this to make sure that they're not spawning in a single file. When the first fanboy from a lane is removed, they will all move up one space. The fanboy in front of the lane will be set to active.

When disabled, it will set an approved look on every fanboy and shortly thereafter make them disappear.


##### game
| Name | Type | Description | Default |
|------|------|-------------|---------|
| applause | selector | Selects the applause entity | #ambience-applause |
| duration | number | How long a single game lasts | 60000 |
| enabled | boolean | Whether the game is enabled | false |
| fanboyCircle | selector | Selects the fanboy circle entity | [fanboy-circle] |
| highScore | selector | Selects the high score entity | [high-score] |
| musicGame | selector | Selects the music game entity | [music-game] |
| titleScreen | selector | Selects the title screen entity | [title-screen]

This component will take care of everything game-related.

When it is enabled, it will enable the fanboy spawner and start an animation in the circle below the player, based on the duration of the game. When this animation finishes, the game is over and it will disable itself.

When the game ends, it will disable the fanboy spawner, end the music, play an applause sound and update the high score. After five seconds, it will make the title screen appear again.

##### hand-receiver
This component is attached to the hand of a fanboy and will track when the player's hand collides with it. When so, it will emit a `contact` event with the playerHand's entity and the velocity it was travelling at the time.

##### high-score
| Name | Type | Description | Default |
|------|------|-------------|---------|
| difficulty | string | The current difficulty |  |
| duration | string | The current duration |  |
| radius | string | The radius difficulty |  |

This component is responsible for keeping track for displaying and storing the current high score.

The high score is stored in the local storage separately for every permutation of the schema. The key is based on the current parameters and is generated as: `dleh.high-score-${difficulty}-${duration}-${radius}`.

##### music-game
| Name | Type | Description | Default |
|------|------|-------------|---------|
| playing | boolean | Whether the music should be playing | false |

This component will make sure that the song(from [bensound.com](bensound.com)) will play.

It is also responsibly for ensuring that it will loop correctly.

##### player-cursor
| Name | Type | Description | Default |
|------|------|-------------|---------|
| active | boolean | Whether this cursor is the current active one | false |
| enabled | boolean | Whether this cursor is enabled  | true |

This component will make sure that the right raycaster is used. The user can trigger the player-cursor by pressing the trigger on the respective controller.

When disabled, the raycaster won't be available either way.

##### player-hand
The `player-hand` component tracks the velocity of the hand by comparing the last three positions over the past 150 milliseconds and stores this on the `data-velocity` attribute. It will also set whether the user is making a fist bump or a high five.

##### score
The `score` component will show the current score of the user. Via the `score` system, other components can change the points over time.

##### title-screen
| Name | Type | Description | Default |
|------|------|-------------|---------|
| scoreFront | selector | Selects the front score entity | #score-front |
| tutorial | selector | Selects the tutorial entity | [tutorial] |
| visible | boolean | Whether the title screen should be visible or not | true |

This component will update the animations for the score in front of the player and the tutorial component.

##### tutorial
This component will spawn a fanboy for the user to practice on.
