import { ArraySchema, MapSchema } from "@colyseus/schema";
import { Card } from "../schema/Card";


export const debugDeck: ArraySchema<Card> = gernerateBasicDeck();
export const realDeck: ArraySchema<Card> = generateAdvancedDeck(8);

function gernerateBasicDeck(): ArraySchema<Card> {
    const deck = new ArraySchema<Card>();
    deck.push(buildCard([1, 2, 5], 100));
    deck.push(buildCard([3, 4, 5], 101));
    
    deck.push(buildCard([1, 4, 6], 102));
    deck.push(buildCard([3, 2, 6], 103));

    deck.push(buildCard([1, 3, 7], 104));
    deck.push(buildCard([2, 4, 7], 105));

    deck.push(buildCard([5, 6, 7], 106));

    return deck;
}

export function generateAdvancedDeck(symbolsPerCard: number): ArraySchema<Card> {
    const deck = new ArraySchema<Card>();
    let cardId = 100;

    const gridSize = symbolsPerCard - 1;
    const grid: number[][] = [];
    const slopeSymbols: number[] = [];

    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = 1 + (i*gridSize+j);
        }
    }

    for (let i = 0; i < symbolsPerCard; i++) {
        slopeSymbols[i] = (gridSize * gridSize) + i + 1;
    }

    // for each slope
    for (let slope = 0; slope < slopeSymbols.length - 1; slope++) {
        // start each card down one column
        for (let offset = 0; offset < gridSize; offset++) {
            // start going up at the perscribed slope for gridSize symbols
            const cardSymbols = [];
            for (let i = 0; i < gridSize; i++) {
                const x = i;
                const y = (offset + (i * slope)) % gridSize;
                cardSymbols.push(grid[x][y])
            }
            cardSymbols.push(slopeSymbols[slope]);
            deck.push(buildCard(cardSymbols, cardId++));
        }
    }

    // now the vertical cards
    for (let offset = 0; offset < gridSize; offset++) {
        const cardSymbols = [];
        for (let i = 0; i < gridSize; i++) {
            cardSymbols.push(grid[offset][i]);
        }
        cardSymbols.push(slopeSymbols[slopeSymbols.length - 1]);
        deck.push(buildCard(cardSymbols, cardId++));
    }

    deck.push(buildCard([...slopeSymbols], cardId++));
    
    return deck;
}

function buildCard(symbols: number[], id: number): Card {
    const card = new Card();
    shuffleElements(symbols)
    card.symbols = new ArraySchema(...symbols);

    const offset: number[] = [];
    const rotation: number[] = [];
    const scale: number[] = [];
    for(let i = 0; i < symbols.length; i++) {
        offset[i] = randDecimalBetween(0.0, 1.0);
        rotation[i] = randDecimalBetween(0.0, 1.0);
        scale[i] = randDecimalBetween(0.7, 1.2);
    }
    
    card.offset = new ArraySchema(...offset);
    card.rotation = new ArraySchema(...rotation);
    card.scale = new ArraySchema(...scale);
    card.rotationOffset = randDecimalBetween(0, (Math.PI * 2) / (symbols.length * 1.0));

    card.id = id;
    return card;
}

function randDecimalBetween(start:number, end:number): number {
    let num = start + (Math.random() * (end - start));

    num = Math.floor(num * 100) / 100;
    return num;
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