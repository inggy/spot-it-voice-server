import { Schema, type } from "@colyseus/schema";

export class TimeOut extends Schema {

  @type([ "number" ])
  allowedAfter: number;

  @type([ "number" ])
  errorCount: number;

}