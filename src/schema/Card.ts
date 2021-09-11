import { Schema, ArraySchema, type } from "@colyseus/schema";

export class Card extends Schema {

  @type([ "number" ])
  symbols: ArraySchema<number> = new ArraySchema();

  @type([ "number" ])
  scale: ArraySchema<number> = new ArraySchema();

  @type([ "number" ])
  rotation: ArraySchema<number> = new ArraySchema();

  @type([ "number" ])
  offset: ArraySchema<number> = new ArraySchema();

  @type("number")
  rotationOffset: number = 0
 
  @type("number")
  id: number = 0
}