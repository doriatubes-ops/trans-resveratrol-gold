(() => {
  const key = 'resveratrol_proof_dismissed';
  try { if (sessionStorage.getItem(key)) return; } catch (_) {}
  const entries = [...document.querySelectorAll('#relatos-serum .serum-reviews-full article')].map((article, index) => {
    const name = article.querySelector('h3')?.textContent.trim();
    const full = article.querySelector('blockquote')?.textContent.trim().replace(/^[“”]|[“”]$/g, '');
    const photo = article.querySelector('img');
    if (!name || !full || !photo) return null;
    article.id = article.id || `relato-serum-${index + 1}`;
    const sentence = full.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || full;
    return { name, quote: sentence, photo: photo.getAttribute('src'), target: article.id };
  }).filter(Boolean);
  if (!entries.length) return;

  const card = document.createElement('aside');
  card.className = 'social-proof-toast';
  card.hidden = true;
  card.setAttribute('aria-label', 'Depoimento de cliente');
  card.innerHTML = '<button type="button" class="social-proof-close" aria-label="Fechar e não mostrar mais depoimentos nesta visita">×</button><div class="social-proof-content" aria-live="polite" aria-atomic="true"><p class="social-proof-label">EXPERIÊNCIA COM O SÉRUM</p><div class="social-proof-row"><img class="social-proof-photo" alt="" width="72" height="60"><div><p class="social-proof-name"></p><p class="social-proof-quote"></p></div></div></div><a class="social-proof-link">Ver depoimento completo →</a>';
  document.body.appendChild(card);
  const close = card.querySelector('button');
  const link = card.querySelector('a');
  let timer, shown = 0, stopped = false;
  const visibleSections = new Set();
  const blocked = () => document.hidden || visibleSections.size > 0;
  const schedule = (fn, delay) => { clearTimeout(timer); timer = setTimeout(fn, delay); };
  function dismiss() {
    stopped = true;
    clearTimeout(timer);
    card.hidden = true;
    observer?.disconnect();
    try { sessionStorage.setItem(key, '1'); } catch (_) {}
  }
  function hide() {
    if (stopped) return;
    if (!blocked() && card.matches(':hover, :focus-within')) {
      schedule(hide, 5000);
      return;
    }
    card.hidden = true;
    if (shown < Math.min(entries.length, 3)) schedule(show, 35000);
  }
  function show() {
    if (stopped || shown >= Math.min(entries.length, 3)) return;
    if (blocked()) { schedule(show, 10000); return; }
    const entry = entries[shown++];
    card.querySelector('.social-proof-name').textContent = entry.name;
    card.querySelector('.social-proof-quote').textContent = `“${entry.quote}”`;
    card.querySelector('img').src = entry.photo;
    link.href = '#' + entry.target;
    card.hidden = false;
    schedule(hide, 12000);
  }
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(items => {
    items.forEach(item => item.isIntersecting ? visibleSections.add(item.target) : visibleSections.delete(item.target));
    if (blocked() && !card.hidden) { card.hidden = true; schedule(show, 10000); }
  }) : null;
  // Keep offers, existing testimonials and videos clear of floating cards.
  document.querySelectorAll('#e6da2fea0, #prova-social, .video').forEach(el => observer?.observe(el));
  close.addEventListener('click', dismiss);
  link.addEventListener('click', dismiss);
  card.addEventListener('keydown', event => { if (event.key === 'Escape') dismiss(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !card.hidden) { card.hidden = true; schedule(show, 10000); }
  });
  schedule(show, 12000);
})();
