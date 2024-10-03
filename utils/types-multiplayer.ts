export const suits: string[] = ["hearts", "diamonds", "clubs", "spades"];
export const values: string[] = ["7", "8", "9", "10", "J", "Q", "K", "A"];

export type SocketData = {
  id: string;
  username: string;
  rooms: string[];
};

export const generateRandomName = () => {
  return `room-${Math.random().toString(36).substr(2, 9)}`;
};

export type StartGamePoolPrivateProps = {
  roomId: string;
};

export type cardMultiplayer = {
  suit: string;
  value: string;
};

function getValueRank(value: string): number {
  return values.indexOf(value);
}

export function getWinnerMultiplayer(
  cards: cardMultiplayer[],
  trumpSuit: string,
  turnSuit: string
): cardMultiplayer {
  let winningCard = cards[0];

  cards.forEach((card) => {
    //if only one card from the trumpSuit is available
    if (card.suit === trumpSuit && winningCard.suit !== trumpSuit) {
      winningCard = card;
    }
    //if there are more than one card from the trumpsuit is available
    else if (
      card.suit === trumpSuit &&
      winningCard.suit === trumpSuit &&
      getValueRank(card.value) > getValueRank(winningCard.value)
    ) {
      winningCard = card;
    }
    //if there are no cards from the trumpsuit and only one card from the turnsuit
    else if (
      card.suit === turnSuit &&
      winningCard.suit !== turnSuit &&
      winningCard.suit !== trumpSuit
    ) {
      winningCard = card;
    } else if (
      // if there are more than one card from the turnsuit and nothing from trumpsuit
      card.suit === turnSuit &&
      winningCard.suit !== trumpSuit &&
      winningCard.suit === turnSuit &&
      getValueRank(card.value) > getValueRank(winningCard.value)
    ) {
      winningCard = card;
    } else if (
      //if there are no trump suits and turn suits
      card.suit !== turnSuit &&
      winningCard.suit !== trumpSuit &&
      winningCard.suit !== turnSuit &&
      getValueRank(card.value) > getValueRank(winningCard.value)
    ) {
      winningCard = card;
    }
  });

  return winningCard;
}
