'use strict';

/* TRANSLATIONS */

/**
 * UI strings for multilingual support (IT / EN)
 */
const TRANSLATIONS = {
  it: {
    title: 'HTML Utils',
    rootSize: 'Root font size',
    pixels: 'Pixels',
    rem: 'Rem',
    switchDir: 'Inverti direzione',
    result: 'Risultato',
    copyResult: 'Copia risultato',
    resultCopied: 'Risultato copiato',
    madeWith: 'Sviluppata con il supporto di',
    pxToRem: 'px → rem',
    remToPx: 'rem → px',
  },
  en: {
    title: 'HTML Utils',
    rootSize: 'Root font size',
    pixels: 'Pixels',
    rem: 'Rem',
    switchDir: 'Switch direction',
    result: 'Result',
    copyResult: 'Copy result',
    resultCopied: 'Result copied',
    madeWith: 'Developed with the support of',
    pxToRem: 'px → rem',
    remToPx: 'rem → px',
  },
};

/* APP STATE */

function remConverterApp() {
  return {

    /* LANGUAGE */

    /**
     * Current language (auto-detected from browser)
     */
    lang: navigator.language.startsWith('it') ? 'it' : 'en',

    /**
     * Active translations object
     */
    get t() {
      return TRANSLATIONS[this.lang];
    },

    /**
     * Toggle between IT and EN languages
     */
    toggleLang() {
      this.lang = this.lang === 'it' ? 'en' : 'it';
    },

    /* CONVERTER STATE */

    /**
     * Direction: 'pxToRem' or 'remToPx'
     */
    direction: 'pxToRem',

    /**
     * Root font size in px (default 16)
     */
    rootSize: 16,

    /**
     * Input value (px or rem depending on direction)
     */
    inputValue: '',

    /**
     * Copy state
     */
    isCopied: false,

    /* COMPUTED */

    /**
     * Label for the input field
     */
    get inputLabel() {
      return this.direction === 'pxToRem' ? this.t.pixels : this.t.rem;
    },

    /**
     * Label for the output field
     */
    get outputLabel() {
      return this.direction === 'pxToRem' ? this.t.rem : this.t.pixels;
    },

    /**
     * Computed result string, empty if no valid input
     */
    get result() {
      const root = parseFloat(this.rootSize);
      const val = parseFloat(this.inputValue);
      if (!this.inputValue || isNaN(val) || isNaN(root) || root <= 0) {
        return '';
      }

      if (this.direction === 'pxToRem') {
        const rem = val / root;
        return stripZeros(rem.toPrecision(6)) + ' rem';
      } else {
        const px = val * root;
        return stripZeros(px.toPrecision(6)) + ' px';
      }
    },

    /* ACTIONS */

    /**
     * Toggle conversion direction, swap values if a result exists
     */
    switchDirection() {
      const root = parseFloat(this.rootSize);
      const val = parseFloat(this.inputValue);
      if (!isNaN(val) && !isNaN(root) && root > 0) {
        const converted = this.direction === 'pxToRem'
          ? val / root
          : val * root;
        this.inputValue = stripZeros(converted.toPrecision(6));
      }
      this.direction = this.direction === 'pxToRem' ? 'remToPx' : 'pxToRem';
      this.isCopied = false;
    },

    /**
     * Copies numeric result to clipboard (with fallback)
     */
    async copyResult() {
      if (!this.result) {
        return;
      }

      const numericResult = this.result.split(' ')[0];
      try {
        await navigator.clipboard.writeText(numericResult);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = numericResult;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      this.isCopied = true;
      setTimeout(() => this.isCopied = false, 2600);
    },
  };
}

/* HELPERS */

/**
 * Strips trailing zeros after decimal point
 * e.g. "1.50000" -> "1.5", "2.00000" -> "2"
 * @param {string} str
 * @returns {string}
 */
function stripZeros(str) {
  if (!str.includes('.')) {
    return str;
  }

  return str.replace(/\.?0+$/, '');
}
