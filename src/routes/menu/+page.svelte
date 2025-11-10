<script>
  import { pressable } from "$lib/actions/pressable";
</script>

<svelte:head>
  <title>Menu</title>
  <link rel="preload" as="image" href="/assets/images/backgrounds/bg-2.png" />
</svelte:head>

<section class="menu-screen" aria-labelledby="menu-title">
  <h1 id="menu-title" class="title">Menu</h1>

  <nav class="menu-list" aria-label="Menu utama">
    <a href="/about" class="menu-item" use:pressable>
      <img class="icon" src="/assets/images/buttons/info.png" alt="" />
      <span class="label">Tujuan Pembelajaran</span>
    </a>

    <a href="/example" class="menu-item" use:pressable>
      <img class="icon" src="/assets/images/buttons/star.png" alt="" />
      <span class="label">Materi</span>
    </a>

    <a href="/exam/1" class="menu-item" use:pressable>
      <img class="icon" src="/assets/images/buttons/play.png" alt="" />
      <span class="label">Soal</span>
    </a>
  </nav>
</section>

<style>
  .menu-screen {
    min-height: 100svh;
    background:
      url("/assets/images/backgrounds/bg-2.png") top center / 100% 100%
        no-repeat,
      linear-gradient(180deg, #e6eaff 0%, #dbe6ff 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; /* vertical middle */
    gap: clamp(12px, 3vh, 18px);
    padding: clamp(1rem, 4vw, 2rem);
  }

  .title {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    color: #0b1220;
    margin: clamp(0.5rem, 2vh, 1rem) 0;
    text-shadow: 0 2px 0 #fff;
  }

  .menu-list {
    display: grid;
    align-content: center;
    justify-items: center;
    gap: clamp(22px, 5vh, 36px);
  }

  .menu-item {
    --size: clamp(72px, 18vw, 120px);
    display: grid;
    justify-items: center;
    text-decoration: none;
    color: #0b1220;
    transition:
      transform 140ms ease,
      filter 140ms ease;
    -webkit-tap-highlight-color: transparent;
  }

  .menu-item:focus-visible {
    outline: 3px solid #facc15;
    outline-offset: 6px;
    border-radius: 18px;
  }

  .menu-item:hover,
  .menu-item:active {
    transform: translateY(-2px) scale(1.02);
    filter: brightness(1.04);
  }

  .icon {
    width: var(--size);
    height: var(--size);
    display: block;
  }

  .label {
    font-size: clamp(1.1rem, 3.2vw, 1.5rem);
    font-weight: 800;
    margin-top: clamp(8px, 1.6vh, 12px);
  }
</style>
