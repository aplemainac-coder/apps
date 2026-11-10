/* Acortador: shortLink('/b/mi-negocio') -> https://dominio/l/abc123 */
(function () {
  var U = 'https://uazfgshpzvjxsckgkkeu.supabase.co/rest/v1/', K = 'sb_publishable_FQQiva6dasJhqpaRXqcl0A_2c5k0anJ';
  var H = { apikey: K, 'Content-Type': 'application/json' };
  var OK = /^\/b\/[a-z0-9]+(-[a-z0-9]+)*\/?(#p=[0-9a-f-]{8,40})?$/;
  function code() { var a = 'abcdefghjkmnpqrstuvwxyz23456789', s = ''; for (var i = 0; i < 6; i++) s += a[Math.floor(Math.random() * a.length)]; return s; }
  window.shortLink = async function (target) {
    if (!OK.test(target)) throw new Error('Enlace no permitido');
    var ck = 'short:' + target, c = localStorage.getItem(ck);
    if (c) return location.origin + '/l/' + c;
    var r = await fetch(U + 'short_links?select=code&target=eq.' + encodeURIComponent(target) + '&limit=1', { headers: H });
    var rows = r.ok ? await r.json() : [];
    if (rows[0]) c = rows[0].code;
    else for (var n = 0; n < 5 && !c; n++) {
      var k = code();
      var p = await fetch(U + 'short_links', { method: 'POST', headers: Object.assign({ Prefer: 'return=minimal' }, H), body: JSON.stringify({ code: k, target: target }) });
      if (p.ok) c = k; else if (p.status !== 409) throw new Error('No se pudo acortar');
    }
    if (!c) throw new Error('No se pudo acortar');
    try { localStorage.setItem(ck, c); } catch (e) {}
    return location.origin + '/l/' + c;
  };
})();
