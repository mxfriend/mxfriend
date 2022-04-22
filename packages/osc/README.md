# @mxfriend/osc

This package provides an OSC format 1.1 client and server written in TypeScript.
All OSC 1.1 required types (int, float, string, blob, booleans, nil, impulse
and timetag), as well as all the other non-standard types listed in the OSC 1.0
specification (bigint, double, symbol, char, RGBA color, MIDI message and arrays)
are supported, as are OSC bundles.

The only supported transport layer is UDP, which means the only supported runtime
environment is NodeJS. If you need support for other transport layers such as TCP
or WebSockets, feel free to send a PR.

## Installation

```shell
npm install --save @mxfriend/osc
```

## Usage

First you need to create an OSC Port. An OSC Port can both send and receive OSC
messages, so there's no separate client and server implementation.

The options object, as well as all of its properties, is optional; default values
and option descriptions are shown in the following example:

```typescript
import { OSCBundle, OSCMessage, OSCPort } from '@mxfriend/osc';

const osc = new OSCPort({
  localAddress: '0.0.0.0',  // the local IP the UDP socket should bind to; the default means all
  localPort: 0,             // the local port the UDP socket should bind to; 0 means random
  remoteAddress: undefined, // the default IP to send OSC messages to
  remotePort: undefined,    // the default port to send OSC messages to
  broadcast: false,         // set to true to enable sending UDP broadcasts
});

// binds the UDP port & sets up internal event listeners
await osc.open();

// subscribe to incoming OSC messages
osc.on('message', (message: OSCMessage) => {
  console.log(message.address, message.args);
});

// subscribe to incoming OSC bundles
osc.on('bundle', (bundle: OSCBundle) => {
  console.log(bundle.timetag, bundle.elements);
});

// send OSC messages
await osc.sendMessage({
  address: '/foo/bar',
  args: [
    { type: 'i', value: 123 },
    { type: 's', value: 'baz' },
  ],
});

// send OSC bundles
await osc.sendBundle({
  elements: [
    {
      address: '/foo/bar',
      args: [
        { type: 'i', value: 123 },
        { type: 's', value: 'baz' },
      ],
    }
  ],
  timetag: 12345678901234567890n // bigint
});
```

### ... wait, that's it?

Yep. I'm too impatient to write an extensive documentation at this point.
I'll get to it eventually, maybe. In the meantime just look through the code,
there's not a lot of it; in particular look at `src/types.ts` and `src/values.ts`
where the OSC argument types are defined.
