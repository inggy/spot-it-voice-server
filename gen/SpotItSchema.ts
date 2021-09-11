// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.41
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";
import { User } from "./User"
import { GameState } from "./GameState"
import { Card } from "./Card"

export class SpotItSchema extends Schema {
    @type({ map: User }) public players: MapSchema<User> = new MapSchema<User>();
    @type({ map: User }) public spectators: MapSchema<User> = new MapSchema<User>();
    @type("string") public host: string;
    @type("string") public roomName: string;
    @type("string") public mode: string;
    @type(GameState) public gameState: GameState = new GameState();
    @type([ Card ]) public deck: ArraySchema<Card> = new ArraySchema<Card>();
}
