<script>
  import { onMount, onDestroy } from 'svelte';
  import { pressable } from '$lib/actions/pressable';

  // Auto-hide navigation controls after brief inactivity
  const HIDE_DELAY = 2000;
  let showNav = true;
  let hideTimer;

  function scheduleHide() {
    clearTimeout(hideTimer);
    if (!showNav) return;
    hideTimer = setTimeout(() => {
      showNav = false;
      hideTimer = undefined;
    }, HIDE_DELAY);
  }

  function handlePointerDown() {
    if (!showNav) {
      showNav = true;
    }

    scheduleHide();
  }

  onMount(() => {
    scheduleHide();
  });

  onDestroy(() => {
    clearTimeout(hideTimer);
  });
</script>

<svelte:head>
  <title>Tujuan Pembelajaran</title>
</svelte:head>

<section class="about-screen" aria-labelledby="about-title" on:pointerdown={handlePointerDown}>
  <h1 id="about-title" class="sr-only">Tentang Media Pembelajaran</h1>

  <div class="sr-only">
    <p>Halaman ini menampilkan informasi tentang media pembelajaran berhitung yang sedang kamu gunakan.</p>
  </div>

  

  <a
    href="/menu"
    class="nav-btn home-bottom"
    use:pressable
    class:is-hidden={!showNav}
    aria-label="Kembali ke Menu"
    aria-hidden={!showNav}
    tabindex={showNav ? undefined : -1}
  >
    <img src="/assets/images/buttons/button-home.png" alt="" />
    <span class="sr-only">Menu</span>
  </a>

</section>

<style>
  .about-screen {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100dvh;
    background:
      url('/assets/images/backgrounds/bg-about.png') top center / 100% 100% no-repeat,
      linear-gradient(180deg, #e6eaff 0%, #dbe6ff 100%);
    padding: clamp(1rem, 4vw, 3rem);
    padding-left: max(env(safe-area-inset-left, 0px), clamp(1rem, 4vw, 2.75rem));
    padding-right: max(env(safe-area-inset-right, 0px), clamp(1rem, 4vw, 2.75rem));
    padding-bottom: clamp(1.5rem, 6vw, 3.5rem);
    isolation: isolate;
  }

  .nav-btn {
    --btn-size: clamp(56px, 10vw, 96px);
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(var(--btn-size) * 0.6);
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    opacity: 1;
    transform: translateY(0) scale(1);
    transition:
      opacity 200ms ease-in-out,
      transform 200ms ease-in-out,
      filter 160ms ease;
  }

  .nav-btn img {
    width: 100%;
    height: auto;
    display: block;
  }

  .nav-btn:hover,
  .nav-btn:focus-visible,
  .nav-btn:active {
    transform: scale(1.04);
    filter: brightness(1.05);
  }

  .nav-btn:focus-visible {
    outline: 3px solid #facc15;
    outline-offset: 4px;
  }

  .nav-btn:active {
    transition-duration: 90ms;
  }

  .nav-btn.is-hidden {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
    pointer-events: none;
  }

  .nav-btn.home-bottom {
    bottom: clamp(1.25rem, 4vw, 3rem);
    left: 50%;
    transform: translateX(-50%);
  }

  @media (max-width: 640px) {
    .nav-btn {
      --btn-size: clamp(48px, 20vw, 88px);
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
