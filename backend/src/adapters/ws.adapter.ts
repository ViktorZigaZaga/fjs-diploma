import * as WebSocket from 'ws';
import { WebSocketAdapter, INestApplicationContext } from '@nestjs/common';
import { MessageMappingProperties } from '@nestjs/websockets';
import { Observable, fromEvent, EMPTY } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';

export class WsAdapter implements WebSocketAdapter {
    constructor(private app: INestApplicationContext) {}

    create(port: any, options: WebSocket.ServerOptions<typeof WebSocket>) {
        return new WebSocket.Server({ port, ...options });
    }

    bindClientConnect(server: any, callback: any) {
        server.on('connection', callback);
    }

    bindMessageHandlers(
        client: WebSocket,
        handlers: MessageMappingProperties[],
        process: (data: any) => Observable<any>,
    ) {
        fromEvent(client, 'message')
        .pipe(
            mergeMap(data => this.bindMessageHandler(data, handlers, process)),
            filter(result => result),
        )
        .subscribe(response => client.send(JSON.stringify(response)));
    }

    bindMessageHandler(
        buffer: any,
        handlers: MessageMappingProperties[],
        process: (data: any) => Observable<any>,
    ): Observable<any> {
        const message = JSON.parse(buffer.data);
        const messageHandler = handlers.find(
        handler => handler.message === message.event,
        );
        if (!messageHandler) {
        return EMPTY;
        }
        return process(messageHandler.callback(message.data));
    }

    close(server: any) {
        server.close();
    }
}