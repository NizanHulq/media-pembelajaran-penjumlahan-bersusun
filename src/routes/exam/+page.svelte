<script>
  import { pressable } from "$lib/actions/pressable";
</script>

<svelte:head>
  <title>Exam</title>
  <meta name="description" content="Halaman utama exam (latihan soal)." />
  <link rel="preload" as="image" href="/assets/images/backgrounds/bg-exam.png" />
  <link rel="preload" as="image" href="/assets/images/buttons/next.png" />
  <link rel="preload" as="image" href="/assets/images/buttons/previous.png" />
  <link rel="preload" as="image" href="/assets/images/buttons/button-home.png" />
</svelte:head>

<section class="exam-screen" aria-labelledby="exam-title">
  <h1 id="exam-title" class="sr-only">Halaman Exam</h1>

  <div class="sr-only">
    <p>Halaman ini menampilkan latar sebelum masuk ke exam (soal pertama).</p>
  </div>

  <a href="/" class="nav-btn home" use:pressable aria-label="Kembali ke halaman utama">
    <img src="/assets/images/buttons/button-home.png" alt="" />
    <span class="sr-only">Home</span>
  </a>

  <a
    href="/example/plus-animasi/2"
    class="nav-btn previous"
    use:pressable
    aria-label="Halaman sebelumnya: Contoh 2 (animasi)"
  >
    <img src="/assets/images/buttons/previous.png" alt="" />
    <span class="sr-only">Halaman sebelumnya</span>
  </a>

  <a href="/exam/1" class="nav-btn next glow-blue" use:pressable aria-label="Halaman selanjutnya: Soal 1">
    <img src="/assets/images/buttons/next.png" alt="" />
    <span class="sr-only">Halaman selanjutnya</span>
  </a>
</section>

<style>
  .exam-screen {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100svh;
    background:
      url("/assets/images/backgrounds/bg-exam.png") top center / 100% 100% no-repeat,
      linear-gradient(180deg, #e6eaff 0%, #dbe6ff 100%);
    padding: 0;
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
    transition: transform 160ms ease, filter 160ms ease;
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

  .nav-btn.home { top: 12px; left: 12px; }
  .nav-btn.previous { bottom: 12px; left: 12px; }
  .nav-btn.next { bottom: 12px; right: 12px; }

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
