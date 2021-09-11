// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.41
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";


export class Card extends Schema {
    @type([ "number" ]) public symbols: ArraySchema<number> = new ArraySchema<number>();
    @type([ "number" ]) public scale: ArraySchema<number> = new ArraySchema<number>();
    @type([ "number" ]) public rotation: ArraySchema<number> = new ArraySchema<number>();
    @type([ "number" ]) public offset: ArraySchema<number> = new ArraySchema<number>();
    @type("number") public rotationOffset: number;
    @type("number") public id: number;
}
