# Omi Card Game

A digital implementation of **Omi**, a popular Sri Lankan trick-taking card game. Play solo against AI opponents in practice mode, or compete in real-time with up to 4 players online.

## Game Overview

Omi is played with 4 players split into 2 teams. Each round, a designated trump setter picks a trump suit, and players take turns playing cards in tricks. The team that wins the round gains or loses tokens depending on whether trumps were called.

### The Deck

A 32-card deck — 4 suits × 8 values (cards 2–6 removed from a standard deck):

- **Suits:** Hearts, Diamonds, Clubs, Spades
- **Values (low → high):** 7, 8, 9, 10, J, Q, K, A

### Teams

4 players are split into 2 teams by seat position:
- **Team 1** — seats 0 and 2
- **Team 2** — seats 1 and 3

Each player receives 8 cards per round.

### How a Trick Works

1. The leading player plays any card — that card's suit becomes the **turn suit**
2. Each other player must follow the turn suit if they hold any cards of that suit
3. Playing off-suit when you hold the turn suit is a **violation**
4. After all 4 players have played, the trick is resolved

**Trick winner priority:**
1. Highest trump card (if any trump was played)
2. Highest turn-suit card (if no trump was played)
3. Highest card by value (if neither trump nor turn suit was played)

The trick winner leads the next trick.

### Trump Suit

A **trump setter** is designated at the start of each round and picks the trump suit. Trump cards beat all other suits. The trump setter role rotates to the next player each round.

### Scoring

| Outcome | Token Change |
|---|---|
| Won the round without calling trumps | +2 tokens |
| Won the round with trumps called | +1 token |
| Lost the round without calling trumps | −1 token |
| Lost the round with trumps called | −2 tokens |
| Tied | No change |

Each team starts each round with **10 penalty cards**. Violations (playing off-suit illegally) reduce a team's penalty cards.

## Game Modes

### Practice Mode

Play solo against 3 AI opponents. All logic runs client-side — no server required. The AI follows turn-suit cards first, then trump-suit cards, then plays randomly.

### Multiplayer Mode

Real-time online play via Convex. Supports:
- **Public rooms** — browse open rooms and join
- **Private rooms** — create or join by room name

Exactly 4 players are needed to start. If a player disconnects mid-game, an auto-playing bot takes over their turns so the game continues. Players can rejoin and resume control.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Practice state | Zustand |
| Multiplayer backend | Convex (real-time reactive database) |

## Getting Started

Install dependencies:

```bash
npm install
```

Set up your Convex project and add the deployment URL to `.env.local`:

```
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To run the Convex backend locally in a separate terminal:

```bash
npx convex dev
```

## Project Structure

```
app/
  page.tsx                  ← Landing / mode selector
  practise/                 ← Practice mode page
  board/                    ← Practice game board
  multiplayer/
    page.tsx                ← Public room browser
    create-room/            ← Create a private room
    start/public|private/   ← Lobby waiting rooms
    gameplay/               ← Live multiplayer game board

components/                 ← Practice mode UI components
components-multiplayer/     ← Multiplayer UI components
convex/                     ← Convex backend (schema, mutations, queries)
store/                      ← Zustand state stores (practice mode)
utils/
  practise/                 ← Practice game logic and types
  multiplayer/              ← Multiplayer game logic and types
```

Both desktop and mobile layouts are implemented separately throughout `components/` and `components-multiplayer/`.
