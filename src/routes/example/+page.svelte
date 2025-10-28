<script>
  import { pressable } from "$lib/actions/pressable";
</script>

<svelte:head>
  <title>Contoh</title>
  <meta
    name="description"
    content="Halaman contoh interaksi sebelum latihan."
  />
  <link
    rel="preload"
    as="image"
    href="/assets/images/backgrounds/bg-example.png"
  />
</svelte:head>

<section class="example-screen" aria-labelledby="example-title">
  <h1 id="example-title" class="sr-only">Halaman Contoh</h1>

  <div class="sr-only">
    <p>Halaman ini menampilkan contoh tampilan sebelum masuk ke latihan.</p>
  </div>

  <a
    href="/"
    class="nav-btn home"
    use:pressable
    aria-label="Kembali ke halaman utama"
  >
    <img src="/assets/images/buttons/button-home.png" alt="" />
    <span class="sr-only">Home</span>
  </a>

  <a
    href="/about"
    class="nav-btn previous"
    use:pressable
    aria-label="Halaman sebelumnya: Tentang"
  >
    <img src="/assets/images/buttons/previous.png" alt="" />
    <span class="sr-only">Halaman sebelumnya</span>
  </a>

  <a
    href="/example/plus-animasi"
    class="nav-btn next glow-blue"
    use:pressable
    aria-label="Halaman selanjutnya: Contoh plus animasi"
  >
    <img src="/assets/images/buttons/next.png" alt="" />
    <span class="sr-only">Halaman selanjutnya</span>
  </a>
</section>

<style>
  .example-screen {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100dvh;
    background:
      url("/assets/images/backgrounds/bg-example.png") top center / 100% 100%
        no-repeat,
      linear-gradient(180deg, #e6eaff 0%, #dbe6ff 100%);
    padding: clamp(1rem, 4vw, 3rem);
    padding-left: max(
      env(safe-area-inset-left, 0px),
      clamp(1rem, 4vw, 2.75rem)
    );
    padding-right: max(
      env(safe-area-inset-right, 0px),
      clamp(1rem, 4vw, 2.75rem)
    );
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
    transition:
      transform 160ms ease,
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

  .nav-btn.home {
    top: clamp(1rem, 4vw, 2.75rem);
    left: clamp(1rem, 4vw, 2.75rem);
  }

  .nav-btn.previous {
    bottom: clamp(1.25rem, 4vw, 3rem);
    left: clamp(1rem, 4vw, 2.75rem);
  }

  .nav-btn.next {
    bottom: clamp(1.25rem, 4vw, 3rem);
    right: clamp(1rem, 4vw, 2.75rem);
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
