<script>
  import '../app.css';
  export let data;
  import { page } from '$app/stores';
  const fullBleedRoutes = new Set(['/', '/petunjuk', '/about', '/example', '/latihan', '/example/plus-animasi', '/example/plus-animasi/2']);
  $: pathname = $page.url.pathname;
  $: isFullBleed = fullBleedRoutes.has(pathname);
</script>

<svelte:head>
  <!-- Fonts for playful headline and handwritten subtitle -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Lilita+One&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-900">
  <main class={isFullBleed ? 'min-h-screen p-0 m-0' : 'mx-auto max-w-3xl px-4 py-6'}>
    <slot />
  </main>
</div>

<style>
  /* Global blue glow animation for call-to-action buttons */
  :global(.glow-blue img) {
    animation: glow-blue 1.6s ease-in-out infinite;
  }

  @keyframes glow-blue {
    0%, 100% {
      filter: drop-shadow(0 0 0 rgba(37, 99, 235, 0));
    }
    50% {
      filter: drop-shadow(0 0 18px rgba(37, 99, 235, 0.85)) brightness(1.05);
    }
  }
</style>
