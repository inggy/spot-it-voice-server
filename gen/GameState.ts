// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.41
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";
import { Hand } from "./Hand"

export class GameState extends Schema {
    @type("number") public centerCardIndex: number;
    @type({ map: "number" }) public playerHandIndex: MapSchema<number> = new MapSchema<number>();
    @type({ map: Hand }) public hands: MapSchema<Hand> = new MapSchema<Hand>();
    @type("string") public phase: string;
    @type("string") public winner: string;
    @type({ map: "number" }) public localTimeouts: MapSchema<number> = new MapSchema<number>();
}
