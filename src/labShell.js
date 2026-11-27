// ChemLab 7.1 — one Laboratory page (#lab). The dynamic bench (src/dlab) is the only free bench and the only
// experiment library. "Có hướng dẫn" lists the guided bench labs (src/dlab/guided.js) and the curriculum lessons
// (src/lab/experiments, with quizzes and saved progress). A lesson that needs a beaker still uses its scripted
// lesson bench (src/virtualLab.js); it is labelled as an illustration and, where the dynamic engine models the same
// chemistry, links to the matching library experiment.
import './labShell.css'
import { GUIDED } from './dlab/guided.js'

// Curriculum lesson experiment → dynamic library experiment with the same chemistry (verified by hand, see
// reports/chemlab-7.1/LEGACY_MAPPING.md). Lessons not listed have no dynamic equivalent yet.
export const LESSON_TO_LIBRARY = {
  'g10-halide-chloride': 'exp-chloride-test',
  'g10-halide-iodide': 'exp-silver-halide-ammonia',
  'g10-redox-permanganate': 'exp-permanganate-iron2',
  'g10-lesson-19': 'exp-rate-concentration',
  'g11-equilibrium-fescn': 'exp-thiocyanate-equilibrium',
  'g11-lesson-02': 'exp-litmus-media',
  'g11-lesson-08': 'exp-sulfate-test',
  'g11-lesson-24': 'exp-acetic-bicarbonate',
  'g12-starch-iodine': 'exp-starch-iodine',
  'g12-lesson-28': 'exp-copper-ammine',
  'g12-lesson-29': 'exp-iron3-thiocyanate-test'
}

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

export function createLabShell(host) {
  host.innerHTML = `
    <div class="ulab">
      <div class="ulab-bench"></div>
      <section class="ulab-guided" hidden aria-labelledby="ulab-guided-title">
        <header class="ulab-guided-head">
          <button type="button" class="ulab-back" data-ulab="bench">← Về bàn thí nghiệm</button>
          <h2 id="ulab-guided-title" tabindex="-1">Thí nghiệm có hướng dẫn</h2>
          <p>Làm theo từng bước trên bàn thí nghiệm, hoặc học theo bài của chương trình lớp 10–12 (có câu hỏi và lưu tiến độ).</p>
        </header>
        <h3 class="ulab-sub">Thực hành trên bàn thí nghiệm</h3>
        <ul class="ulab-cards">${GUIDED.map(g => `
          <li><button type="button" class="ulab-card" data-ulab-guided="${esc(g.id)}"><small>${esc(g.group)}</small><strong>${esc(g.title)}</strong><span>${g.steps.length} bước · mô phỏng động</span></button></li>`).join('')}
        </ul>
        <h3 class="ulab-sub">Bài học theo chương trình lớp 10–12</h3>
        <p class="ulab-note">Một số bài có bàn minh họa riêng: phản ứng ở đó chạy theo kịch bản của bài học, không phải mô phỏng định lượng. Khi có thí nghiệm tương ứng, nút “Làm trên bàn thí nghiệm” mở thí nghiệm động trong Thư viện.</p>
        <div class="ulab-twin" hidden></div>
        <div class="ulab-lessons"></div>
      </section>
    </div>`
  const $ = s => host.querySelector(s)
  const bench = $('.ulab-bench')
  const guided = $('.ulab-guided')
  const lessons = $('.ulab-lessons')
  const twin = $('.ulab-twin')
  let dlab = null

  // Focus follows the page that is shown (keyboard and screen-reader users are not dropped on <body>).
  function showBench(focus = '[data-hd="guided"]') {
    guided.hidden = true
    bench.hidden = false // the bench's own ResizeObserver re-measures the canvas
    bench.querySelector(focus)?.focus({ preventScroll: true })
  }
  function showGuided() {
    bench.hidden = true
    guided.hidden = false
    syncTwin()
    $('#ulab-guided-title').focus({ preventScroll: true })
  }
  // The lesson running in the curriculum player, if it has a dynamic twin.
  function syncTwin() {
    const id = window.ChemLabGuidedLab?.context?.()?.experiment?.id
    const target = id && LESSON_TO_LIBRARY[id]
    twin.hidden = !target
    // While a curriculum lesson runs, the chooser cards above it step aside.
    guided.classList.toggle('ulab--lesson', Boolean(window.ChemLabGuidedLab?.context?.()?.experiment))
    if (target) twin.innerHTML = `<span>Bài này có thí nghiệm mô phỏng động tương ứng.</span><button type="button" class="ulab-twin-btn" data-ulab-twin="${esc(target)}">Làm trên bàn thí nghiệm</button>`
  }

  host.addEventListener('click', e => {
    if (e.target.closest('[data-ulab="bench"]')) { showBench(); return }
    const g = e.target.closest('[data-ulab-guided]')
    if (g && dlab) { showBench('.dlab-canvas'); dlab.startGuided(g.dataset.ulabGuided); return }
    const t = e.target.closest('[data-ulab-twin]')
    if (t && dlab) { showBench('.dlab-canvas'); dlab.layOut(t.dataset.ulabTwin); return }
  })
  // The lesson player re-renders its panel whenever a lesson opens, advances or closes: follow it.
  let twinFrame = 0
  new MutationObserver(() => { cancelAnimationFrame(twinFrame); twinFrame = requestAnimationFrame(syncTwin) }).observe(lessons, { childList: true, subtree: true })
  // Learning → "Mở bài thí nghiệm" opens a curriculum lesson: show the chooser page it renders into.
  window.addEventListener('chemlab:open-guided-lesson', showGuided)

  return {
    bench,
    lessons,
    showBench,
    showGuided,
    attach(api) { dlab = api },
    // Home → "Tiếp tục thí nghiệm" links to #lab/experiment/<curriculum id>: open that lesson here.
    openFromHash() {
      const m = /^#lab\/experiment\/([\w-]+)$/.exec(window.location.hash)
      if (!m) return
      import('./lab/experiments/experiments.js').then(({ getExperimentById }) => {
        const e = getExperimentById(m[1])
        history.replaceState(null, '', '#lab')
        if (e) window.dispatchEvent(new CustomEvent('chemlab:open-guided-lesson', { detail: { grade: e.grade, lessonId: e.lessonId, experimentId: e.id } }))
      })
    }
  }
}

// The curriculum player was written for the old two-mode page (Tự do | Bài thí nghiệm). In the unified Lab only its
// lesson mode is shown; its old free mixer is reachable only inside a lesson that needs it, under a label.
export function adoptCurriculum(lessons) {
  const old = document.querySelector('#lab')
  if (!old) return false
  lessons.appendChild(old)
  old.querySelector('.guided-mode-btn[data-guided-mode="guided"]')?.click()
  const layout = old.querySelector('.vl-layout')
  if (layout && !layout.querySelector('.ulab-illustration')) {
    const note = document.createElement('p')
    note.className = 'ulab-illustration'
    note.textContent = 'Bàn minh họa của bài học: hiện tượng và phương trình theo kịch bản bài học, không phải mô phỏng định lượng.'
    layout.prepend(note)
  }
  old.classList.add('ulab-curriculum')
  // ChemAI reads window.ChemLabLab.context(): on the unified page that is the bench the student sees, or the lesson.
  const legacy = window.ChemLabLab
  window.ChemLabLab = Object.freeze({
    context() {
      const benchShown = lessons.closest('.ulab-guided')?.hidden !== false
      const lesson = window.ChemLabGuidedLab?.context?.()
      return benchShown || !lesson?.experiment
        ? { bench: window.ChemLabDynamicLab?.context?.() || null, guided: null }
        : legacy?.context?.() || null
    }
  })
  return true
}
