<script>
  import '../app.css';
  export let data;
  import { page } from '$app/stores';
  const fullBleedRoutes = new Set(['/', '/petunjuk', '/about', '/example', '/latihan', '/latihan/plus-animasi']);
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
