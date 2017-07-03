// syntax of the fragment is:
//   - comma separated list of flags
//   - semicolon
//   - function name
//   - semicolon
//   - json argument

(function(WIN) {
  // We don't used window.location.hash because it has different
  // behavior on IE and Firefox.  See
  // https://bugzilla.mozilla.org/show_bug.cgi?id=378962
  var pathname = WIN.location.href,
      hashIndex = pathname.indexOf('#'),
      sepIndex, hash, flags, pwin, data, fname, rest, indexOf, f, SSO;

  if (hashIndex > 0) {
    hash = decodeURIComponent(pathname.substring(hashIndex + 1));
  } else {
    throw new Error('RPX:receiver: Missing fragment.');
  }

  sepIndex = hash.indexOf(';');
  if (sepIndex < 0) {
    throw new Error('RPX:receiver: Missing flags separator.');
  }
  flags = hash.substring(0, sepIndex).split(',');

  rest = hash.substring(sepIndex + 1);

  sepIndex = rest.indexOf(':');
  if (sepIndex < 0) {
    throw new Error('RPX:receiver: Missing func separator.');
  }

  fname = rest.substring(0, sepIndex);
  data = decodeURIComponent(rest.substring(sepIndex + 1));

  indexOf = function(arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        return i;
      }
    }
    return -1;
  };

  SSO = {
    refresh: function() {
      var allCookies = document.cookie.split(';');
      for (var i = 0; i < allCookies.length; i++) {
        if (allCookies[i].search(/janrain_sso_checked/) > -1) {
          WIN.document.cookie = allCookies[i] + '=;expires=' +
              (new Date()).toGMTString() + ';path=/;';
        }
      }
    },

    logout: function(uri) {
      SSO.refresh();
      WIN.document.location.href = uri;
    }
  };

  if (indexOf(flags, 'sso') >= 0) {
    f = SSO[fname];
    f(data);
    return;
  } else if (indexOf(flags, 'top') >= 0) {
    pwin = WIN.top;
  } else if (indexOf(flags, 'opener') >= 0) {
    pwin = WIN.opener;
  } else {
    pwin = WIN.parent;
  }

  f = pwin.eval(fname);
  pwin.setTimeout(function() { f(data); }, 0);
})(this);