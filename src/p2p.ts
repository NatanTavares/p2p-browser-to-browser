import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { dcutr } from '@libp2p/dcutr';
import { identify } from '@libp2p/identify';
import { webRTC } from '@libp2p/webrtc';
import { webSockets } from '@libp2p/websockets';
import { createLibp2p } from 'libp2p';
import * as filters from '@libp2p/websockets/filters';

export const node = await createLibp2p({
  transports: [
    webRTC(),
    webSockets({ filter: filters.all }),
    circuitRelayTransport({ discoverRelays: 1 }),
  ],
  addresses: {
    listen: ['/webrtc'],
  },
  connectionEncryption: [noise()],
  streamMuxers: [yamux()],
  services: {
    identify: identify(),
    pubsub: gossipsub(),
    dcutr: dcutr(),
  },
  connectionManager: {
    minConnections: 0,
    maxConnections: 10,
  },
  connectionGater: {
    denyDialMultiaddr: async () => false,
  },
});

