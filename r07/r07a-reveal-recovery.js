/* R07A: guarded recovery for stale exported Webflow reveal states.
   This does not replace Webflow or change responsive positioning.
   Only elements marked for scroll/load reveal are eligible; hover content
   and intentionally dimmed elements are not affected. */
(function () {
  'use strict';
  var names = /^(fade-up-and-in(?:-delay(?:-\d+|-stats(?:-\d+)?)?|-\d+|-cell-\d+|-stats|-on-load)?|fade-in(?:-stats)?|slide-left|slide-right|load-animation(?:-delay)?)$/;
  function boot() {
    var targets = Array.prototype.filter.call(document.querySelectorAll('[data-ix]'), function (el) {
      return names.test(el.getAttribute('data-ix') || '');
    });
    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        observer.unobserve(el);
        // Give original Webflow animation sufficient time to complete.
        window.setTimeout(function () {
          var cs = window.getComputedStyle(el);
          if (parseFloat(cs.opacity) > 0.05) return;
          // Set only visibility; remove an exported downward offset when present.
          // Avoid overwriting transform animations that Webflow has completed.
          el.style.transition = 'opacity 650ms ease, transform 650ms ease';
          el.style.opacity = '1';
          var transform = el.style.transform || '';
          if (/translateY\((?:71|70|80|100)px\)/.test(transform)) {
            el.style.transform = transform.replace(/translateY\((?:71|70|80|100)px\)/, 'translateY(0px)');
          }
          el.setAttribute('data-r07a-recovered', 'true');
        }, 1400);
      });
    }, {root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.02});
    targets.forEach(function (el) { observer.observe(el); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
}());
