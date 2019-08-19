import { registerOption } from 'pretty-text/pretty-text';

registerOption((siteSettings, opts) => {
  opts.features["bbcode-lock"] = true;
});

function replaceLock(text) {
  text = text || "";
  while (text !== (text = text.replace(/\[lock=([^\]]+)\]((?:(?!\[lock=[^\]]+\]|\[\/lock\])[\S\s])*)\[\/lock\]/ig, function (match, p1, p2) {
    return `<div class='lock ${p1}'>${p2}</div>`;
  })));
  return text;
}

export function setup(helper) {
  helper.whiteList([
    'div[class]'
  ]);
  
  if (helper.markdownIt) {
    helper.registerPlugin(md => {
      const ruler = md.inline.bbcode.ruler;

      ruler.push("lock", {
        tag: "div",
        wrap: function(token, endToken, tagInfo) {
          token.type = "div_open";
          token.tag = "div";
          token.attrs = [
            ["class", "hide " + tagInfo.attrs._default.trim()]
          ];
          token.content = "";
          token.nesting = 1;

          endToken.type = "div_close";
          endToken.tag = "div";
          endToken.nesting = -1;
          endToken.content = "";
        }
      });
     });
  }
  else {
  helper.addPreProcessor(text => replaceLock(text));
  }
}
