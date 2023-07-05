import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage, WsException } from "@nestjs/websockets";
import { LobbyService } from "./lobby.service";
import { Server, Socket} from "socket.io";
import { CreateLobbyDto } from "./dto/createLobby.dto";
import { AuthService } from "../auth/auth.service";
import { AccountService } from "../account/accounts.service";
import { Logger, UseFilters} from "@nestjs/common";
import { WsExceptionFilter } from "../exceptions/ws-exception.filter";

@WebSocketGateway({ 
  namespace: '/lobbies',
  cors: true,
})
@UseFilters(WsExceptionFilter)
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  private connectedClients: Set<string> = new Set();
  private socketIdToLobby: Map<string, string> = new Map();
  private guestAccountIdToSocketId: Map<string, string> = new Map();

  private readonly logger = new Logger(LobbyGateway.name);

  constructor(
    private readonly lobbyService: LobbyService,
    private readonly accountService: AccountService,
    private readonly authService: AuthService,
  ) {} 
  
  async handleConnection(socket: Socket) {
    const userHasAccount = await this.userHasAccount(socket);

    if(!userHasAccount) {
      this.logger.error("User doesn't have an account")
      socket.emit("error", "User doesn't have an account")
      socket.disconnect();
    }
     
    this.connectedClients.add(socket.id);
    this.logger.log(`Client connected: ${socket.id}`);

  }

  async handleDisconnect(socket: Socket) {
    const accountId = await this.getAcountId(socket);
    const lobbyId = this.socketIdToLobby.get(socket.id)
    const existingLobby = await this.lobbyService.getById(lobbyId)
      .catch((error) => {
        this.logger.debug(error);
      });

    // socket is part of a lobby
    if(lobbyId && existingLobby) {

      socket.leave(lobbyId);
      this.socketIdToLobby.delete(socket.id);

      // handle lobby exit logic in the LobbyService
      const adminExited = await this.lobbyService.exit(accountId, lobbyId)
        .catch((error) => {
          return error;
        });

      // account was not admin
      if (adminExited) {

        await this.sendLobbyInfo(lobbyId);

      } else {

        // inform the rest of the lobby participaints
        this.server.to(lobbyId).emit('lobbyInfo', "Lobby was deleted by admin");

        // get all sockets that are in the room and disconnect them
        const roomSockets = await this.server.in(lobbyId).fetchSockets();
        for (let currentSocket of roomSockets) {
          this.socketIdToLobby.delete(currentSocket.id);
          currentSocket.disconnect();
        }
      }
    }

    this.guestAccountIdToSocketId.delete(accountId);
    this.connectedClients.delete(socket.id);
    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('createLobby')
  async createLobby(socket: Socket, lobbyDto: CreateLobbyDto) {
    const accountId = await this.getAcountId(socket);
    const { lobbyId } = await this.lobbyService.create(lobbyDto, accountId); //ERROR HERE

    this.logger.debug("Lobby created")

    // add admin to the lobby room
    socket.join(lobbyId); 

    // keep track of the room
    this.socketIdToLobby.set(socket.id, lobbyId);

    // send lobby data to the admin
    await this.sendLobbyInfo(lobbyId);

    return {lobbyId: lobbyId}
  }

  @SubscribeMessage('joinLobby')
  async joinLobby(socket: Socket, lobbyCode: string) {
    const accountId = await this.getAcountId(socket);    
    const lobbyId = (await this.lobbyService.join(accountId, lobbyCode)).lobbyId;
 
    // add client to the lobby room
    socket.join(lobbyId);
    
    // keep track of the room
    this.socketIdToLobby.set(socket.id, lobbyId);
    this.guestAccountIdToSocketId.set(accountId, socket.id);

    socket.emit("joinLobby", lobbyId);

    await this.sendLobbyInfo(lobbyId);
  }

  @SubscribeMessage('closeLobby')
  async closeLobby(socket: Socket) {
    const accountId = await this.getAcountId(socket);    
    const lobbyId = this.socketIdToLobby.get(socket.id);

    const gameId = await this.lobbyService.closeLobby(lobbyId, accountId);

    // send the game id to all the clients from that lobby 
    this.server.to(lobbyId).emit('lobbyInfo', {gameId: gameId});
  } 

  @SubscribeMessage('kickUserOut')
  async kickUserOut(socket: Socket, guestUsername: string) {
    const accountId = await this.getAcountId(socket);
    const lobbyId = this.socketIdToLobby.get(socket.id);

    if(!this.lobbyService.isAllowedToKickOutLobbyGuest(lobbyId, accountId)) {
      throw new WsException("Forbidden");
    }

    const accountIdToBeKickedOut = (await this.accountService.getAccountByUsername({username: guestUsername})).id;

    const socketId = this.guestAccountIdToSocketId.get(accountIdToBeKickedOut); 

    this.server.in(socketId).emit('lobbyInfo', "Lobby admin kicked you out");
  } 

  private async userHasAccount(socket: Socket) {
    const accountId = await this.getAcountId(socket);

    if(!accountId) {
      return false;
    }

    return true;
  }

  private async getAcountId(socket: Socket) {
    try {
      const token = socket.handshake.headers.access_token.toString();
      const decodedToken = await this.authService.verifyJwt(token);
      const accountId = decodedToken.sub; 

      return accountId;
    } catch (error) {
      return null;
    }
  }

  /**
   * sends the (updated) lobby info to everyone from the lobby
   * @param socket 
   * @param lobbyId 
   */
  async sendLobbyInfo(lobbyId: string) {
    const updatedLobby = await this.lobbyService.getById(lobbyId);
    this.server.to(lobbyId).emit('lobbyInfo', updatedLobby);
  }
}

