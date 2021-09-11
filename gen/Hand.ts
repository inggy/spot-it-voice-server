// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.41
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";


export class Hand extends Schema {
    @type([ "number" ]) public cards: ArraySchema<number> = new ArraySchema<number>();
}
