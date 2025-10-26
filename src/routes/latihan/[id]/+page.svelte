<script>
  import { onMount } from 'svelte';
  import { animate, spring } from 'motion';
  import data from '$data/soal-1.json';
  import { pressable } from '$lib/actions/pressable';

  export let params;
  let idx = 0; // question index
  let input = '';
  let feedback = null; // 'benar' | 'salah' | null
  let boxEl;
  let numberA; let numberB;

  const soal = data.items;

  function current() {
    return soal[idx];
  }

  function jawab() {
    const benar = Number(input) === current().answer;
    feedback = benar ? 'benar' : 'salah';

    // micro-interaction on container
    if (boxEl) {
      animate(
        boxEl,
        { scale: benar ? [1, 1.06, 1] : [1, 0.96, 1] },
        { duration: 0.35, easing: spring({ stiffness: 400, damping: 20 }) }
      );
    }

    // shake on wrong numbers
    if (!benar && numberA && numberB) {
      const seq = [
        { x: -6 }, { x: 6 }, { x: -4 }, { x: 4 }, { x: 0 }
      ];
      animate(numberA, seq, { duration: 0.35 });
      animate(numberB, seq, { duration: 0.35 });
    }

    // highlight color change if correct
    if (benar) {
      // could add confetti later (tiny), keeping super-light now
    }
  }

  function next() {
    idx = (idx + 1) % soal.length;
    input = '';
    feedback = null;
  }

  function back() {
    idx = (idx - 1 + soal.length) % soal.length;
    input = '';
    feedback = null;
  }
</script>

<section bind:this={boxEl} class="card">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-extrabold">{data.title}</h1>
    <nav class="flex gap-2">
      <button class="btn btn-ghost" use:pressable on:click={back}>Back</button>
      <button class="btn btn-ghost" use:pressable on:click={() => (location.href = '/')} >Home</button>
      <button class="btn btn-primary" use:pressable on:click={next}>Next</button>
    </nav>
  </div>

  <div class="mt-4 text-lg">
    <p>Jumlahkan angka berwarna <strong>{current().highlight === 'red' ? 'merah' : 'biru'}</strong>!</p>
  </div>

  <div class="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr] items-center text-4xl sm:text-5xl font-extrabold">
    <span
      bind:this={numberA}
      class="emboss px-3 py-2 rounded-xl"
      style="color: {feedback === 'benar' ? (current().highlight === 'red' ? '#2563eb' : '#ef4444') : (current().highlight === 'red' ? '#ef4444' : '#2563eb')}"
      >{current().a}</span>
    <span class="text-4xl">+</span>
    <span
      bind:this={numberB}
      class="emboss px-3 py-2 rounded-xl"
      style="color: {feedback === 'benar' ? (current().highlight === 'red' ? '#2563eb' : '#ef4444') : (current().highlight === 'red' ? '#ef4444' : '#2563eb')}"
      >{current().b}</span>
  </div>

  <div class="mt-6 flex items-center gap-3 flex-wrap">
    <input
      class="w-24 sm:w-28 rounded-xl border border-gray-300 px-4 py-3 text-xl sm:text-2xl"
      type="number"
      min="0"
      bind:value={input}
      placeholder="Jawab" />
    <button class="btn btn-primary" on:click={jawab}>Cek</button>
  </div>

  {#if feedback === 'benar'}
    <div class="mt-4 text-green-600 text-3xl">✅ Benar! <span aria-hidden="true">😊</span></div>
  {:else if feedback === 'salah'}
    <div class="mt-4 text-red-600 text-3xl">❌ Salah <span aria-hidden="true">☹️</span></div>
  {/if}

  <p class="mt-6 text-sm text-gray-600">
    Catatan: Saat angka sudah “naik ke atas” (jawaban benar), warna angka berubah.
  </p>
</section>
