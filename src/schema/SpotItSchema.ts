import { Schema, ArraySchema, MapSchema, type } from "@colyseus/schema";
import { User } from "./User";
import { GameState } from "./GameState";
import { Card } from "./Card";

export class SpotItSchema extends Schema {
  
  @type({ map: User })
  players = new MapSchema<User>();

  @type({ map: User })
  spectators = new MapSchema<User>();

  @type("string")
  host = "";

  @type("string")
  roomName = "";

  @type("string")
  mode = "lobby";

  @type(GameState)
  gameState = new GameState();

  @type([ Card ])
  deck = new ArraySchema<Card>();

}