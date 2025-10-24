<svelte:head>
  <title>Petunjuk Penggunaan</title>
</svelte:head>

<section class="guide-screen" aria-labelledby="guide-title">
  <h1 id="guide-title" class="sr-only">Petunjuk Penggunaan</h1>

  <div class="sr-only">
    <p>Ikuti langkah-langkah berikut saat mengerjakan latihan berhitung.</p>
    <ol>
      <li>Baca soal dan pilih angka yang benar.</li>
      <li>Jawaban benar menampilkan emot senang dan menandai pilihan.</li>
      <li>Jawaban salah menampilkan emot sedih dan membuat angka bergetar.</li>
      <li>Gunakan tombol navigasi untuk berpindah halaman.</li>
    </ol>
  </div>

  <a href="/" class="guide-btn home" aria-label="Kembali ke halaman utama">
    <img src="/assets/images/buttons/button-home.png" alt="" />
    <span class="sr-only">Home</span>
  </a>

  <a href="/" class="guide-btn previous" aria-label="Halaman sebelumnya: Home">
    <img src="/assets/images/buttons/previous.png" alt="" />
    <span class="sr-only">Halaman sebelumnya</span>
  </a>

  <a
    href="/about"
    class="guide-btn next"
    aria-label="Halaman selanjutnya: Tentang"
  >
    <img src="/assets/images/buttons/next.png" alt="" />
    <span class="sr-only">Halaman selanjutnya</span>
  </a>
</section>

<style>
  .guide-screen {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100dvh;
    background:
      url("/assets/images/backgrounds/bg-guides.png") top center / 100% auto
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

  .guide-btn {
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

  .guide-btn img {
    width: 100%;
    height: auto;
    display: block;
  }

  .guide-btn:hover,
  .guide-btn:focus-visible,
  .guide-btn:active {
    transform: scale(1.04);
    filter: brightness(1.05);
  }

  .guide-btn:focus-visible {
    outline: 3px solid #facc15;
    outline-offset: 4px;
  }

  .guide-btn:active {
    transition-duration: 90ms;
  }

  .guide-btn.home {
    top: clamp(1rem, 4vw, 2.75rem);
    left: clamp(1rem, 4vw, 2.75rem);
  }

  .guide-btn.previous {
    bottom: clamp(1.25rem, 4vw, 3rem);
    left: clamp(1rem, 4vw, 2.75rem);
  }

  .guide-btn.next {
    bottom: clamp(1.25rem, 4vw, 3rem);
    right: clamp(1rem, 4vw, 2.75rem);
  }

  @media (max-width: 640px) {
    .guide-btn {
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
