# Omi Card Game — Project Reference

This file is the authoritative reference for the codebase. Update it whenever features are added, bugs are fixed, or architecture changes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| Practice state | Zustand (`store/state.ts`) |
| Multiplayer state | Zustand (`store/multiplayer-state.ts`, `store/finish-round-state.ts`) + Convex (source of truth) |
| Realtime backend | Convex |
| Sound | Custom hooks in `utils/play-sounds.ts` |

---

## Project Structure

```
app/
  page.tsx                          ← Landing / mode selector
  practise/page.tsx                 ← Practice mode page
  board/page.tsx                    ← Practice game board
  multiplayer/
    page.tsx                        ← Public room browser
    create-room/page.tsx            ← Create a private room
    start/public/[roomID]/page.tsx  ← Public lobby
    start/private/[roomID]/page.tsx ← Private lobby
    gameplay/public/[roomID]/page.tsx ← Live multiplayer game board

components/                         ← Practice mode UI (desktop + mobile variants)
components-multiplayer/             ← Multiplayer UI (desktop + mobile variants)
convex/                             ← Convex backend
  schema.ts                         ← DB schema (rooms, players, gameStates)
  rooms.ts                          ← Room CRUD, player join/leave
  gameLogic.ts                      ← Card play, points, trump, penalties
  gameStates.ts                     ← Game state lifecycle, violations, round transitions
  autoPlayingBot.ts                 ← Heartbeat, disconnection detection, bot card play
  internalFunctions.ts              ← Internal helpers (card selection, offline check)
store/
  state.ts                          ← Practice mode Zustand store
  multiplayer-state.ts              ← Multiplayer Zustand store
  finish-round-state.ts             ← Round outcome Zustand store
utils/
  practise/
    types.ts                        ← Card types, suits, values, ranking, round messages
    game-logic.ts                   ← Deck creation, trick winner logic, XP, violations
    game-play.ts                    ← AI card selection logic
  multiplayer/
    types-multiplayer.ts            ← Multiplayer types, getWinnerMultiplayer()
    game-logic-multiplayer.ts       ← Deck creation + checkIfViolationOccured()
```

---

## Game Rules (Omi)

- **4 players, 2 teams** — seats 0 & 2 = Team 1, seats 1 & 3 = Team 2
- **32-card deck** — 4 suits × 8 values (7, 8, 9, 10, J, Q, K, A). Cards 2–6 removed.
- **Card ranking (low → high):** 7, 8, 9, 10, J, Q, K, A
- **Trump setter** picks the trump suit at the start of each round. Role rotates each round.
- **Turn suit** = suit of the first card played in a trick. Other players must follow it if they can.
- **Violation** = playing off-suit when you hold the turn suit.
- **Trick winner priority:** highest trump > highest turn suit > highest value
- **Round end** = all 8 tricks played

### Scoring

| Outcome | Penalty Card Change |
|---|---|
| Won without calling trumps | Opponent −2 |
| Won calling trumps | Opponent −1 |
| Lost without calling trumps | Self −1 |
| Lost calling trumps | Self −2 |
| Tied | No change |

- Each team starts with **10 penalty cards**
- Violations also deduct 1 penalty card from the violating team
- **Game over** when a team's penalty cards reach 0

---

## Multiplayer Game Flow

1. Creator enters username (stored in `localStorage`), creates room in Convex
2. 3 other players join (public: browse rooms; private: enter room name)
3. Room status: `waiting → joined → started`
4. Creator shuffles & deals cards, calls `createGameState` mutation
5. Trump setter sees suit-picker drawer; picks trump → stored in `gameStates.trump`
6. Players take turns. Active player's cards glow. 15-second auto-play if idle.
7. Playing off-suit → confirmation dialog → if confirmed, violation recorded in DB
8. All 4 cards played → winner determined client-side by first online player → points + turn updated in DB
9. 3-second display → cards animate to winner corner → `resetStates` clears board
10. Round ends when all player decks empty → `RoundOverMultiplayer` triggered
11. Round Over dialog: shows result, deducts penalty cards, rotates trump setter, deals new cards
12. Game over when penalty cards reach 0 → `GameOverDialogMultiplayer` with particles

### Disconnection System

- Client heartbeat every **5 seconds** (`updatePlayersHeartBeat`)
- Players inactive > **10 seconds** → marked offline in `gameStates.players[].status`
- Bot logic: first online player in seat order triggers `handleCardSelectForDisconnectedPlayer`
- Bot picks a random valid card respecting turn suit
- On rejoin: `rejoinPlayers` mutation flips status back to online

---

## Key Convex Mutations / Queries

| Function | File | Purpose |
|---|---|---|
| `createGameState` | gameStates.ts | Initialize game, deal cards, assign teams |
| `updatePlayingCards` | gameLogic.ts | Play a card, advance turn |
| `getWinnerID` | gameStates.ts | Find player who played the winning card |
| `incrementPlayerPoints` | gameLogic.ts | Add trick win point + update team points |
| `updateTurnWinner` / `updatePlayerTurn` | gameLogic.ts | Set trick winner, give them next turn |
| `resetStates` | gameLogic.ts | Clear played cards + turnSuit after trick |
| `updateGameStateAfterRound` | gameStates.ts | Increment round, rotate trump setter, reset points |
| `decrementPenaltyCards` | gameLogic.ts | Deduct from losing team |
| `decrementFromOpponents` | gameLogic.ts | Deduct from opponent team (win reward) |
| `updateViolationOccured` | gameStates.ts | Record a rule violation |
| `handleDisconnectedPlayers` | autoPlayingBot.ts | Sync online/offline status in gameState |
| `handleCardSelectForDisconnectedPlayer` | autoPlayingBot.ts | Bot plays card for offline player |
| `updatePlayersHeartBeat` | autoPlayingBot.ts | Update lastActive timestamp |
| `updateCreator` | rooms.ts | Rotate trump setter (called at round end) |

---

## State Stores (Zustand)

### `store/state.ts` — practice + shared
Key fields: `trumpSuit`, `turnSuit`, `dealtHands`, `team1Points`, `team2Points`, `team_1_penaltyCards`, `team_2_penaltyCards`, `trumpSetter`, `isUserTurn`, `gameWinner`, `roundNumber`, `muted`

### `store/multiplayer-state.ts` — multiplayer only
Key fields: `userName`, `userID`, `myCard`, `teamMateCard`, `opponent1Card`, `opponent2Card`, `winningCard`, `roundOver`, `newRound`, `gameOver`, `gameWon`, `myCardSet`, `roomName`, `teamMemberID`, `opponent_1_ID`, `opponent_2_ID`

### `store/finish-round-state.ts` — round outcome
Key fields: `wonCallingTrumps`, `wonWithoutCallingTrumps`, `lostCallingTrumps`, `lostWithoutCallingTrumps`, `gameTied`, `isDialogOpen`

---

## Known Bugs (unfixed)

### B1 — State mutation in render body
**File:** `components-multiplayer/game-play/game-play-multiplayer.tsx:458`
`setTrumpSelected(false)` called directly in component body (not in useEffect). Runs on every render, risks infinite loop.

### B2 — Object reference comparison for winning card
**File:** `components-multiplayer/game-play/game-board/playing-cards.tsx:271`
`winningCard === myCard` compares by reference. Cards from different state slices won't match even if they have the same suit/value. Should compare `suit + value`.

### B3 — Penalty deduction only fires for seats 0 and 1
**File:** `components-multiplayer/game-play/round-over-dialogs/round-over-dialog.tsx:109`
`decrementValues()` only runs when `userID === playersInRoom[0] || userID === playersInRoom[1]`. If those players are offline, penalty cards never change.

### B4 — Round result reads stale Zustand state
**File:** `components-multiplayer/game-play/round-over/round-over.tsx:62`
`getMyTeam()` reads `team1Points`/`team2Points` from Zustand instead of the fresh `teamPoints` Convex query. Can show wrong win/loss result.

### B5 — Bot always sets trump to "hearts"
**File:** `convex/internalFunctions.ts:309`
`const trumpSuit = "hearts"` is hardcoded. When trump setter disconnects, bot always picks hearts.

### B6 — Opponent deck shows current user's cards
**File:** `components-multiplayer/game-play/game-play-multiplayer.tsx:637`
`OtherDecksMultiplayer` for `opponent_2` is passed `myCardDeck` (current user's hand). Copy-paste bug.

### B7 — "First online player" pattern is a race condition
Repeated in 5+ places: `playDisconnectedPlayersCard`, `handleWinningCard`, `handleResettingGameStateAuto`, `handleClose`. Multiple clients can independently decide to trigger the same mutation simultaneously. Should be a single atomic Convex server function.

---

## Improvement Backlog

### Code Quality
- Remove all `console.log` statements from production code
- Move the "first online player triggers" coordination logic into a single Convex server function
- Add server-side card validation in `updatePlayingCards` (check it's the player's turn and they hold the card)
- Merge duplicate desktop/mobile component logic into shared hooks, vary only the layout

### UX
- Add a visible turn countdown timer (15-second auto-play is silent)
- Show opponent card counts accurately (currently shows current user's deck for opponents)
- Add in-game chat
- Add sound feedback for player disconnect/rejoin events

### Features
- Game history / win-loss stats (persist outcomes to Convex)
- Private room password/code protection (currently just a named room)
- Spectator mode
- Leaderboard

### Auth
- Replace `localStorage` username with a proper session (even a simple UUID cookie) to prevent collisions and impersonation

---

## Environment

- `.env.local` — contains `NEXT_PUBLIC_CONVEX_URL`
- Run frontend: `npm run dev`
- Run Convex backend: `npx convex dev`
