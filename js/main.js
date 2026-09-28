/* Fran Barbershop — dispensador de turnos, ticket que se imprime y simulador de degradado */
gsap.registerPlugin(ScrollTrigger);
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---------- pantalla de turnos ---------- */
let serving = 20 + Math.floor(Math.random() * 30);
const led = $('#ledNum');
const showLed = () => { led.textContent = String(serving).padStart(2, '0'); gsap.fromTo(led, { opacity: .2 }, { opacity: 1, duration: .3, ease: 'steps(3)' }); };
showLed();
setInterval(() => { serving++; showLed(); }, 14000);

/* ---------- fecha del ticket ---------- */
const now = new Date();
$('#rDate').textContent = now.toLocaleDateString('es-ES');
$('#rHour').textContent = now.toTimeString().slice(0, 5);

/* ---------- sacar número ---------- */
(function dispenser() {
  const t = $('#ticket');
  let pulled = false, startY = 0, dy = 0;
  function pull() {
    if (pulled) return; pulled = true;
    const mine = serving + 1 + Math.floor(Math.random() * 3);
    $('#myNum').textContent = String(mine).padStart(2, '0');
    const h = new Date();
    $('#myTime').textContent = `${h.toTimeString().slice(0, 5)} · ${mine - serving} por delante`;
    gsap.fromTo(t, { y: -60 }, { y: 30, rotation: -4, duration: .9, ease: 'bounce.out' });
    $('#machineNote').innerHTML = `Tu número de hoy (de mentirijilla): <b>${mine}</b>. El de verdad te lo damos en el local, en el <b>Carrer Pep Ventura, 4</b>. ¡Te esperamos!`;
  }
  t.addEventListener('pointerdown', e => { startY = e.clientY; dy = 0; t.setPointerCapture(e.pointerId); });
  t.addEventListener('pointermove', e => { if (!startY || pulled) return; dy = Math.max(0, e.clientY - startY); t.style.transform = `translateY(${Math.min(dy, 80)}px)`; if (dy > 60) pull(); });
  t.addEventListener('pointerup', () => { if (!pulled) { if (dy < 6) pull(); else gsap.to(t, { y: 0, duration: .4 }); } startY = 0; });
  // la máquina "imprime" el ticket al cargar
  gsap.from(t, { y: -120, duration: 1.2, ease: 'steps(12)', delay: .5 });
})();

/* ---------- el ticket largo se imprime al bajar ---------- */
gsap.from('.receipt', { clipPath: 'inset(0 0 100% 0)', duration: 2.2, ease: 'steps(28)', clearProps: 'clipPath', scrollTrigger: { trigger: '.receipt', start: 'top 80%' } });
$$('.r-row').forEach((r, i) => gsap.from(r, { opacity: 0, duration: .1, delay: i * .08, scrollTrigger: { trigger: r, start: 'top 92%' } }));

/* ---------- simulador de degradado ---------- */
(function fade() {
  const L = [['CLÁSICO A TIJERA', .97, 1], ['LOW FADE', .86, .96], ['MID FADE', .76, .88], ['HIGH FADE', .67, .79], ['SKIN FADE', .6, .66]];
  const range = $('#fadeRange'), name = $('#fadeName'), s1 = $('#s1'), s2 = $('#s2'), chk = $('#designChk'), cta = $('#fadeCta');
  const st = { a: .76, b: .88 };
  function apply(animate) {
    const [n, a, b] = L[+range.value];
    name.textContent = n;
    const upd = () => { s1.setAttribute('offset', st.a.toFixed(3)); s2.setAttribute('offset', st.b.toFixed(3)); };
    if (animate) gsap.to(st, { a, b, duration: .6, ease: 'power3.out', onUpdate: upd }); else { st.a = a; st.b = b; upd(); }
    cta.href = 'https://wa.me/34630223858?text=' + encodeURIComponent(`Hola Fran, quiero un ${n.toLowerCase()}${chk.checked ? ' con diseño a navaja' : ''}. ¿Cómo está la cola hoy?`);
  }
  range.addEventListener('input', () => apply(true));
  chk.addEventListener('change', () => { gsap.to('#design', { opacity: chk.checked ? 1 : 0, duration: .4 }); apply(false); });
  apply(false);
})();

/* ---------- apariciones ---------- */
gsap.from('.brand > *', { x: -40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .12 });
gsap.from('.machine__body', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', delay: .2 });
