import {
  For,
  Show,
  createSignal,
  onMount,
  type Component,
  createEffect,
} from 'solid-js';
import { node } from './p2p';

export const onUpdatePeerList = async () => {
  console.log('updating peer list...');
  node.getPeers().forEach((peer) => {
    console.log(peer.toString());

    for (const conn of node.getConnections()) {
      console.log(conn.remoteAddr.toString());
    }
  });
};

const App: Component = () => {
  const [peerID, setPeerID] = createSignal<string>('unk');

  const handleConn = async () => {
    console.log('connecting...');
  };

  const handleStop = async () => {
    console.log('disconnecting...');
  };

  const sendMsg = async () => {
    console.log('sending...');
  };

  onMount(async () => {
    node.addEventListener('connection:open', () => onUpdatePeerList);
    node.addEventListener('connection:close', () => onUpdatePeerList);

    return () => {
      node.removeEventListener('connection:open', () => onUpdatePeerList);
      node.removeEventListener('connection:close', () => onUpdatePeerList);
    };
  });

  createEffect(() => {
    setPeerID(node.peerId.toString());
  });

  return (
    <main class='w-screen h-screen bg-zinc-200 flex flex-col'>
      <section class='flex flex-col items-center h-full pt-40'>
        <div class='flex flex-col items-center text-slate-800'>
          <h2 class='text-3xl font-bold text-center pb-4'>p2p with pubsub</h2>
          <p>
            This is a simple p2p application built with SolidJS and WebRTC using
            libp2p.
          </p>
        </div>

        <div class='flex flex-col justify-center items-center'>
          <div class='flex justify-center items-center mt-6 text-sm'>
            <p class='mr-1 font-semibold'>peer id:</p>
            <p>{peerID()}</p>
          </div>
          <div class='flex justify-center items-center text-sm'>
            <p class='mr-1 font-semibold'>multaddr:</p>
            <p>
              /ip4/127.0.0.1/tcp/54750/ws/p2p/12D3KooWJSMv4RofHfNW4PwkvTm29J6jxrDJMzWXJSKwrZP8JB6B
            </p>
          </div>

          <div class='flex gap-4 mt-4'>
            <div class='w-[140px] h-[30px]'>
              <button
                class='w-full h-full bg-indigo-400 border rounded text-zinc-100 hover:bg-indigo-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
                onClick={handleConn}
              >
                connect
              </button>
            </div>

            <div class='w-[140px] h-[30px]'>
              <button
                class='w-full h-full bg-red-400 border rounded text-zinc-100 hover:bg-red-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
                onClick={handleStop}
              >
                disconnect
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer class='flex justify-center items-center mt-auto h-16 bg-zinc-300'>
        <a
          class='flex gap-1 text-sm text-indigo-700 hover:underline'
          href='https://github.com/NatanTavares'
          target='blank'
        >
          Natan Tavares
          <span class='text-slate-800'>© {new Date().getFullYear()}</span>
        </a>
      </footer>
    </main>
  );
};

export default App;
