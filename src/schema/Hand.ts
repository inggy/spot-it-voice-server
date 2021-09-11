import { Schema, ArraySchema, type } from "@colyseus/schema";

export class Hand extends Schema {

  @type([ "number" ])
  cards: ArraySchema<number> = new ArraySchema<number>();

}