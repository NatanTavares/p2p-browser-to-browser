import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { bootstrap } from '@libp2p/bootstrap';
import { webSockets } from '@libp2p/websockets';
import { createLibp2p } from 'libp2p';
import { createSignal, type Component, Show, For, onMount } from 'solid-js';

// Know peers addresses
const bootstrapMultiaddres = [
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
];

const node = await createLibp2p({
  transports: [webSockets()],
  connectionEncryption: [noise()],
  streamMuxers: [yamux()],
  peerDiscovery: [
    bootstrap({
      list: bootstrapMultiaddres,
    }),
  ],
});

// all libp2p debug logs
localStorage.setItem('debug', 'libp2p:*'); // then refresh the page to ensure the libraries can read this when spinning up.

// networking debug logs
localStorage.setItem(
  'debug',
  'libp2p:websockets,libp2p:webtransport,libp2p:kad-dht,libp2p:dialer',
);

const App: Component = () => {
  const [peersConn, setPeersConn] = createSignal<string[]>([]);
  const [peersFounded, setPeersFounded] = createSignal<string[]>([]);
  const [isSearching, setIsSearching] = createSignal<boolean>(true);

  const handleConn = async () => {
    await node.start();
    setIsSearching(true);
    console.log('libp2p has started');
  };

  const handleStop = async () => {
    await node.stop();

    setIsSearching(() => {
      setPeersConn([]);
      setPeersFounded([]);
      return false;
    });

    console.log('libp2p has stopped');
  };

  const sendMsg = async () => {
    console.log('Sending...');
  };

  const receiveMsg = async () => {
    console.log('Receiving...');
  };

  onMount(async () => {
    node.addEventListener('peer:discovery', (event) => {
      console.log('Discovered:', event.detail.id.toString());
      setPeersFounded((prev) => {
        const p = event.detail.id.toString();
        if (prev.includes(p)) return prev;
        return [...prev, p];
      });
    });

    node.addEventListener('peer:connect', (event) => {
      console.log('Connected:', event.detail.toString());
      setPeersConn((prev) => {
        const p = event.detail.toString();
        if (prev.includes(p)) return prev;
        return [...prev, p];
      });
    });
  });

  return (
    <main class='w-screen h-screen bg-zinc-200 flex flex-col'>
      <section class='flex flex-col items-center h-full pt-40'>
        <div class='flex flex-col items-center text-slate-800'>
          <h2 class='text-3xl font-bold text-center pb-4'>Welcome to p2p</h2>
          <p>This is a simple p2p application built with SolidJS and WebRTC.</p>
        </div>

        <div class='flex gap-4'>
          <div class='w-[140px] h-[30px] mt-10'>
            <button
              class='w-full h-full bg-indigo-400 border rounded text-zinc-100 hover:bg-indigo-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={handleConn}
              disabled={isSearching()}
            >
              connect
            </button>
          </div>

          <div class='w-[140px] h-[30px] mt-10'>
            <button
              class='w-full h-full bg-red-400 border rounded text-zinc-100 hover:bg-red-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={handleStop}
              disabled={!isSearching()}
            >
              disconnect
            </button>
          </div>
        </div>

        <Show when={isSearching()}>
          <div class='mt-4'>
            <Show when={peersFounded().length}>
              <div class='flex flex-col py-4'>
                <h2 class='text-lg font-medium'>
                  Peers founded{' '}
                  <span class='text-sm ml-2 text-center animate-pulse'>
                    searching...
                  </span>
                </h2>
                <ul class='flex flex-col gap-0.5'>
                  <For each={peersFounded()}>
                    {(peer) => <li class='text-sm'>{peer}</li>}
                  </For>
                </ul>
              </div>
            </Show>
          </div>
        </Show>

        <Show when={peersConn().length}>
          <div class='flex flex-col mt-4'>
            <h2 class='text-lg font-medium'>Peers connected</h2>
            <ul class='flex flex-col gap-0.5'>
              <For each={peersConn()}>
                {(peer) => <li class='text-sm'>{peer}</li>}
              </For>
            </ul>
          </div>
        </Show>
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
