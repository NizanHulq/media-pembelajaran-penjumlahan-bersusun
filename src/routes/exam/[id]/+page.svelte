<script>
  import { pressable } from "$lib/actions/pressable";
  import { animate, spring } from "motion";
  import { goto } from "$app/navigation";
  import { getExamAnswer, examAnswers } from "$lib/exam/answers";
  import { examConfig } from "$lib/exam/config";

  export let params;
  // Make route parameters reactive so UI updates when navigating exam/1 → exam/2
  let id;
  $: id = Number(params.id);
  let kunci;
  $: kunci = getExamAnswer(id);
  let cfg;
  $: cfg = examConfig(id);
  $: if (!kunci) {
    // If no answer key, redirect back to landing
    goto("/exam");
  }

  // Navigation helpers for previous/next
  const lastId = Math.max(...Object.keys(examAnswers).map(Number));
  $: isFirst = id <= 1;
  $: isLast = id >= lastId;
  $: prevHref = isFirst ? "/exam" : `/exam/${id - 1}`;
  $: nextHref = isLast ? "/exam/finish" : `/exam/${id + 1}`;

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const srcFor = (n) => `/assets/images/number-choose/${n}.png`;

  const ANIM_UP_DURATION = 7;
  const ANIM_LEFT_DURATION = 4;
  const ANIM_UP_SPRING = { stiffness: 30, damping: 14 };
  const ANIM_LEFT_SPRING = { stiffness: 50, damping: 14 };

  let slots = { left: null, center: null, right: null };
  let fillOrder = ["center", "right"];
  // Tidak perlu step awal tekan next; langsung bisa isi
  let slotLocked = { left: false, center: false, right: false };
  let activeSlot = "center";
  let step = 2; // langsung mode isi C/R

  let containerEl;
  let centerSlotEl;
  let isAnimating = false;
  let firstStageDone = false;
  // Token to invalidate any in-flight animations when navigating to another question
  let animToken = 0;
  $: canNavigate = firstStageDone && slots.left === kunci?.left;
  $: nextGlow = canNavigate;
  $: crCorrect =
    slots.center !== null &&
    slots.right !== null &&
    slots.center === kunci?.center &&
    slots.right === kunci?.right &&
    !firstStageDone;
  $: rightBlue =
    (slots.center === kunci?.center && slots.right === kunci?.right) ||
    firstStageDone;

  let showWrong = false;
  let wrongTimer;
  function popWrong() {
    showWrong = true;
    clearTimeout(wrongTimer);
    wrongTimer = setTimeout(() => (showWrong = false), 1200);
  }

  // Info popup jika mencoba lanjut tanpa menyelesaikan
  let showNeedAnswer = false;
  let needTimer;
  function popNeedAnswer() {
    showNeedAnswer = true;
    clearTimeout(needTimer);
    needTimer = setTimeout(() => (showNeedAnswer = false), 1400);
  }

  // Reset state whenever the exam id changes so the page behaves like a new question
  function resetState() {
    slots = { left: null, center: null, right: null };
    fillOrder = ["center", "right"];
    slotLocked = { left: false, center: false, right: false };
    activeSlot = "center";
    step = 2;
    isAnimating = false;
    firstStageDone = false;
    showWrong = false;
    showNeedAnswer = false;
    // Invalidate any running fly animation and clean up floating elements
    animToken++;
    if (containerEl) {
      containerEl.querySelectorAll('.flying-digit').forEach((el) => el.remove());
    }
    if (centerSlotEl) centerSlotEl.classList.remove('digit-hidden');
    clearTimeout(wrongTimer);
    clearTimeout(needTimer);
  }
  let _prevId = undefined;
  $: if (id !== _prevId) {
    _prevId = id;
    resetState();
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
    const token = animToken; // capture for cancellation checks
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
      if (token !== animToken) { el.remove(); return; }
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
        if (token !== animToken) { el.remove(); return; }
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
  <title>Exam {id}</title>
  <meta name="description" content="Halaman soal exam" />
  <link rel="preload" as="image" href={cfg.bg} />
</svelte:head>

<section
  class="exam-screen"
  aria-labelledby="exam-title"
  bind:this={containerEl}
  style={`--exam-bg: url('${cfg.bg}')`}
>
  <h1 id="exam-title" class="sr-only">Exam {id}</h1>

  <a href="/" class="nav-btn home" use:pressable aria-label="Kembali ke halaman utama">
    <img src="/assets/images/buttons/button-home.png" alt="" />
    <span class="sr-only">Home</span>
  </a>

  <a href={prevHref} class="nav-btn previous" use:pressable aria-label="Halaman sebelumnya">
    <img src="/assets/images/buttons/previous.png" alt="" />
    <span class="sr-only">Halaman sebelumnya</span>
  </a>

  <a
    href={nextHref}
    class="nav-btn next"
    class:glow-blue={nextGlow}
    on:click|preventDefault={() => {
      if (canNavigate) goto(nextHref);
      else popNeedAnswer();
    }}
    use:pressable
    aria-label="Halaman selanjutnya"
  >
    <img src="/assets/images/buttons/next.png" alt="" />
    <span class="sr-only">Halaman selanjutnya</span>
  </a>

  <!-- Yellow dashed box background behind the number choices -->
  <div class="yellow-box" aria-hidden="true"></div>

  <!-- Slots (no bubble images for exam) -->
  <div class="answer-slots" aria-label="Tempat jawaban dipilih">
    <div class="slot left" class:active={activeSlot === "left"} class:locked={slotLocked.left} on:click={() => setActive("left")}>
      <span class="slot-digit digit-display digit-3d">{slots.left ?? ""}</span>
    </div>
    <div class="slot center" bind:this={centerSlotEl} class:active={activeSlot === "center"} class:locked={slotLocked.center} on:click={() => setActive("center")}>
      <span class="slot-digit digit-display digit-3d" style="color: {crCorrect ? '#2563eb' : '#0b1220'}">{slots.center ?? ""}</span>
    </div>
    <div class="slot right" class:active={activeSlot === "right"} class:locked={slotLocked.right} on:click={() => setActive("right")}>
      <span class="slot-digit digit-display digit-3d" style="color: {rightBlue ? '#2563eb' : '#0b1220'}">{slots.right ?? ""}</span>
    </div>
  </div>

  <div class="number-choose" role="group" aria-label="Pilih jawaban angka">
    {#each numbers as n}
      <button class="star-btn" type="button" use:pressable on:click={() => handlePick(n)} aria-label={`Pilih angka ${n}`}>
        <img class="star-img" src={srcFor(n)} alt="" />
        <span class="sr-only">{n}</span>
      </button>
    {/each}
  </div>

  {#if showWrong}
    <div class="wrong-toast" role="alert" aria-live="assertive">❌ Jawaban salah</div>
  {/if}

  {#if showNeedAnswer}
    <div class="need-toast" role="status" aria-live="polite">Silakan jawab dulu untuk lanjut ➜</div>
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
  .exam-screen {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100svh;
    background:
      var(--exam-bg) top center / 100% 100% no-repeat,
      linear-gradient(180deg, #e6eaff 0%, #dbe6ff 100%);
    padding: 0; /* background should fill without adding scroll */
    isolation: isolate;
    --choose-bottom: clamp(76px, 14vw, 120px);
    --gap: clamp(8px, 2vw, 14px);
    --star-size: clamp(56px, 14vw, 92px);
    --box-width: calc(var(--star-size) * 5 + var(--gap) * 4);
    --box-height: calc(var(--star-size) * 2 + var(--gap));
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

  /* Yellow background box with dashed outline behind the numbers */
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

  .answer-slots {
    position: absolute;
    left: clamp(12px, 6vw, 28px);
    right: clamp(12px, 6vw, 28px);
    bottom: calc(var(--choose-bottom) + var(--box-height) + clamp(10px, 3vw, 18px));
    height: clamp(92px, 18vh, 132px);
    display: grid;
    grid-template-columns: repeat(3, minmax(80px, 1fr));
    gap: clamp(10px, 3vw, 18px);
    align-items: center;
    justify-items: center;
    z-index: 2;
  }

  .slot { width: 100%; aspect-ratio: 1 / 1; background: #ffffff; border: 4px solid #0b1220; border-radius: clamp(18px, 3.5vw, 26px); box-shadow: 0 8px 0 #0b1220, 0 10px 16px rgba(0,0,0,.18); }
  .slot.active { box-shadow: 0 8px 0 #0b1220, 0 10px 16px rgba(0,0,0,.18), inset 0 0 0 4px #38bdf8, inset 0 0 18px rgba(56,189,248,.6); }
  .slot.locked { opacity: .7; filter: grayscale(.15) saturate(.9); pointer-events: none; }
  .slot-digit { display: grid; place-items: center; width: 100%; height: 100%; font-size: clamp(5rem, 12.5vw, 5rem); color: #0b1220; line-height: 1; user-select: none; }
  .digit-hidden .slot-digit { visibility: hidden; }
  :global(.flying-digit) { font-size: clamp(100px, 11vw, 132px); color: #0b1220; pointer-events: none; z-index: 5; }

  .star-btn { background: transparent; border: 0; padding: 0; width: var(--star-size); aspect-ratio: 1 / 1; display: grid; place-items: center; transition: transform 140ms ease, filter 140ms ease; }
  .star-btn:focus-visible { outline: 3px solid #facc15; outline-offset: 4px; }
  .star-btn:hover, .star-btn:active { transform: translateY(-2px) scale(1.03); filter: brightness(1.05); }
  .star-img { width: 100%; height: auto; display: block; }

  .nav-btn { --btn-size: clamp(56px, 10vw, 96px); position: absolute; display: flex; align-items: center; justify-content: center; width: calc(var(--btn-size) * 0.6); touch-action: manipulation; -webkit-tap-highlight-color: transparent; transition: transform 160ms ease, filter 160ms ease; z-index: 30; }
  .nav-btn img { width: 100%; height: auto; display: block; }
  .nav-btn:hover, .nav-btn:focus-visible, .nav-btn:active { transform: scale(1.04); filter: brightness(1.05); }
  .nav-btn:focus-visible { outline: 3px solid #facc15; outline-offset: 4px; }
  .nav-btn:active { transition-duration: 90ms; }
  .nav-btn.home { top: 12px; left: 12px; }
  .nav-btn.previous { bottom: 12px; left: 12px; }
  .nav-btn.next { bottom: 12px; right: 12px; }

  .wrong-toast { position: absolute; left: 50%; top: clamp(1rem, 6vh, 3.5rem); transform: translateX(-50%); background: #fee2e2; color: #b91c1c; border: 2px solid #ef4444; border-radius: 9999px; padding: 0.4rem 0.9rem; font-weight: 800; box-shadow: 0 6px 18px rgba(239,68,68,.25); z-index: 20; }
  .need-toast { position: absolute; left: 50%; bottom: calc(var(--choose-bottom) + var(--box-height) + 6vh); transform: translateX(-50%); background: #fef3c7; color: #92400e; border: 2px solid #f59e0b; border-radius: 9999px; padding: 0.4rem 0.9rem; font-weight: 800; box-shadow: 0 6px 18px rgba(245,158,11,.25); z-index: 20; }
  .correct-expression { position: absolute; left: 50%; bottom: calc(var(--choose-bottom) + var(--box-height) + 4vh); transform: translateX(-50%) scale(0.86); animation: pop-in 760ms cubic-bezier(0.22, 1, 0.36, 1) both; z-index: 6; pointer-events: none; }
  @keyframes pop-in { 0% { opacity: 0; transform: translateX(-50%) translateY(12px) scale(0.8);} 50% { opacity: 1; transform: translateX(-50%) translateY(-4px) scale(1.02);} 100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1);} }

  @media (max-width: 640px) { .nav-btn { --btn-size: clamp(48px, 20vw, 88px); } }

  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
</style>
