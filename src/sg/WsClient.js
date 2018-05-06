// Copyright 2018 Nono Martínez Alonso <mail@nono.ma> & Jose Luis Garcia del Castillo
//
// The MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
/**
 * Author: Nono Martínez Alonso <mail@nono.ma>
 *
 * @fileoverview A wrapper of ReconnectWebsocket to init its events and handlers.
 */

class WsClient {

    constructor() {

        this.verbose = true;
        this.host = GLOBALS.wsHost;
        this.port = GLOBALS.wsPort;
        this.path = GLOBALS.wsPath;

        this.connected = false;
        this.bufferMessages = true;
        this.msgBuffer = [];

        this.setup();

        if (this.verbose) console.log('WsClient was created.');
    }

    setup() {
        this.setupWebsocket();
        this.setupHandlers();
    }

    // ██╗    ██╗███████╗██████╗ ███████╗ ██████╗  ██████╗██╗  ██╗███████╗████████╗███████╗
    // ██║    ██║██╔════╝██╔══██╗██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝██╔════╝
    // ██║ █╗ ██║█████╗  ██████╔╝███████╗██║   ██║██║     █████╔╝ █████╗     ██║   ███████╗
    // ██║███╗██║██╔══╝  ██╔══██╗╚════██║██║   ██║██║     ██╔═██╗ ██╔══╝     ██║   ╚════██║
    // ╚███╔███╔╝███████╗██████╔╝███████║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║   ███████║
    //  ╚══╝╚══╝ ╚══════╝╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝

    setupWebsocket() {

        this.ws = new ReconnectingWebsocket('ws://' + this.host + ':' + this.port + '/' + this.path, undefined, {});
        this.ws.timeout = 1000;

        this.ws.addEventListener('open', () => {
            console.log('Socket connection established');
            // this.ws.send('{"method":"send-strokes", "params": {"strokes": [[20,40,0,1,0],[25,40,1,0,0],[100,150,1,0,0]]}}');
            if (this.msgBuffer.length > 0) {
                console.log('Streaming buffer:');
                for (let i = 0; i < this.msgBuffer.length; i++) {
                    console.log(this.msgBuffer[i]);
                    this.send(this.msgBuffer[i]);
                }
                this.msgBuffer = [];
            }
        });

        this.ws.addEventListener('message', (e) => {
            // this.handleMessage(JSON.parse(e.data));
            console.log("Received: ");
            console.log(e);
            // console.log(JSON.parse(e.data));
            GLOBALS.robot.onMessage(e.data);
        });

        this.ws.addEventListener('close', () => {
            console.log('connection closed');
        });

        this.ws.onerror = (err) => {
            if (err.code === 'EHOSTDOWN') {
                console.log('server down');
            }
        };
    }

    // ██╗  ██╗ █████╗ ███╗   ██╗██████╗ ██╗     ███████╗██████╗ ███████╗
    // ██║  ██║██╔══██╗████╗  ██║██╔══██╗██║     ██╔════╝██╔══██╗██╔════╝
    // ███████║███████║██╔██╗ ██║██║  ██║██║     █████╗  ██████╔╝███████╗
    // ██╔══██║██╔══██║██║╚██╗██║██║  ██║██║     ██╔══╝  ██╔══██╗╚════██║
    // ██║  ██║██║  ██║██║ ╚████║██████╔╝███████╗███████╗██║  ██║███████║
    // ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝

    setupHandlers() {

        this.handlers = {
            "client-id": function(m) {
                console.log('Your id is ' + m.params.id);
            },
            "client-list": function(m) {
                console.log('Received client list.');
                // console.log(m.params.clients);
            }
        }

        this.handleMessage = function(m) {

            var method = m.method;

            if (method) {

                //if (this.verbose) console.log('★ Received ' + method + '.');

                if (this.handlers[method]) {
                    var handler = this.handlers[method];
                    handler(m);
                } else {
                    //if (this.verbose) console.log('(No handler for ' + method + '.)');
                }

            }
        }
    }

    // Helpers

    send(message) {
        try {
            this.ws.send(message);
        }
        catch (ex) {
            console.log(ex);
            if (this.bufferMessages) {
                this.msgBuffer.push(message);
            }
        }
    }

}

import GLOBALS from './../config.js';
import ReconnectingWebsocket from './lib/ReconnectingWebsocket.js';

export default WsClient;