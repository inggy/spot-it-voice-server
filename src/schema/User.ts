import { Schema, type } from "@colyseus/schema";


export class User extends Schema {

  @type("string")
  id: string = new Object().toString();
  
  @type("string")
  name: string = ""; 
}