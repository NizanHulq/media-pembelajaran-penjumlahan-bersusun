<script>
  import { pressable } from "$lib/actions/pressable";
  import { goto } from "$app/navigation";
  import { animate, spring } from "motion";
  import { onMount } from "svelte";

  let celebrateEl;
  let congratsEl;
  let yeyEl;
  let fireworksEl;
  // Tweakable animation durations (in seconds)
  const YAY_DURATION = 4.0; // vertical reveal duration for yey image
  const FIREWORKS_POP = 0.5; // small pop-in when fireworks appear
  const REVEAL_SPLIT = 0.4; // when to trigger fireworks (fraction of YAY_DURATION)

  function playAgain() {
    // same destination as the cover Play button
    goto("/petunjuk");
  }

  onMount(() => {
    if (!yeyEl || !fireworksEl) return;
    // Initial states
    fireworksEl.style.opacity = "0";
    fireworksEl.classList.remove("sparkle");
    yeyEl.style.opacity = "0";
    // Yey reveal using clip-path: rise upward slowly from behind the card
    const D = YAY_DURATION; // seconds
    // Ensure initial clip hides from bottom; then reveal to full
    yeyEl.style.clipPath = "inset(100% 0 0 0)";
    animate(
      yeyEl,
      {
        opacity: [0, 1],
        transform: [
          "translate(-50%, 18px) scale(0.98)",
          "translate(-50%, 0px) scale(1)",
        ],
        clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"],
      },
      { duration: D, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
    // Halfway through, pop fireworks and start sparkle
    const triggerMs = D * 1000 * REVEAL_SPLIT;
    setTimeout(() => {
      fireworksEl.style.opacity = "1";
      // rely on calm layered pulse below; no extra sparkle class
      // gentle pop-in
      animate(
        fireworksEl,
        {
          transform: [
            "translate(-50%, -8%) scale(0.92)",
            "translate(-50%, -10%) scale(1)",
          ],
        },
        {
          duration: FIREWORKS_POP,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
      );
    }, triggerMs);
  });
</script>

<svelte:head>
  <title>Exam Selesai</title>
  <meta
    name="description"
    content="Terima kasih sudah mengerjakan semua soal."
  />
  <link rel="preload" as="image" href="/assets/images/backgrounds/bg-2.png" />
</svelte:head>

<section class="finish-screen" aria-labelledby="finish-title">
  <h1 id="finish-title" class="sr-only">Exam Selesai</h1>

  <!-- Celebration overlay -->
  <div class="celebrate" bind:this={celebrateEl} aria-hidden="true">
    <img
      class="congrats"
      bind:this={congratsEl}
      src="/assets/images/materials/finish/congratulations.png"
      alt=""
    />
    <img
      class="yey"
      bind:this={yeyEl}
      src="/assets/images/materials/finish/yey.png"
      alt=""
    />
    <div class="fireworks" bind:this={fireworksEl} aria-hidden="true">
      <img class="fw fw-a" src="/assets/images/materials/finish/fireworks.png" alt="" />
      <img class="fw fw-b" src="/assets/images/materials/finish/fireworks.png" alt="" />
    </div>
  </div>

  <!-- Small Play Again button bottom-center -->
  <button
    class="play-again glow-blue"
    use:pressable
    on:click={playAgain}
    aria-label="Main lagi"
  >
    <img src="/assets/images/buttons/button-play-home.png" alt="" />
    <span class="sr-only">Main lagi</span>
  </button>
</section>

<style>
  .finish-screen {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100svh;
    background:
      url("/assets/images/backgrounds/bg-2.png") top center / 100% 100%
        no-repeat,
      linear-gradient(180deg, #e6eaff 0%, #dbe6ff 100%);
    padding: 0;
    isolation: isolate;
  }
  .celebrate {
    position: absolute;
    left: 50%;
    /* Adjust overall vertical position of the celebration block here */
    top: var(--celebrate-top, clamp(42vh, 50vh, 56vh));
    transform: translateX(-50%);
    width: min(92vw, 720px);
    height: clamp(220px, 44vh, 380px);
    pointer-events: none;
    z-index: 5;
  }
  .celebrate img {
    display: block;
    user-select: none;
  }
  .congrats {
    position: absolute;
    /* Push congratulations image lower by setting --congrats-top (e.g. 6% or 10%) */
    top: var(--congrats-top, 6%);
    left: 50%;
    transform: translateX(-50%);
    width: min(92vw, 720px);
    height: auto;
    z-index: 10;
  }
  .yey {
    position: absolute;
    left: 50%;
    /* Place yey above the congratulations box */
    top: var(--yey-top, -38%);
    transform: translate(-50%, 0%);
    width: min(68vw, 560px);
    height: auto;
    z-index: 20; /* above congrats */
    /* Start fully clipped from bottom; JS animates to reveal */
    clip-path: inset(100% 0 0 0);
  }
  .fireworks {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -10%);
    /* Raise fireworks higher by default; still customizable via --fireworks-top */
    top: var(--fireworks-top, -90%);
    width: min(72vw, 580px);
    height: auto;
    z-index: 15; /* below yey (20) but above congrats (10) */
    pointer-events: none;
  }
  .fireworks .fw {
    position: absolute;
    inset: 0 auto auto 0; /* top:0; left:0 */
    width: 100%;
    height: auto;
    opacity: 0.4;
    transform: translateZ(0) scale(0.98);
    animation: fw-pulse 2.8s ease-in-out infinite;
  }
  .fireworks .fw-a { animation-duration: 2.8s; animation-delay: 0s; }
  .fireworks .fw-b { animation-duration: 3.6s; animation-delay: -0.8s; opacity: 0.5; }
  @keyframes fw-pulse {
    0%   { transform: scale(0.98); opacity: 0.4; filter: drop-shadow(0 0 0 rgba(255,230,120,0)); }
    50%  { transform: scale(1.04); opacity: 0.9; filter: drop-shadow(0 0 14px rgba(255,230,120,0.8)); }
    100% { transform: scale(0.98); opacity: 0.4; filter: drop-shadow(0 0 0 rgba(255,230,120,0)); }
  }
  /* sparkle effect: perpetual ease-in-out blink + glow */
  .sparkle {
    animation: sparkle 1s ease-in-out infinite;
  }
  @keyframes sparkle {
    0% {
      opacity: 0.65;
      filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0));
      transform: translate(-50%, -10%) scale(1);
    }
    50% {
      opacity: 1;
      filter: drop-shadow(0 0 22px rgba(255, 230, 120, 0.9)) brightness(1.08);
      transform: translate(-50%, -10%) scale(1.045);
    }
    100% {
      opacity: 0.65;
      filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0));
      transform: translate(-50%, -10%) scale(1);
    }
  }

  .play-again {
    --btn-size: clamp(56px, 10vw, 96px);
    position: absolute;
    top: clamp(12px, 2.5vw, 20px);
    right: clamp(12px, 2.5vw, 20px);
    width: calc(var(--btn-size) * 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    transition:
      transform 160ms ease,
      filter 160ms ease;
    z-index: 40; /* above celebration visuals */
  }
  .play-again img {
    width: 100%;
    height: auto;
    display: block;
  }
  .play-again:hover,
  .play-again:focus-visible,
  .play-again:active {
    transform: scale(1.04);
    filter: brightness(1.05);
  }
  .play-again:focus-visible {
    outline: 3px solid #facc15;
    outline-offset: 4px;
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
