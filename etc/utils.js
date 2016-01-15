/* Note: modified code from Lenny Domnitser. Below is his original copyright info

This is the unpacked source code of the "fix encoding" bookmarklet,
available at <http://domnit.org/bookmarklets/>.

Version 1.1

2007 Lenny Domnitser, copyright waived */

export default class Utils {
  static fixUtf8(string) {
    const win2byte = {
      '\u20AC': '\x80',
      '\u201A': '\x82',
      '\u0192': '\x83',
      '\u201E': '\x84',
      '\u2026': '\x85',
      '\u2020': '\x86',
      '\u2021': '\x87',
      '\u02C6': '\x88',
      '\u2030': '\x89',
      '\u0160': '\x8A',
      '\u2039': '\x8B',
      '\u0152': '\x8C',
      '\u017D': '\x8E',
      '\u2018': '\x91',
      '\u2019': '\x92',
      '\u201C': '\x93',
      '\u201D': '\x94',
      '\u2022': '\x95',
      '\u2013': '\x96',
      '\u2014': '\x97',
      '\u02DC': '\x98',
      '\u2122': '\x99',
      '\u0161': '\x9A',
      '\u203A': '\x9B',
      '\u0153': '\x9C',
      '\u017E': '\x9E',
      '\u0178': '\x9F'
    };

    let codeArray = [];

    for (let code in win2byte) {
      codeArray.push(code);
    }

    let codes = '(?:[\\x80-\\xBF]|' + codeArray.join('|') + ')';
    let pattern = new RegExp('[\\xC2-\\xDF]' + codes + '|[\\xE0-\\xEF]' + codes + '{2}' + '|[\\xF0-\\xF4]' + codes + '{3}', 'g');

    function getbyte(string) {
      let byte = win2byte[string];
      // console.log(byte || string);
      return byte || string;
    }

    function sub(string) {
      let array = [];
      for (let code in string.substring(1)) {
        array.push(getbyte(string[1 + parseInt(code)]));
      }
      string = string[0] + array.join('');
      return decodeURIComponent(escape(string));
    }

    function fix(string, pattern) {
      for (let i = 0; i < 2; i += 1) {
        string = string.replace(pattern, (result) => {
          return sub(result);
        });
      }
      return string;
    }

    function format(string) {
      return string.replace(/[?]/g, 'Ã'); // the likelyhood of an article title including bizarre punctuation is slim
    }

    return fix(format(string), pattern);
  };
}
