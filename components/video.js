const Quill = require("quill");

var BlockEmbed = Quill.import("blots/block/embed");

export class Video extends BlockEmbed {
  static create(value) {
    var node = super.create(value);
    node.setAttribute("src", value);
    node.setAttribute("width", "100%");
    node.setAttribute("controls", "controls");
    return node;
  }

  static value(node) {
    return node.getAttribute("src");
  }
}
Video.blotName = "video";
Video.tagName = "Video";
Video.className = "ql-video";
