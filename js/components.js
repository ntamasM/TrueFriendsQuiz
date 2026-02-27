/**
 * Shared UI components — nav & footer.
 * Include this script at the bottom of every page.
 */
(function () {
  var path = window.location.pathname;
  var isAbout =
    path.endsWith("/about.html") ||
    path.endsWith("/about") ||
    path === "about.html";

  /* ---- Top-right navigation ---- */
  var header = document.querySelector("header");
  if (header) {
    var nav = document.createElement("nav");
    nav.className = "top-nav";
    nav.innerHTML = isAbout
      ? '<a href="index.html">&larr; Home</a>'
      : '<a href="about.html">About</a>';
    header.prepend(nav);
  }

  /* ---- Footer ---- */
  var footer = document.querySelector("footer");
  if (footer) {
    footer.innerHTML =
      '<img src="Assets/Logo/Logo.svg" alt="True Friends Quiz" class="footer-logo" />' +
      '<div class="footer-text">True Friends Quiz &copy; ' +
      new Date().getFullYear() +
      ' &middot; Built with \u2764\uFE0F for <a href="https://www.airconsole.com" target="_blank" rel="noopener">AirConsole</a>' +
      ' by <a href="https://ntamadakis.gr" target="_blank" rel="noopener">Manolis Ntamadakis</a></div>';
  }
})();
