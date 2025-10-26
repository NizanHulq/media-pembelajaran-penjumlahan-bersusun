<script>
  import { animate, spring } from 'motion';
  import { pressable } from '$lib/actions/pressable';
  let playBtn;
  function start() {
    if (playBtn) {
      animate(
        playBtn,
        { scale: [1, 0.94, 1.06, 1], rotate: [0, -3, 1, 0] },
        { duration: 0.45, easing: spring({ stiffness: 450, damping: 20 }) }
      );
    }
    setTimeout(() => (location.href = '/petunjuk'), 260);
  }
</script>

<!-- Home: full background + play button only -->
<section class="overflow-hidden p-0">
  <div class="home-hero">
    <button
      class="play-cta"
      use:pressable
      bind:this={playBtn}
      aria-label="Mulai"
      on:click={start}
    >
      <span class="sr-only">Mulai</span>
      <img src="/assets/images/buttons/button-play-home.png" alt="" aria-hidden="true" />
    </button>
  </div>
</section>
