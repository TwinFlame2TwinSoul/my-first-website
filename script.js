// header solidify on scroll
const header = document.getElementById('site-header');
const onScroll = () => {
  if(header) header.classList.toggle('scrolled', window.scrollY > 40);
};
document.addEventListener('scroll', onScroll, {passive:true});
onScroll();

// mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
if(navToggle && navLinks){
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.15});
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

// golden thread: two strands converge into one across the scroll of the page
const threadA = document.querySelector('.thread-a');
const threadB = document.querySelector('.thread-b');

function updateThread(){
  if(!threadA || !threadB) return;
  const doc = document.documentElement;
  const scrollTop = window.scrollY;
  const scrollable = doc.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, scrollTop / scrollable)) : 0;

  // strands start at x=14 and x=46 (32 apart) and converge to x=30 (merged) by progress ~0.92
  const convergeAt = 0.92;
  const t = Math.min(1, progress / convergeAt);
  const eased = t * t * (3 - 2 * t);

  const startA = 14, startB = 46, merged = 30;
  const ax = startA + (merged - startA) * eased;
  const bx = startB + (merged - startB) * eased;

  const wave = (1 - eased) * 6;
  const h = 1000;
  const mid = h * 0.5;

  const pathFor = (x) => `M ${x} 0 Q ${x + wave} ${mid} ${x} ${h}`;

  threadA.setAttribute('d', pathFor(ax));
  threadB.setAttribute('d', pathFor(bx));

  threadA.style.opacity = 0.55;
  threadB.style.opacity = eased > 0.98 ? 0 : 0.55;
}

document.addEventListener('scroll', () => requestAnimationFrame(updateThread), {passive:true});
window.addEventListener('resize', updateThread);
updateThread();
