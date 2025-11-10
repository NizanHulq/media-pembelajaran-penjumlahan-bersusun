<script>
  import { pressable } from "$lib/actions/pressable";
  import { animate, spring } from "motion";
  import { goto } from "$app/navigation";
  import { kunciPlusAnimasi2 } from "$lib/kunci/plus-animasi";

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const srcFor = (n) => `/assets/images/number-choose/${n}.png`;

  const ANIM_UP_DURATION = 7; // samakan dengan halaman 1
  const ANIM_LEFT_DURATION = 4; // samakan dengan halaman 1
  const ANIM_UP_SPRING = { stiffness: 30, damping: 14 }; // samakan
  const ANIM_LEFT_SPRING = { stiffness: 50, damping: 14 }; // samakan

  let slots = { left: null, center: null, right: null };
  let fillOrder = ["center", "right"];
  // Step 1: semua terkunci. Step 2: center+right. Step 3: kiri.
  let slotLocked = { left: true, center: true, right: true };
  let activeSlot = "center";
  let step = 1; // 1=blue, 2=choose & isi C/R, 3=red & isi L, 4=selesai

  // Kunci jawaban menyeluruh (left, center, right) untuk halaman 2
  const kunci = kunciPlusAnimasi2;

  let containerEl;
  let centerSlotEl;
  let isAnimating = false;
  let firstStageDone = false;
  $: canNavigate = firstStageDone && slots.left === kunci.left;
  $: nextGlow = step === 1 || canNavigate;
  $: crCorrect =
    slots.center !== null &&
    slots.right !== null &&
    slots.center === kunci.center &&
    slots.right === kunci.right &&
    !firstStageDone;
  $: rightBlue =
    (slots.center === kunci.center && slots.right === kunci.right) ||
    firstStageDone;
  $: showBubbleBlue = step === 1; // balon biru hanya di awal
  // Kotak highlight biru tetap muncul sampai center & right benar
  $: showHighlightBlue = step === 1 || (step === 2 && !crCorrect);
  $: showBubbleChoose = step === 2 && !firstStageDone;
  $: showBubbleRed = firstStageDone && step >= 3 && slots.left !== kunci.left;

  let showWrong = false;
  let wrongTimer;
  function popWrong() {
    showWrong = true;
    clearTimeout(wrongTimer);
    wrongTimer = setTimeout(() => (showWrong = false), 1200);
  }

  function nextTargetSlot() {
    for (const key of fillOrder) {
      if (!slotLocked[key] && slots[key] === null) return key;
    }
    return null;
  }

  function handlePick(n) {
    if (isAnimating) return;
    if (step === 1) return;
    let target = null;
    if (activeSlot && !slotLocked[activeSlot]) {
      target = activeSlot;
    } else {
      target = nextTargetSlot();
    }
    if (!target) return;
    slots = { ...slots, [target]: n };
    if (!firstStageDone && (target === "center" || target === "right")) {
      if (n !== kunci[target]) popWrong();
    }
    if (firstStageDone && target === "left") {
      if (n !== kunci.left) popWrong();
    }
    maybeAnimateIfCorrect();
    updateActiveSuggestion();
    if (firstStageDone && target === "left" && n === kunci.left) {
      step = Math.max(step, 4);
    }
  }

  function maybeAnimateIfCorrect() {
    if (
      slots.center !== null &&
      slots.right !== null &&
      slots.center === kunci.center &&
      slots.right === kunci.right &&
      !firstStageDone &&
      !isAnimating
    ) {
      isAnimating = true;
      flyCenterDigit();
    }
  }

  function flyCenterDigit() {
    if (!containerEl || !centerSlotEl) return;
    const containerRect = containerEl.getBoundingClientRect();
    const slotRect = centerSlotEl.getBoundingClientRect();

    const startX = slotRect.left - containerRect.left + slotRect.width / 2;
    const startY = slotRect.top - containerRect.top + slotRect.height / 2;

    const el = document.createElement("div");
    el.className = "flying-digit digit-display digit-3d";
    el.textContent = String(slots.center);
    Object.assign(el.style, {
      position: "absolute",
      left: `${startX}px`,
      top: `${startY}px`,
      transform: "translate(-50%, -50%)",
      zIndex: 50,
      fontSize: "clamp(100px, 11vw, 132px)",
    });
    containerEl.appendChild(el);

    centerSlotEl.classList.add("digit-hidden");

    const upY = containerRect.height * 0.1;
    const dyUp = upY - startY;
    const finalX = containerRect.width * 0.1;
    const dxLeft = finalX - startX;

    el.style.color = "#2563eb";

    animate(
      el,
      {
        transform: [
          "translate(-50%, -50%) translate(0px, 0px) scale(1)",
          `translate(-50%, -50%) translate(0px, ${dyUp}px) scale(1.05)`,
        ],
      },
      { duration: ANIM_UP_DURATION, easing: spring(ANIM_UP_SPRING) },
    ).finished.then(() => {
      animate(
        el,
        {
          transform: [
            `translate(-50%, -50%) translate(0px, ${dyUp}px)`,
            `translate(-50%, -50%) translate(${dxLeft}px, ${dyUp + 20}px)`,
          ],
        },
        { duration: ANIM_LEFT_DURATION, easing: spring(ANIM_LEFT_SPRING) },
      ).finished.then(() => {
        el.style.color = "#ef4444";
        firstStageDone = true;
        isAnimating = false;
        slots = { ...slots, center: null };
        slotLocked = { left: false, center: true, right: true };
        fillOrder = ["left"];
        activeSlot = "left";
        step = Math.max(step, 3);
        updateActiveSuggestion();
      });
    });
  }

  function setActive(slot) {
    if (slotLocked[slot]) return;
    activeSlot = slot;
  }

  function updateActiveSuggestion() {
    if (!firstStageDone) {
      if (!slotLocked.center && slots.center === null) {
        activeSlot = "center";
        return;
      }
      if (!slotLocked.right && slots.right === null) {
        activeSlot = "right";
        return;
      }
      if (slots.center !== kunci.center) {
        activeSlot = "center";
        return;
      }
      if (slots.right !== kunci.right) {
        activeSlot = "right";
        return;
      }
    } else {
      activeSlot = "left";
    }
  }
</script>

<svelte:head>
  <title>Latihan — Persiapan Animasi (2)</title>
  <meta
    name="description"
    content="Halaman pengantar sebelum latihan dengan animasi (soal kedua)."
  />
  <link
    rel="preload"
    as="image"
    href="/assets/images/backgrounds/bg-latihan-1-3.png"
  />
</svelte:head>

<section
  class="latihan-animasi-screen"
  aria-labelledby="latihan-animasi-title"
  bind:this={containerEl}
>
  <h1 id="latihan-animasi-title" class="sr-only">
    Halaman Latihan (Plus Animasi) — Soal 2
  </h1>

  <div class="sr-only">
    <p>Gunakan tombol navigasi untuk kembali atau lanjut ke soal latihan.</p>
  </div>

  <a
    href="/menu"
    class="nav-btn home"
    use:pressable
    aria-label="Kembali ke Menu"
  >
    <img src="/assets/images/buttons/button-home.png" alt="" />
    <span class="sr-only">Home</span>
  </a>

  <a
    href="/example/plus-animasi/1"
    class="nav-btn previous"
    use:pressable
    aria-label="Halaman sebelumnya: Contoh 1 (animasi)"
  >
    <img src="/assets/images/buttons/previous.png" alt="" />
    <span class="sr-only">Halaman sebelumnya</span>
  </a>

  <a
    href="/menu"
    class="nav-btn next"
    class:glow-blue={nextGlow}
    on:click|preventDefault={() => {
      if (step === 1) {
        step = 2;
        slotLocked = { left: true, center: false, right: false };
        fillOrder = ["center", "right"];
        activeSlot = "center";
        return;
      }
      if (canNavigate) {
        goto("/menu");
      }
    }}
    use:pressable
    aria-label="Halaman selanjutnya: Menu"
  >
    <img src="/assets/images/buttons/next.png" alt="" />
    <span class="sr-only">Halaman selanjutnya</span>
  </a>

  <div class="yellow-box" aria-hidden="true"></div>

  <div class="answer-slots" aria-label="Tempat jawaban dipilih">
    <div
      class="slot left"
      class:active={activeSlot === "left"}
      class:locked={slotLocked.left}
      on:click={() => setActive("left")}
    >
      <span class="slot-digit digit-display digit-3d" style="color: #ef4444"
        >{slots.left ?? ""}</span
      >
    </div>
    <div
      class="slot center"
      bind:this={centerSlotEl}
      class:active={activeSlot === "center"}
      class:locked={slotLocked.center}
      on:click={() => setActive("center")}
    >
      <span
        class="slot-digit digit-display digit-3d"
        style="color: {crCorrect ? '#2563eb' : '#0b1220'}"
        >{slots.center ?? ""}</span
      >
    </div>
    <div
      class="slot right"
      class:active={activeSlot === "right"}
      class:locked={slotLocked.right}
      on:click={() => setActive("right")}
    >
      <span
        class="slot-digit digit-display digit-3d"
        style="color: {rightBlue ? '#2563eb' : '#0b1220'}"
        >{slots.right ?? ""}</span
      >
    </div>
  </div>

  {#if showBubbleBlue}
    <img
      class="bubble-blue"
      src="/assets/images/materials/bubble-count-blue.png"
      alt="Hitung biru"
      width="320"
      height="120"
    />
  {/if}
  {#if showHighlightBlue}
    <div class="highlight-box highlight-blue" aria-hidden="true"></div>
  {/if}
  {#if showBubbleChoose}
    <img
      class="bubble-choose"
      src="/assets/images/materials/bubble-choose.png"
      alt="Pilih jawaban yang benar"
      width="320"
      height="120"
    />
  {/if}
  {#if showBubbleRed}
    <img
      class="bubble-red"
      src="/assets/images/materials/bubble-count-red.png"
      alt="Hitung merah"
      width="320"
      height="120"
    />
    <div class="highlight-box highlight-red" aria-hidden="true"></div>
  {/if}

  <div class="number-choose" role="group" aria-label="Pilih jawaban angka">
    {#each numbers as n}
      <button
        class="star-btn"
        type="button"
        use:pressable
        on:click={() => handlePick(n)}
        aria-label={`Pilih angka ${n}`}
      >
        <img class="star-img" src={srcFor(n)} alt="" />
        <span class="sr-only">{n}</span>
      </button>
    {/each}
  </div>

  {#if showWrong}
    <div class="wrong-toast" role="alert" aria-live="assertive">
      ❌ Jawaban salah
    </div>
  {/if}

  {#if firstStageDone && slots.left === kunci.left}
    <img
      class="correct-expression"
      src="/assets/images/materials/correct-expression.png"
      alt="Jawaban benar!"
      width="420"
      height="320"
    />
  {/if}
</section>

<style>
  .latihan-animasi-screen {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100dvh;
    background:
      url("/assets/images/backgrounds/bg-latihan-1-3.png") top center / 100%
        100% no-repeat,
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
    --choose-bottom: clamp(76px, 14vw, 120px);
    --gap: clamp(8px, 2vw, 14px);
    --star-size: clamp(56px, 14vw, 92px);
    --box-width: calc(var(--star-size) * 5 + var(--gap) * 4);
    --box-height: calc(var(--star-size) * 2 + var(--gap));
    /* Highlight sizing variables (viewport-based) */
    /* Use global defaults (from app.css) so Example 2 matches Example 1 */
    --blue-w: var(--hl-blue-w);
    --blue-h: var(--hl-blue-h);
    --blue-top: var(--hl-blue-top);
    --blue-side: var(--hl-blue-side);
    --red-w: var(--hl-red-w);
    --red-h: var(--hl-red-h);
    --red-top: var(--hl-red-top);
    --red-side: var(--hl-red-side);
  }

  @media (max-width: 360px) {
    .latihan-animasi-screen {
      /* inherit from :root (app.css) */
    }
  }
  @media (min-width: 480px) {
    .latihan-animasi-screen {
      /* inherit from :root (app.css) */
    }
  }

  .yellow-box {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: var(--choose-bottom);
    width: var(--box-width);
    height: var(--box-height);
    background: #fff3b0;
    border: 3px dashed #0b1220;
    border-radius: clamp(16px, 3vw, 22px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
    z-index: 1;
  }

  .number-choose {
    position: absolute;
    bottom: var(--choose-bottom);
    left: 50%;
    transform: translateX(-50%);
    display: grid;
    grid-template-columns: repeat(5, var(--star-size));
    gap: var(--gap);
    width: var(--box-width);
    height: var(--box-height);
    align-content: center;
    justify-items: center;
    pointer-events: auto;
    z-index: 2;
  }

  .answer-slots {
    position: absolute;
    left: clamp(12px, 6vw, 28px);
    right: clamp(12px, 6vw, 28px);
    bottom: calc(
      var(--choose-bottom) + var(--box-height) + clamp(10px, 3vw, 18px)
    );
    height: clamp(92px, 18vh, 132px);
    display: grid;
    grid-template-columns: repeat(3, minmax(80px, 1fr));
    gap: clamp(10px, 3vw, 18px);
    align-items: center;
    justify-items: center;
    z-index: 2;
  }

  .slot {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #ffffff;
    border: 4px solid #0b1220;
    border-radius: clamp(18px, 3.5vw, 26px);
    box-shadow:
      0 8px 0 #0b1220,
      0 10px 16px rgba(0, 0, 0, 0.18);
  }

  .slot.active {
    box-shadow:
      0 8px 0 #0b1220,
      0 10px 16px rgba(0, 0, 0, 0.18),
      inset 0 0 0 4px #38bdf8,
      inset 0 0 18px rgba(56, 189, 248, 0.6);
  }

  .slot.locked {
    opacity: 0.7;
    filter: grayscale(0.15) saturate(0.9);
    pointer-events: none;
  }

  .slot-digit {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    font-family:
      "Baloo 2",
      system-ui,
      -apple-system,
      sans-serif;
    font-weight: 800;
    font-size: clamp(5rem, 12.5vw, 5rem);
    color: #0b1220;
    line-height: 1;
    user-select: none;
    overflow: hidden;
  }

  .digit-hidden .slot-digit {
    visibility: hidden;
  }

  :global(.flying-digit) {
    font-size: clamp(100px, 11vw, 132px);
    color: #0b1220;
    pointer-events: none;
    z-index: 5;
  }

  .bubble-choose {
    position: absolute;
    left: calc(45% - var(--box-width) / 2 - clamp(6px, 1.6vw, 14px));
    bottom: calc(
      var(--choose-bottom) + var(--box-height) - clamp(50px, 1vw, 12px)
    );
    width: clamp(140px, 36vw, 220px);
    height: auto;
    z-index: 3;
    pointer-events: none;
    user-select: none;
  }

  .bubble-blue {
    position: absolute;
    right: calc(60% - var(--box-width) / 2 - clamp(6px, 1.6vw, 14px));
    top: 4vh;
    width: clamp(140px, 36vw, 220px);
    height: auto;
    z-index: 3;
    pointer-events: none;
    user-select: none;
  }

  .bubble-red {
    position: absolute;
    left: calc(60% - var(--box-width) / 2 - clamp(6px, 1.6vw, 14px));
    top: 4vh;
    width: clamp(140px, 36vw, 220px);
    height: auto;
    z-index: 10;
    pointer-events: none;
    user-select: none;
  }

  /* Highlight boxes synced with bubble visibility */
  .highlight-box {
    position: absolute;
    border-radius: clamp(14px, 2.8vw, 22px);
    pointer-events: none;
    animation: box-pop 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
    background: transparent; /* rely on soft halo */
    z-index: 5;
  }
  .highlight-blue {
    right: var(--blue-side);
    top: var(--blue-top);
    width: var(--blue-w);
    height: var(--blue-h);
    --glow-color: 37, 99, 235; /* rgb */
  }
  .highlight-red {
    left: var(--red-side);
    top: var(--red-top);
    width: var(--red-w);
    height: var(--red-h);
    --glow-color: 239, 68, 68; /* rgb */
  }
  /* Soft halo like the Next button, using drop-shadow */
  .highlight-box::after {
    content: "";
    position: absolute;
    inset: -6px;
    border-radius: inherit;
    border: 6px solid rgba(var(--glow-color), 0.8);
    background: transparent;
    filter: drop-shadow(0 0 10px rgba(var(--glow-color), 0.35))
      drop-shadow(0 0 28px rgba(var(--glow-color), 0.25));
    opacity: 0.75;
    animation: area-glow 1.6s ease-in-out infinite 120ms;
  }
  @keyframes area-glow {
    0%,
    100% {
      filter: drop-shadow(0 0 10px rgba(var(--glow-color), 0.35))
        drop-shadow(0 0 28px rgba(var(--glow-color), 0.25));
      opacity: 0.7;
      transform: scale(1);
    }
    50% {
      filter: drop-shadow(0 0 26px rgba(var(--glow-color), 0.55))
        drop-shadow(0 0 120px rgba(var(--glow-color), 0.45));
      opacity: 0.95;
      transform: scale(1.01);
    }
  }
  @keyframes box-pop {
    0% {
      opacity: 0;
      transform: scale(0.96);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .correct-expression {
    position: absolute;
    left: 50%;
    bottom: calc(var(--choose-bottom) + var(--box-height) + 4vh);
    transform: translateX(-50%) scale(0.86);
    animation: pop-in 760ms cubic-bezier(0.22, 1, 0.36, 1) both;
    z-index: 6;
    pointer-events: none;
  }

  @keyframes pop-in {
    0% {
      opacity: 0;
      transform: translateX(-50%) translateY(12px) scale(0.8);
    }
    50% {
      opacity: 1;
      transform: translateX(-50%) translateY(-4px) scale(1.02);
    }
    100% {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
  }

  .star-btn {
    background: transparent;
    border: 0;
    padding: 0;
    width: var(--star-size);
    aspect-ratio: 1 / 1;
    display: grid;
    place-items: center;
    transition:
      transform 140ms ease,
      filter 140ms ease;
  }

  .star-btn:focus-visible {
    outline: 3px solid #facc15;
    outline-offset: 4px;
  }

  .star-btn:hover,
  .star-btn:active {
    transform: translateY(-2px) scale(1.03);
    filter: brightness(1.05);
  }

  .star-img {
    width: 100%;
    height: auto;
    display: block;
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

  .wrong-toast {
    position: absolute;
    left: 50%;
    top: clamp(1rem, 6vh, 3.5rem);
    transform: translateX(-50%);
    background: #fee2e2;
    color: #b91c1c;
    border: 2px solid #ef4444;
    border-radius: 9999px;
    padding: 0.4rem 0.9rem;
    font-weight: 800;
    box-shadow: 0 6px 18px rgba(239, 68, 68, 0.25);
    z-index: 20;
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
