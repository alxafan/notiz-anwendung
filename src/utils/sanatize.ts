import sanitizeHtml from "sanitize-html";

function sanitizedContent(content: string): string {
  return sanitizeHtml(content, {
    allowedTags: [
      "b",
      "i",
      "strong",
      "em",
      "u",
      "s",
      "sub",
      "sup",
      "mark",
      "small",
      "code",
      "pre",
      "span",
      "br",
      "hr",
      "ul",
      "ol",
      "li",
      "p",
      "blockquote",
      "a",
      "img",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "caption",
      "del",
      "ins",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ],
    allowedAttributes: {
      a: ["href"],

      img: ["src", "alt"],

      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https"],
    allowedIframeHostnames: [],
    disallowedTagsMode: "discard",
    //entfernt alle html tags die atributte haben die mit on beginnen
    transformTags: {
      "*": (tagName, attribs) => {
        Object.keys(attribs).forEach((attr) => {
          if (attr.startsWith("on")) {
            delete attribs[attr];
          }
        });
        return { tagName, attribs };
      },
    },
  });
}

export default sanitizedContent;
