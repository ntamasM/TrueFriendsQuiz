/**
 * True Friends Quiz — Language Loader
 * Initializes global QUESTIONS and UI_TEXT objects.
 * Each language file self-registers into these globals.
 *
 * English is loaded statically (default). Other languages
 * are loaded on demand via loadLanguage().
 */
var QUESTIONS = {};
var UI_TEXT = {};

/**
 * List of supported language codes.
 * Used by the settings UI and dynamic loading.
 */
var SUPPORTED_LANGUAGES = ["en", "el", "es", "fr", "de", "tr", "ar"];

/**
 * Track which languages have been loaded.
 * English is always loaded statically via <script> tags.
 */
var _loadedLanguages = { en: true };

/**
 * Dynamically load a language's question and ui-text files.
 * Calls callback() when both files are loaded (or already cached).
 *
 * @param {string} lang  - Language code (e.g. "el", "fr")
 * @param {function} callback - Called when language is ready
 */
function loadLanguage(lang, callback) {
  if (_loadedLanguages[lang]) {
    if (callback) callback();
    return;
  }

  var basePath = "languages/" + lang + "/";
  var files = ["ui-text.js", "questions.js"];
  var loaded = 0;
  var total = files.length;

  function onDone() {
    loaded++;
    if (loaded === total) {
      _loadedLanguages[lang] = true;
      if (callback) callback();
    }
  }

  for (var i = 0; i < files.length; i++) {
    var script = document.createElement("script");
    script.src = basePath + files[i] + "?v=10";
    script.onload = onDone;
    script.onerror = onDone; // continue even if one file fails
    document.head.appendChild(script);
  }
}
