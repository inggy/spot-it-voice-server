import http from "http";
import express from "express";
import cors from "cors";
import path from 'path';
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";
// import socialRoutes from "@colyseus/social/express"
import { SpotItRoom } from "./src/room/SpotItRoom";

const port = Number(process.env.PORT || 2567);
const app = express()

const isProduction = process.env.NODE_ENV === "production";

app.use(cors());
app.use(express.json())

const server = http.createServer(app);
const gameServer = new Server({
  server,
});

// register your room handlers
gameServer.define('spot-it', SpotItRoom, { isProduction })
  .filterBy(['roomName']);

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
if (isProduction) {
  app.use("/colyseus", monitor());
}

app.use('/', express.static(path.join(__dirname, "../public")));
gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`)
