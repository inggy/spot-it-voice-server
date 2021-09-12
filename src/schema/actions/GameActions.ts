import { ArraySchema, MapSchema } from "@colyseus/schema";

import { SpotItSchema } from "../SpotItSchema";
import { Card } from "../Card";
import { getPlayerIds } from "./PlayerActions";
import { Hand } from "../Hand";
import { createPresignedUrl } from "../../helper/AwsTranscribeUrlGenerator";

const LOCKOUT = 2000;
const CARD_CHANGE_BUFFER = 600;

export function setHost(spotItSchema: SpotItSchema, id: string) {
    spotItSchema.host = id;
}

export function getHost(spotItSchema: SpotItSchema): string {
    return spotItSchema.host;
}

export function getMode(spotItSchema: SpotItSchema): string {
    return spotItSchema.mode;
}
export function moveToInProgressState(spotItSchema: SpotItSchema): void {
    spotItSchema.gameState.phase = "in_progress";
}

export function moveToPreGameState(spotItSchema: SpotItSchema): void {
   
    const len = spotItSchema.deck.length;
    const shuffledDeck: number[] = new Array<number>(len);
    for (let i = 0; i < len; i++) {
        shuffledDeck[i] = i;
    };

    shuffleElements(shuffledDeck);

    const playerIds = getPlayerIds(spotItSchema);
    shuffleElements(playerIds);

    const [centerCardIndex, playerHands] = _createHands(shuffledDeck, playerIds);
    //spotItSchema.gameState.hands = playerHands;
    Object.entries(playerHands).forEach(([key, val]) => spotItSchema.gameState.hands[key] = val);
    
    playerIds.forEach(playerId => {
        spotItSchema.gameState.playerHandIndex[playerId] = 0;
        spotItSchema.gameState.timeouts[playerId] = 0;
        spotItSchema.gameState.localTimeouts[playerId] = 0;
        spotItSchema.gameState.transcribeUrls[playerId] = createPresignedUrl();
    });

    updateCenterCardIndex(spotItSchema, centerCardIndex);

    spotItSchema.gameState.phase = "pregame";
    spotItSchema.mode = "game";
}

// In place shuffle of an array
function shuffleElements<T>(arr: T[]): void {
    const len = arr.length;

    for (let i = len - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i+1));
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
}


export function _createHands(shuffledCardIndices: number[], shuffledPlayerIds: string[]): [number, MapSchema<Hand>] {
    const result = new MapSchema<Hand>();
    const numPlayers = shuffledPlayerIds.length;
    const len = shuffledCardIndices.length;

    const centerCardIndex = shuffledCardIndices[len - 1];

    const numCardsPerPlayer = Math.floor((len - 1) / numPlayers);
    
    const remainderCards = (len - 1) % numPlayers;
    const numPlayersWithExtraCard = (remainderCards >= (numPlayers / 2)) ? remainderCards : 0;
    let curIndex = 0;
    shuffledPlayerIds.forEach((playerId, index) => {
        const handState = new Hand();
        
        handState.cards = new ArraySchema();
        const numCards = (index < numPlayersWithExtraCard) ? numCardsPerPlayer + 1 : numCardsPerPlayer;

        handState.cards.push(...shuffledCardIndices.slice(curIndex, curIndex + Math.min(10, numCards)));
        result[playerId] = handState;
       
        curIndex += numCards;
    });   

    return [centerCardIndex, result];
}

function isFreeToPlay(spotItSchema: SpotItSchema, playerId: string, playServerTimestamp: number): boolean {
    return playServerTimestamp > spotItSchema.gameState.timeouts[playerId];
}

export function selectSymbol(spotItSchema: SpotItSchema, playerId: string, symbol: number, centerCardIndex: number, localTime: number): void {
    if (spotItSchema.gameState.phase !== "in_progress") return;

    const serverTimestamp: number = Date.now();

    if (!isFreeToPlay(spotItSchema, playerId, serverTimestamp)) {
        console.log(`player ${playerId} play was blocked`);
        return;
    }

    const playerCardAndIndex = getCurrentPlayerCardAndIndex(spotItSchema, playerId);
    if (!playerCardAndIndex) return;

    const [card, selectedCardIndex] = playerCardAndIndex;
    
    const centerCard = getCurrentCenterCard(spotItSchema);

    // First check that the symbol is on the player's current card
    if (card.symbols.indexOf(symbol) > -1) {
        if (centerCard.symbols.indexOf(symbol) > -1) {
            // It's a valid move if it's also on the current center card

            playCardToCenter(spotItSchema, selectedCardIndex, serverTimestamp);
            
            const canGameContinue: boolean = incrementPlayerHandIndex(spotItSchema, playerId);
            if (!canGameContinue) {
                spotItSchema.gameState.phase = "endgame";
                spotItSchema.gameState.winner = playerId;
            }
        } else if (getCurrentCenterCardIndex(spotItSchema) !== centerCardIndex) {
            // The symbol isn't in the center card but maybe they were playing against an older center card due to lag
            // no-op
            
        } else if ((serverTimestamp - spotItSchema.gameState.lastPlayedTime) < CARD_CHANGE_BUFFER) {
            // The symbol isn't on the center card. But the card changed very recently, so we'll forgive it
            // no-op
        } else {
            // player played the wrong card, set a timeout
            spotItSchema.gameState.timeouts[playerId] = serverTimestamp + LOCKOUT;
            spotItSchema.gameState.localTimeouts[playerId] = localTime + LOCKOUT;
        }
    }
}

export function resetGame(spotItSchema: SpotItSchema) {
    updateCenterCardIndex(spotItSchema, 0);
    
    _clearKeys(spotItSchema.gameState.hands);
    _clearKeys(spotItSchema.gameState.playerHandIndex);
    _clearKeys(spotItSchema.gameState.localTimeouts);
    _clearKeys(spotItSchema.gameState.timeouts);
    _clearKeys(spotItSchema.gameState.transcribeUrls)
    
    spotItSchema.gameState.phase = "";
    spotItSchema.gameState.winner = "";
    spotItSchema.mode = "lobby";
}

// return true if game can continue. false if the current player wins after the move.
function incrementPlayerHandIndex(spotItSchema: SpotItSchema, playerId: string): boolean {
    const playerHand: number[] = (spotItSchema.gameState.hands[playerId] as Hand).cards;
    const curIndex = spotItSchema.gameState.playerHandIndex[playerId];

    if (curIndex === playerHand.length - 1) {
        return false;
    } else {
        spotItSchema.gameState.playerHandIndex[playerId] = curIndex + 1;
        return true;
    }
}

function updateCenterCardIndex(spotItSchema: SpotItSchema, centerCardIndex: number) {
    spotItSchema.gameState.centerCardIndex = centerCardIndex;
}

export function getCurrentPlayerCardAndIndex(spotItSchema: SpotItSchema, playerId: string): [Card, number] | null {
    const cards: number[] = (spotItSchema.gameState.hands[playerId] as Hand).cards;
    const curPlayerIndex = spotItSchema.gameState.playerHandIndex[playerId];

    if (cards) {
        const cardIndex = cards[curPlayerIndex];
        return [getCardFromDeck(spotItSchema, cardIndex), cardIndex];
    }
    return null;
}

export function getCardFromDeck(spotItSchema: SpotItSchema, index: number): Card {
    return spotItSchema.deck[index];
}

export function getCurrentCenterCard(spotItSchema: SpotItSchema): Card {
    return getCardFromDeck(spotItSchema, getCurrentCenterCardIndex(spotItSchema));
}

export function getCurrentCenterCardIndex(spotItSchema: SpotItSchema): number {
    return spotItSchema.gameState.centerCardIndex;
}

function playCardToCenter(spotItSchema: SpotItSchema, newCenterCardIndex: number, timestamp: number) {
    updateCenterCardIndex(spotItSchema, newCenterCardIndex);
    spotItSchema.gameState.lastPlayedTime = timestamp;
    _setValueOnAllKeys(spotItSchema.gameState.localTimeouts, 0);
    _setValueOnAllKeys(spotItSchema.gameState.timeouts, 0);
}

function _clearKeys(obj: MapSchema | Record<string, any>) {
    Object.keys(obj).forEach(key => delete obj[key]);
}

function _setValueOnAllKeys(obj: MapSchema | Record<string, any>, val: any) {
    Object.keys(obj).forEach(key => obj[key] = val);
}