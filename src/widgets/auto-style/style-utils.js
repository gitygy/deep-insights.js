var _ = require('underscore');

var ATTR_TO_NUMBER = {
  'marker-fill': 1,
  'line-color': 2,
  'polygon-fill': 3
};

function getAttrRegex (attr, multi) {
  return new RegExp('\\' + 's' + attr + ':.*?(;|\n)', multi ? 'g' : '');
}

function removeEmptyLayer (cartocss) {
  return cartocss.replace(/[^;}{]*{((\s|\n)*?)}/g, '');
}

function setFlagInCartocss (cartocss, attr, flag) {
  var exist = cartocss.search(getAttrRegex(attr, false)) >= 0;

  return exist ? cartocss.replace('{', '{ ' + flag) : cartocss;
}

function removeAttr (cartocss, attr) {
  return cartocss.replace(getAttrRegex(attr, true), '');
}

function insertCartoCSSAttribute (cartocss, attrib, flag) {
  return cartocss.replace(flag, attrib);
}

function createEmtpyLayer (cartocss, attr) {
  return "#layer ['mapnik::geometry_type'=" + ATTR_TO_NUMBER[attr] + '] {  } ' + cartocss;
}

function replaceWrongSpaceChar (cartocss) {
  return cartocss.replace(new RegExp(String.fromCharCode(160), 'g'), ' ');
}
/**
 * Change attr style and remove all the duplicates
 * @param  {String} cartocss cartocss original String
 * @param  {String} attr     CSS Attribute ex, polygon-fill
 * @param  {String} newStyle New attribute style ex, polygon-fill: red;
 * @return {String}          Cartocss modified String
 */
function changeStyle (cartocss, attr, newStyle) {
  var flag = '##' + attr + '##;';

  return insertCartoCSSAttribute(
            removeEmptyLayer(
              removeAttr(
                setFlagInCartocss(createEmtpyLayer(cartocss, attr), attr, flag),
                attr
              )
            ),

            newStyle,
            flag
          );
}

module.exports = {
  changeStyle: _.memoize(changeStyle, function (css, attr, style) {
    return css + attr + style;
  }),
  getAttrRegex: getAttrRegex,
  replaceWrongSpaceChar: replaceWrongSpaceChar
};
