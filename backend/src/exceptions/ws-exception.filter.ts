import { Catch, ArgumentsHost, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch(WsException)
export class WsExceptionFilter implements ExceptionFilter {

  catch(exception: WsException , host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    client.emit("error", exception)
  }
}
