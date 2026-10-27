// Token explorer, directory view (ASDS-93). View only. Data comes from #token-data, built from tokens.json.
// Folders are disclosure buttons; tokens are links. Picking a token moves focus to its heading, and
// "Back to the token list" returns focus to the item you came from.
(function () {
  var data = JSON.parse(document.getElementById('token-data').textContent);
  var byKey = {};
  data.forEach(function (d) { byKey[d.key] = d; });
  var $ = function (id) { return document.getElementById(id); };
  var nav = document.querySelector('.tx-nav');
  var filter = $('tx-filter'), count = $('tx-count'), none = $('tx-none');
  var status = $('explorer-status'), result = $('explorer-result'), title = $('result-title'), kind = $('result-kind');
  var groupView = $('group-view'), groupRows = $('group-rows'), tokenView = $('token-view');
  var modes = $('result-modes'), brandView = $('brand-view'), brands = $('result-brands');
  var namesBody = $('result-names'), used = $('result-usedby'), usedEmpty = $('result-usedby-empty'), back = $('tx-back');
  var KIND = {
    component: 'Component token. Mode-free: it follows light and dark through the semantic token it points at.',
    semantic: 'Semantic token. Defined once per mode.',
    primitive: 'Primitive. A ladder step or raw scale value. Never used directly in UI.'
  };
  var short = function (k) { return k.replace(/^(component|semantic)\./, ''); };
  var kindOfGroup = function (g) { return g.split('.')[0] === 'component' ? 'component' : g.split('.')[0] === 'semantic' ? 'semantic' : 'primitive'; };
  var current = null; // the tree item (button or link) the view came from

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function valueCell(d, v) {
    var td = el('td'), sw = el('span', 'swatch');
    if (d.color && /^(#|rgb)/.test(String(v))) { var chip = el('span', 'swatch-chip'); chip.setAttribute('aria-hidden', 'true'); chip.style.background = v; sw.appendChild(chip); }
    sw.appendChild(el('code', null, typeof v === 'number' ? String(v) : String(v)));
    td.appendChild(sw); return td;
  }
  function cssName(d) { var n = d.names.find(function (x) { return x[0] === 'CSS'; }); return n ? n[1] : ''; }

  // ---------- tree ----------
  function setOpen(btn, open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    var list = document.getElementById(btn.getAttribute('aria-controls'));
    if (list) list.hidden = !open;
  }
  function openTo(node) {
    var li = node.closest('li');
    while (li) {
      var parent = li.parentElement.closest('li.tx-folder');
      if (!parent) break;
      setOpen(parent.querySelector(':scope > .tx-toggle'), true);
      li = parent;
    }
  }
  function markCurrent(node) {
    nav.querySelectorAll('[aria-current]').forEach(function (n) { n.removeAttribute('aria-current'); });
    if (node) node.setAttribute('aria-current', 'true');
    current = node;
  }
  var linkFor = function (key) { return nav.querySelector('a[data-token="' + key + '"]'); };
  var buttonFor = function (g) { return nav.querySelector('button[data-group="' + g + '"]'); };

  // ---------- views ----------
  function showToken(key) {
    var d = byKey[key];
    if (!d) return false;
    title.textContent = short(key);
    kind.textContent = KIND[d.kind];
    groupView.hidden = true; tokenView.hidden = false;
    modes.textContent = '';
    ['light', 'dark'].forEach(function (m) {
      var tr = el('tr'), th = el('th', null, m === 'light' ? 'Light' : 'Dark'); th.scope = 'row'; tr.appendChild(th);
      var td = el('td'), ol = el('ol', 'chain');
      d.chain[m].slice(1).forEach(function (s) { var li = el('li'); li.appendChild(el('code', null, short(s))); ol.appendChild(li); });
      if (!ol.childNodes.length) td.appendChild(el('span', 'muted', 'Itself (a raw value)')); else td.appendChild(ol);
      tr.appendChild(td); tr.appendChild(valueCell(d, d.value[m])); modes.appendChild(tr);
    });
    brands.textContent = '';
    (d.brands || []).forEach(function (b) {
      var tr = el('tr'), th = el('th', null, b[0]); th.scope = 'row'; tr.appendChild(th);
      tr.appendChild(valueCell(d, b[1][0])); tr.appendChild(valueCell(d, b[1][1])); brands.appendChild(tr);
    });
    brandView.hidden = !(d.brands && d.brands.length);
    namesBody.textContent = '';
    d.names.forEach(function (n) {
      var tr = el('tr'), th = el('th', null, n[0]); th.scope = 'row'; tr.appendChild(th);
      var td = el('td'); td.appendChild(el('code', null, n[1])); tr.appendChild(td); namesBody.appendChild(tr);
    });
    used.textContent = '';
    d.usedBy.forEach(function (u) {
      var li = el('li'), a = el('a', null, short(u[0]));
      a.href = '?token=' + encodeURIComponent(u[0]); a.setAttribute('data-token', u[0]);
      if (u[1].length === 1) a.appendChild(el('small', null, u[1][0] + ' only'));
      li.appendChild(a); used.appendChild(li);
    });
    usedEmpty.hidden = d.usedBy.length > 0;
    result.hidden = false;
    var link = linkFor(key); if (link) { openTo(link); markCurrent(link); }
    return true;
  }

  function showGroup(group) {
    var btn = buttonFor(group);
    if (!btn) return false;
    var k = kindOfGroup(group);
    var prefix = group + '.';
    var items = data.filter(function (d) { return d.key.indexOf(prefix) === 0 || (k === 'component' && group === 'component' && d.kind === 'component') || (k === 'semantic' && group === 'semantic' && d.kind === 'semantic') || (group === 'primitive' && d.kind === 'primitive'); });
    title.textContent = group === 'primitive' ? 'Primitive' : group === 'semantic' ? 'Semantic' : group === 'component' ? 'Component' : short(group);
    kind.textContent = items.length + (items.length === 1 ? ' token. ' : ' tokens. ') + (k === 'primitive' ? 'Primitives have one value in both modes.' : 'Values in light and dark.');
    tokenView.hidden = true; groupView.hidden = false;
    groupRows.textContent = '';
    items.forEach(function (d) {
      var tr = el('tr'), th = el('th'); th.scope = 'row';
      var a = el('a'); a.href = '?token=' + encodeURIComponent(d.key); a.setAttribute('data-token', d.key);
      a.appendChild(el('code', null, d.key.slice(group === 'primitive' || group === 'semantic' || group === 'component' ? (group === 'primitive' ? 0 : group.length + 1) : prefix.length)));
      th.appendChild(a); tr.appendChild(th);
      tr.appendChild(valueCell(d, d.value.light)); tr.appendChild(valueCell(d, d.value.dark));
      var css = el('td'); var c = cssName(d); if (c) css.appendChild(el('code', null, c)); tr.appendChild(css);
      groupRows.appendChild(tr);
    });
    result.hidden = false;
    openTo(btn); markCurrent(btn);
    return true;
  }

  function setUrl(param, value, push) {
    var url = '?' + param + '=' + encodeURIComponent(value);
    if (push) history.pushState({}, '', url); else history.replaceState({}, '', url);
  }
  function focusTitle() { title.focus({ preventScroll: true }); title.scrollIntoView({ block: 'start' }); }

  // Folder: toggle it and show its tokens. Focus stays on the button.
  nav.addEventListener('click', function (e) {
    var btn = e.target.closest('.tx-toggle');
    if (!btn) return;
    var open = btn.getAttribute('aria-expanded') !== 'true';
    setOpen(btn, open);
    if (open && showGroup(btn.getAttribute('data-group'))) {
      setUrl('group', btn.getAttribute('data-group'), true);
      status.textContent = 'Showing ' + title.textContent + ', ' + groupRows.children.length + ' tokens.';
    }
  });

  // Any token link (tree, group table, used by): show it and move focus to its heading.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-token]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    var key = a.getAttribute('data-token');
    if (!byKey[key]) return;
    e.preventDefault();
    if (showToken(key)) { setUrl('token', key, true); focusTitle(); }
  });

  // Back to the list: focus the tree item this view came from.
  back.addEventListener('click', function (e) {
    e.preventDefault();
    var target = current || nav.querySelector('.tx-toggle');
    openTo(target);
    target.focus();
  });

  // ---------- filter ----------
  var saved = null, timer;
  filter.addEventListener('input', function () {
    var q = filter.value.trim().toLowerCase();
    var folders = nav.querySelectorAll('li.tx-folder');
    if (q && !saved) { saved = []; nav.querySelectorAll('.tx-toggle').forEach(function (b) { saved.push([b, b.getAttribute('aria-expanded') === 'true']); }); }
    var shown = 0;
    nav.querySelectorAll('li.tx-token').forEach(function (li) {
      var hit = !q || li.getAttribute('data-key').toLowerCase().indexOf(q) !== -1;
      li.hidden = !hit; if (hit) shown++;
    });
    // Deepest folders first, so a parent sees its children's state.
    Array.prototype.slice.call(folders).reverse().forEach(function (li) {
      var btn = li.querySelector(':scope > .tx-toggle');
      var any = li.querySelector('li.tx-token:not([hidden])');
      li.hidden = !!q && !any;
      if (q) setOpen(btn, !!any);
    });
    if (!q && saved) { saved.forEach(function (s) { setOpen(s[0], s[1]); }); saved = null; }
    none.hidden = !q || shown > 0;
    clearTimeout(timer);
    timer = setTimeout(function () { count.textContent = q ? (shown + (shown === 1 ? ' token matches.' : ' tokens match.')) : ''; }, 400);
  });

  // ---------- history and first load ----------
  function fromUrl(quiet) {
    var p = new URLSearchParams(location.search);
    var t = p.get('token'), g = p.get('group');
    if (t && showToken(t)) return;
    if (g && showGroup(g)) return;
    showToken('component.button.primary.bg');
  }
  window.addEventListener('popstate', function () { fromUrl(true); });
  fromUrl(true);
})();
