import { Schema, ArraySchema, MapSchema, type } from "@colyseus/schema";
import { Hand } from "./Hand";

export class GameState extends Schema {
  
  @type("number")
  centerCardIndex = 0;

  @type({ map: "number" })
  playerHandIndex = new MapSchema<number>();

  @type({ map: Hand })
  hands = new MapSchema<Hand>();

  @type("string")
  phase = ""

  @type("string")
  winner = ""

  @type({ map: "number" })
  localTimeouts = new MapSchema<number>();

  timeouts: Record<string, number> = {};

  lastPlayedTime: number;

}