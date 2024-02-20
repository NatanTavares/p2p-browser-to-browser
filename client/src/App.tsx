import type { Component } from 'solid-js';

const App: Component = () => {
  return (
    <main class='w-screen h-screen bg-zinc-200 flex flex-col'>
      <section class='flex justify-center items-center h-96'>
        <div class='flex flex-col items-center text-slate-800'>
          <h2 class='text-3xl font-bold text-center pb-4'>Welcome to p2p</h2>
          <p>This is a simple p2p application built with SolidJS and WebRTC.</p>
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
