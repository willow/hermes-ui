//http://stackoverflow.com/questions/6660977/convert-hyphens-to-camel-case-camelcase
//http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
export default {
  toTitleCase(str) {
    return str.replace(/-([a-z])/g, g =>  g[1].toUpperCase());
  }
};
