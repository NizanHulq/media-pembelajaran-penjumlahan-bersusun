<script>
  import '../app.css';
  export let data;
  import { page } from '$app/stores';
  const fullBleedRoutes = new Set(['/', '/petunjuk', '/about']);
  $: pathname = $page.url.pathname;
  $: isHome = pathname === '/';
  $: isFullBleed = fullBleedRoutes.has(pathname);
</script>

<svelte:head>
  <!-- Fonts for playful headline and handwritten subtitle -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Lilita+One&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-900">
  {#if !isFullBleed}
    <nav class="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-gray-200">
      <div class="mx-auto max-w-3xl px-4 py-3 flex items-center gap-2">
        <a href="/" class="font-extrabold text-xl tracking-tight">Berhitung Seru</a>
        <div class="ml-auto flex gap-2">
          <a href="/" class="btn btn-ghost">Home</a>
          <a href="/latihan/1" class="btn btn-primary">Mulai Latihan</a>
        </div>
      </div>
    </nav>
  {/if}
  <main class={isFullBleed ? 'min-h-screen p-0 m-0' : 'mx-auto max-w-3xl px-4 py-6'}>
    <slot />
  </main>
  {#if !isFullBleed}
    <footer class="mx-auto max-w-3xl px-4 py-8 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Media Pembelajaran Berhitung · Statis, cepat, dan ramah anak.
    </footer>
  {/if}
</div>
