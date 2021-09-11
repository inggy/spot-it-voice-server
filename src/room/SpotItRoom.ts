import { Room, Client, Delayed } from "colyseus";
import { SpotItSchema } from "../schema/SpotItSchema";
import { addPlayerToGame, removeUserFromGame, getNumberOfPlayers, buildUser, addSpectatorToGame, getPlayer, getSpectator } from "../schema/actions/PlayerActions";
import { setHost, getHost, getMode, moveToPreGameState, selectSymbol, resetGame, moveToInProgressState } from "../schema/actions/GameActions";
import { debugDeck, realDeck } from "../helper/BasicDeckGenerator";

const MAX_PLAYERS = 8;

export class SpotItRoom extends Room<SpotItSchema> {
  public delayedTimeout: Delayed;

  onCreate (options: any) {
    const newGame = new SpotItSchema();
    newGame.roomName = options.roomName;
    if (options.isProduction) {
      newGame.deck = realDeck;
    } else {
      newGame.deck = debugDeck;
    }
    
    
    this.clock.start();
    this.setPatchRate(25);
    this.setState(newGame);

    this.onMessage("startGame", (client) => {
      if (client.id === getHost(this.state)) {
        moveToPreGameState(this.state);
        
        this.delayedTimeout = this.clock.setTimeout(() => {
          moveToInProgressState(this.state);
          this.delayedTimeout.clear();
        }, 3000)
           
      }
    });

    this.onMessage("sitDown", (client) => {
      const clientId = client.id;
      const state = this.state;

      const spectator = getSpectator(state, clientId);
      if (spectator && getNumberOfPlayers(state) < MAX_PLAYERS) {
        removeUserFromGame(state, clientId);
        addPlayerToGame(state, spectator);
        if (getNumberOfPlayers(state) === 1) {
          setHost(state, clientId);
        }
      }
    });

    this.onMessage("standUp", (client) => {
      const clientId = client.id;
      const state = this.state;

      const player = getPlayer(state, clientId);
      if (player) {
        removeUserFromGame(state, clientId);
        addSpectatorToGame(state, player);

        if (getHost(state) === clientId && getNumberOfPlayers(state) > 0) {
          setHost(this.state, Object.keys(this.state.players)[0]);
        }
      }
    });
    
    this.onMessage("selectSymbol", (client, message) => {
      selectSymbol(this.state, client.id, message.symbol, message.centerCardIndex, message.localTime);
    });

    this.onMessage("returnLobby", (client, message) => {
      if (client.id === this.state.host) {
        resetGame(this.state);
      }
    });
  }

  onJoin (client: Client, options: any) {
    const state = this.state;

    const user = buildUser(client.sessionId, options.name);
    if (getNumberOfPlayers(state) === MAX_PLAYERS || getMode(state) !== "lobby") {
      addSpectatorToGame(state, user);
    } else {
      addPlayerToGame(state, user);
      if (getNumberOfPlayers(state) === 1) {
        setHost(this.state, client.sessionId);
      }
    }       
  }

  onLeave (client: Client, consented: boolean) {
    removeUserFromGame(this.state, client.sessionId);
    
    if (getHost(this.state) === client.id && getNumberOfPlayers(this.state) > 0) {
      setHost(this.state, Object.keys(this.state.players)[0]);
    }
  }

  onDispose() {
  }
}