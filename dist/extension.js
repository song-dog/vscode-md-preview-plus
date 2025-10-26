var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.mjs
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode10 = __toESM(require("vscode"), 1);

// src/plugins/github-alert/renderer.mjs
var vscode = __toESM(require("vscode"), 1);

// src/lib/strip-indent.mjs
function createStripIndent(options) {
  const stripIndent2 = (strings, ...values) => {
    const { escapeSpecialCharacters = false } = options;
    const lines = [...strings].reduce((prev, current, i) => prev + current + (values[i] || ""), "").split("\n").filter((line) => line.trim() !== "");
    const minIndent = Math.min(...lines.map((line) => line.match(/^\s*/)[0].length));
    return lines.map((line) => {
      line = line.substring(minIndent);
      if (!escapeSpecialCharacters)
        return line;
      return line.replace(/\\\n[ \t]*/g, "").replace(/\\`/g, "`").replace(/\\\$/g, "$").replace(/\\\{/g, "{");
    }).join("\n");
  };
  stripIndent2.withOptions = (newOptions) => createStripIndent({ ...options, ...newOptions });
  return stripIndent2;
}
var stripIndent = createStripIndent({});
var strip_indent_default = stripIndent;

// src/lib/to-title-case.mjs
function toTitleCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// src/plugins/github-alert/renderer.mjs
function renderOpening(gitHubAlert2) {
  if (!gitHubAlert2.theme) {
    const themeKinds = ["light", "dark", "dark", "light"];
    gitHubAlert2.theme = themeKinds[vscode.window.activeColorTheme.kind];
  }
  const { name, theme, icon } = gitHubAlert2;
  return strip_indent_default`
    <div class="github-alert ga-${name}" theme="${theme}">
      <span class="ga-title">
        <svg xmlns="http://www.w3.org/2000/svg" class="ga-${icon.name}" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
          <path d="${icon.path}"/>
        </svg>
        ${toTitleCase(name)}
      </span>
      <span class="ga-content">
  `;
}
function renderClosing() {
  return strip_indent_default`
      </span>
    </div>
  `;
}

// src/lib/blockquote.mjs
function isSpace(code) {
  return code === 9 || code === 32 ? true : false;
}
function blockquote(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  let max = state.eMarks[startLine];
  const oldLineMax = state.lineMax;
  if (state.sCount[startLine] - state.blkIndent >= 4)
    return false;
  if (state.src.charCodeAt(pos) !== 62)
    return false;
  if (silent)
    return true;
  const oldBMarks = [];
  const oldBSCount = [];
  const oldSCount = [];
  const oldTShift = [];
  const terminatorRules = state.md.block.ruler.getRules("blockquote");
  const oldParentType = state.parentType;
  state.parentType = "blockquote";
  let lastLineEmpty = false;
  let nextLine;
  for (nextLine = startLine; nextLine < endLine; nextLine++) {
    const isOutdented = state.sCount[nextLine] < state.blkIndent;
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    if (pos >= max)
      break;
    if (state.src.charCodeAt(pos++) === 62 && !isOutdented) {
      let initial = state.sCount[nextLine] + 1;
      let spaceAfterMarker;
      let adjustTab;
      if (state.src.charCodeAt(pos) === 32) {
        pos++;
        initial++;
        adjustTab = false;
        spaceAfterMarker = true;
      } else if (state.src.charCodeAt(pos) === 9) {
        spaceAfterMarker = true;
        if ((state.bsCount[nextLine] + initial) % 4 === 3) {
          pos++;
          initial++;
          adjustTab = false;
        } else {
          adjustTab = true;
        }
      } else {
        spaceAfterMarker = false;
      }
      let offset = initial;
      oldBMarks.push(state.bMarks[nextLine]);
      state.bMarks[nextLine] = pos;
      while (pos < max) {
        const ch = state.src.charCodeAt(pos);
        if (isSpace(ch)) {
          if (ch === 9) {
            offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
          } else {
            offset++;
          }
        } else {
          break;
        }
        pos++;
      }
      lastLineEmpty = pos >= max;
      oldBSCount.push(state.bsCount[nextLine]);
      state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
      oldSCount.push(state.sCount[nextLine]);
      state.sCount[nextLine] = offset - initial;
      oldTShift.push(state.tShift[nextLine]);
      state.tShift[nextLine] = pos - state.bMarks[nextLine];
      continue;
    }
    if (lastLineEmpty)
      break;
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) {
      state.lineMax = nextLine;
      if (state.blkIndent !== 0) {
        oldBMarks.push(state.bMarks[nextLine]);
        oldBSCount.push(state.bsCount[nextLine]);
        oldTShift.push(state.tShift[nextLine]);
        oldSCount.push(state.sCount[nextLine]);
        state.sCount[nextLine] -= state.blkIndent;
      }
      break;
    }
    oldBMarks.push(state.bMarks[nextLine]);
    oldBSCount.push(state.bsCount[nextLine]);
    oldTShift.push(state.tShift[nextLine]);
    oldSCount.push(state.sCount[nextLine]);
    state.sCount[nextLine] = -1;
  }
  const oldIndent = state.blkIndent;
  state.blkIndent = 0;
  const token_o = state.push("blockquote_open", "blockquote", 1);
  token_o.markup = ">";
  token_o.map = [startLine, 0];
  state.md.block.tokenize(state, startLine, nextLine);
  const token_c = state.push("blockquote_close", "blockquote", -1);
  token_c.markup = ">";
  state.lineMax = oldLineMax;
  state.parentType = oldParentType;
  token_o.map = [startLine, state.line];
  for (let i = 0; i < oldTShift.length; i++) {
    state.bMarks[i + startLine] = oldBMarks[i];
    state.tShift[i + startLine] = oldTShift[i];
    state.sCount[i + startLine] = oldSCount[i];
    state.bsCount[i + startLine] = oldBSCount[i];
  }
  state.blkIndent = oldIndent;
  return true;
}

// src/plugins/github-alert/plugin.mjs
var vscode2 = __toESM(require("vscode"), 1);
var GitHubAlerts = [
  {
    name: "note",
    icon: {
      name: "info",
      path: "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
    }
  },
  {
    name: "tip",
    icon: {
      name: "light-bulb",
      path: "M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"
    }
  },
  {
    name: "important",
    icon: {
      name: "report",
      path: "M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
    }
  },
  {
    name: "warning",
    icon: {
      name: "alert",
      path: "M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
    }
  },
  {
    name: "caution",
    icon: {
      name: "stop",
      path: "M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
    }
  }
];

// src/plugins/obsidian-callout/renderer.mjs
var vscode3 = __toESM(require("vscode"), 1);
function renderOpening2(obsidianCallout2) {
  if (!obsidianCallout2.theme) {
    const themeKinds = ["light", "dark", "dark", "light"];
    obsidianCallout2.theme = themeKinds[vscode3.window.activeColorTheme.kind];
  }
  const { name, theme, icon, isCollapsible, initialState } = obsidianCallout2;
  return strip_indent_default`
    <div class="obsidian-callout oc-${name} ${isCollapsible ? "is-collapsible" : ""}" theme="${theme}">
      <${isCollapsible ? "label" : "div"} class="oc-heading">
        <div class="oc-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="oc-${icon.name}">
            ${icon.components.map((component) => {
    return strip_indent_default`
                <${component.name} ${Object.entries(component.attrs).map(([key, value]) => `${key}="${value}"`).join(" ")} />
              `;
  }).join("")}
          </svg>
        </div>
        <div class="oc-title">${toTitleCase(name)}</div>
        ${isCollapsible ? '<div class="oc-fold">\n          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-chevron-down">\n            <path d="m6 9 6 6 6-6"/>\n          </svg>\n        </div>' : ""}
        ${isCollapsible ? '<input name="oc-state" type="checkbox" ' + (initialState === "open" ? "" : "checked") + "/>" : ""}
      </${isCollapsible ? "label" : "div"}>
      <div class="oc-content">
  `;
}
function renderClosing2() {
  return strip_indent_default`
      </div>
    </div>
  `;
}

// src/plugins/obsidian-callout/plugin.mjs
var vscode4 = __toESM(require("vscode"), 1);
var ObsidianCallouts = [
  {
    aliases: ["note", "custom"],
    icon: {
      name: "lucide-pencil",
      components: [
        {
          name: "path",
          attrs: { d: "M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" }
        },
        {
          name: "path",
          attrs: { d: "m15 5 4 4" }
        }
      ]
    }
  },
  {
    aliases: ["abstract", "summary", "tldr"],
    icon: {
      name: "lucide-clipboard-list",
      components: [
        {
          name: "rect",
          attrs: { x: 8, y: 2, width: 8, height: 4, rx: 1, ry: 1 }
        },
        {
          name: "path",
          attrs: { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }
        },
        {
          name: "path",
          attrs: { d: "M12 11h4" }
        },
        {
          name: "path",
          attrs: { d: "M12 16h4" }
        },
        {
          name: "path",
          attrs: { d: "M8 11h.01" }
        },
        {
          name: "path",
          attrs: { d: "M8 16h.01" }
        }
      ]
    }
  },
  {
    aliases: ["info"],
    icon: {
      name: "lucide-info",
      components: [
        {
          name: "circle",
          attrs: {
            cx: 12,
            cy: 12,
            r: 10
          }
        },
        {
          name: "path",
          attrs: { d: "M12 16v-4" }
        },
        {
          name: "path",
          attrs: { d: "M12 8h.01" }
        }
      ]
    }
  },
  {
    aliases: ["todo"],
    icon: {
      name: "lucide-check-circle-2",
      components: [
        {
          name: "circle",
          attrs: {
            cx: 12,
            cy: 12,
            r: 10
          }
        },
        {
          name: "path",
          attrs: { d: "m9 12 2 2 4-4" }
        }
      ]
    }
  },
  {
    aliases: ["tip", "hint", "important"],
    icon: {
      name: "lucide-flame",
      components: [
        {
          name: "path",
          attrs: { d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" }
        }
      ]
    }
  },
  {
    aliases: ["success", "check", "done"],
    icon: {
      name: "lucide-check",
      components: [
        {
          name: "path",
          attrs: { d: "M20 6 9 17l-5-5" }
        }
      ]
    }
  },
  {
    aliases: ["question", "help", "faq"],
    icon: {
      name: "lucide-help-circle",
      components: [
        {
          name: "circle",
          attrs: {
            cx: 12,
            cy: 12,
            r: 10
          }
        },
        {
          name: "path",
          attrs: { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }
        },
        {
          name: "path",
          attrs: { d: "M12 17h.01" }
        }
      ]
    }
  },
  {
    aliases: ["warning", "caution", "attention"],
    icon: {
      name: "lucide-alert-triangle",
      components: [
        {
          name: "path",
          attrs: { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }
        },
        {
          name: "path",
          attrs: { d: "M12 9v4" }
        },
        {
          name: "path",
          attrs: { d: "M12 17h.01" }
        }
      ]
    }
  },
  {
    aliases: ["failure", "fail", "missing"],
    icon: {
      name: "lucide-x",
      components: [
        {
          name: "path",
          attrs: { d: "M18 6 6 18" }
        },
        {
          name: "path",
          attrs: { d: "m6 6 12 12" }
        }
      ]
    }
  },
  {
    aliases: ["danger", "error"],
    icon: {
      name: "lucide-zap",
      components: [
        {
          name: "polygon",
          attrs: { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }
        }
      ]
    }
  },
  {
    aliases: ["bug"],
    icon: {
      name: "lucide-bug",
      components: [
        {
          name: "path",
          attrs: { d: "m8 2 1.88 1.88" }
        },
        {
          name: "path",
          attrs: { d: "M14.12 3.88 16 2" }
        },
        {
          name: "path",
          attrs: { d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" }
        },
        {
          name: "path",
          attrs: { d: "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" }
        },
        {
          name: "path",
          attrs: { d: "M12 20v-9" }
        },
        {
          name: "path",
          attrs: { d: "M6.53 9C4.6 8.8 3 7.1 3 5" }
        },
        {
          name: "path",
          attrs: { d: "M6 13H2" }
        },
        {
          name: "path",
          attrs: { d: "M3 21c0-2.1 1.7-3.9 3.8-4" }
        },
        {
          name: "path",
          attrs: { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4" }
        },
        {
          name: "path",
          attrs: { d: "M22 13h-4" }
        },
        {
          name: "path",
          attrs: { d: "M17.2 17c2.1.1 3.8 1.9 3.8 4" }
        }
      ]
    }
  },
  {
    aliases: ["example"],
    icon: {
      name: "lucide-list",
      components: [
        {
          name: "line",
          attrs: { x1: 8, y1: 6, x2: 21, y2: 6 }
        },
        {
          name: "line",
          attrs: { x1: 8, y1: 12, x2: 21, y2: 12 }
        },
        {
          name: "line",
          attrs: { x1: 8, y1: 18, x2: 21, y2: 18 }
        },
        {
          name: "line",
          attrs: { x1: 3, y1: 6, x2: 3.01, y2: 6 }
        },
        {
          name: "line",
          attrs: { x1: 3, y1: 12, x2: 3.01, y2: 12 }
        },
        {
          name: "line",
          attrs: { x1: 3, y1: 18, x2: 3.01, y2: 18 }
        }
      ]
    }
  },
  {
    aliases: ["quote", "cite"],
    icon: {
      name: "lucide-quote",
      components: [
        {
          name: "path",
          attrs: { d: "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" }
        },
        {
          name: "path",
          attrs: { d: "M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" }
        }
      ]
    }
  }
];

// src/plugins/styled-blockquote/parser.mjs
var vscode5 = __toESM(require("vscode"), 1);
function parseTokenForStyledBlockquote(token) {
  if (token === void 0 || token?.type !== "inline")
    return;
  const lines = token?.content?.split("\n");
  if (!lines || lines.length <= 1)
    return;
  let firstLine = lines[0].trim();
  if (!firstLine.startsWith("[!"))
    return;
  const regexp = /^\[[!](note|abstract|summary|tldr|info|todo|tip|hint|important|success|check|done|question|help|faq|warning|caution|attention|failure|fail|missing|danger|error|bug|example|quote|cite)\]([+-])*$/;
  const matches = firstLine.toLowerCase().match(regexp);
  return !matches?.[1] ? null : {
    name: matches[1],
    renderStyle: matches[1].match(/(note|important|tip|warning|caution)/) ? vscode5.workspace.getConfiguration("markdownPreviewPlus.styledBlockquote.renderStyle").get(matches[1]) : "Obsidian",
    isCollapsible: matches?.[2] ? true : false,
    initialState: matches?.[2] && matches[2] === "-" ? "closed" : "open"
  };
}

// src/plugins/styled-blockquote/renderer.mjs
function renderBlockquoteOpen(tokens, idx, options, env, self) {
  const token = tokens[idx];
  if (token.meta) {
    if (token.meta.obsidianCallout) {
      return renderOpening2(token.meta.obsidianCallout);
    }
    if (token.meta.gitHubAlert) {
      return renderOpening(token.meta.gitHubAlert);
    }
  }
  return self.renderToken(tokens, idx, options);
}
function renderBlockquoteClose(tokens, idx, options, env, self) {
  const token = tokens[idx];
  if (token.meta) {
    if (token.meta.isObsidianCallout)
      return renderClosing2();
    if (token.meta.isGitHubAlert)
      return renderClosing();
  }
  return self.renderToken(tokens, idx, options);
}

// src/plugins/styled-blockquote/plugin.mjs
function styledBlockquote(md) {
  md.renderer.rules.blockquote_open = renderBlockquoteOpen;
  md.renderer.rules.blockquote_close = renderBlockquoteClose;
  md.block.ruler.at(
    "blockquote",
    (state, startLine, endLine, silent) => {
      const result = blockquote(state, startLine, endLine, silent);
      if (!result)
        return false;
      const tokens = state.tokens;
      const lastToken = tokens[tokens.length - 1];
      if (lastToken?.type !== "blockquote_close")
        return result;
      let i;
      for (i = tokens.length - 2; i >= 0; i--) {
        const token = tokens[i];
        if (token === null)
          throw new Error("Opening tag not found for blockquote!");
        if (token?.type === "blockquote_open")
          break;
      }
      const inlineToken = tokens[i + 2];
      const styledBlockquote2 = parseTokenForStyledBlockquote(inlineToken);
      if (!styledBlockquote2)
        return result;
      const isGitHubAlert = styledBlockquote2.renderStyle === "GitHub";
      const isObsidianCallout = styledBlockquote2.renderStyle === "Obsidian";
      if (isGitHubAlert) {
        const gitHubAlert2 = GitHubAlerts.find((alert) => alert.name === styledBlockquote2.name);
        tokens[i].meta = { isGitHubAlert, gitHubAlert: gitHubAlert2 };
        lastToken.meta = { isGitHubAlert };
      }
      if (isObsidianCallout) {
        const obsidianCallout2 = ObsidianCallouts.find((callout) => callout.aliases.includes(styledBlockquote2.name));
        obsidianCallout2.name = styledBlockquote2.name;
        obsidianCallout2.isCollapsible = styledBlockquote2.isCollapsible;
        obsidianCallout2.initialState = styledBlockquote2.initialState;
        tokens[i].meta = { isObsidianCallout, obsidianCallout: obsidianCallout2 };
        lastToken.meta = { isObsidianCallout };
      }
      inlineToken.content = inlineToken.content.split("\n").slice(1).join("\n");
      return result;
    },
    {
      alt: [
        "paragraph",
        "reference",
        "blockquote",
        "list"
      ]
    }
  );
}

// src/plugins/footnote/plugin.mjs
var vscode6 = __toESM(require("vscode"), 1);
function renderFootnoteAnchorName(tokens, idx, options, env, self) {
  const prefix = typeof env.docId === "string" ? `-${env.docId}-` : "";
  const n = Number(tokens[idx].meta.id + 1).toString();
  return prefix + n;
}
function renderFootnoteCaption(tokens, idx, options, env, self) {
  let n = Number(tokens[idx].meta.id + 1).toString();
  if (tokens[idx].meta.subId > 0)
    n += `:${tokens[idx].meta.subId}`;
  return `[${n}]`;
}
function renderFootnoteRef(tokens, idx, options, env, self) {
  const id = self.rules.footnote_anchor_name(tokens, idx, options, env, self);
  const caption = self.rules.footnote_caption(tokens, idx, options, env, self);
  const refId = tokens[idx].meta.subId > 0 ? `${id}:${tokens[idx].meta.subId}` : id;
  return `<sup class="footnote"><a class="fn-label" href="#fn-${id}" id="fnref-${refId}">${caption}</a></sup>`;
}
function renderFootnoteBlockOpen(tokens, idx, options) {
  const footnoteBlockOpen = '<section class="footnotes">\n<ol class="fn-list">\n';
  const useHorizontalRule = vscode6.workspace.getConfiguration("markdownPreviewPlus.footnote").get("useHorizontalRule");
  return useHorizontalRule ? `<hr class="fn-divider"${options.xhtmlOut ? " />" : ">"}
${footnoteBlockOpen}` : footnoteBlockOpen;
}
function renderFootnoteBlockClose() {
  return "</ol>\n</section>\n";
}
function renderFootnoteOpen(tokens, idx, options, env, self) {
  let id = self.rules.footnote_anchor_name(tokens, idx, options, env, self);
  if (tokens[idx].meta.subId > 0)
    id += `:${tokens[idx].meta.subId}`;
  return `<li id="fn-${id}" class="fn-item">`;
}
function renderFootnoteClose() {
  return "</li>\n";
}
function renderFootnoteAnchor(tokens, idx, options, env, self) {
  let id = self.rules.footnote_anchor_name(tokens, idx, options, env, self);
  if (tokens[idx].meta.subId > 0)
    id += `:${tokens[idx].meta.subId}`;
  return ` <a href="#fnref-${id}" class="fn-label">\u21A9\uFE0E</a>`;
}
function footnote(md) {
  const parseLinkLabel = md.helpers.parseLinkLabel;
  const isSpace3 = md.utils.isSpace;
  md.renderer.rules.footnote_ref = renderFootnoteRef;
  md.renderer.rules.footnote_block_open = renderFootnoteBlockOpen;
  md.renderer.rules.footnote_block_close = renderFootnoteBlockClose;
  md.renderer.rules.footnote_open = renderFootnoteOpen;
  md.renderer.rules.footnote_close = renderFootnoteClose;
  md.renderer.rules.footnote_anchor = renderFootnoteAnchor;
  md.renderer.rules.footnote_caption = renderFootnoteCaption;
  md.renderer.rules.footnote_anchor_name = renderFootnoteAnchorName;
  function footnoteDef(state, startLine, endLine, silent) {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    if (start + 4 > max)
      return false;
    if (state.src.charCodeAt(start) !== 91)
      return false;
    if (state.src.charCodeAt(start + 1) !== 94)
      return false;
    let pos;
    for (pos = start + 2; pos < max; pos++) {
      if (state.src.charCodeAt(pos) === 32)
        return false;
      if (state.src.charCodeAt(pos) === 93)
        break;
    }
    if (pos === start + 2)
      return false;
    if (pos + 1 >= max || state.src.charCodeAt(++pos) !== 58)
      return false;
    if (silent)
      return true;
    pos++;
    if (!state.env.footnotes)
      state.env.footnotes = {};
    if (!state.env.footnotes.refs)
      state.env.footnotes.refs = {};
    const label = state.src.slice(start + 2, pos - 2);
    state.env.footnotes.refs[`:${label}`] = -1;
    const footnoteReferenceOpen = new state.Token("footnote_reference_open", "", 1);
    footnoteReferenceOpen.meta = { label };
    footnoteReferenceOpen.level = state.level++;
    state.tokens.push(footnoteReferenceOpen);
    const oldBMark = state.bMarks[startLine];
    const oldTShift = state.tShift[startLine];
    const oldSCount = state.sCount[startLine];
    const oldParentType = state.parentType;
    const posAfterColon = pos;
    const initial = state.sCount[startLine] + pos - (state.bMarks[startLine] + state.tShift[startLine]);
    let offset = initial;
    while (pos < max) {
      const ch = state.src.charCodeAt(pos);
      if (!isSpace3(ch))
        break;
      offset += ch === 9 ? 4 - offset % 4 : 1;
      pos++;
    }
    state.tShift[startLine] = pos - posAfterColon;
    state.sCount[startLine] = offset - initial;
    state.bMarks[startLine] = posAfterColon;
    state.blkIndent += 4;
    state.parentType = "blockquote";
    if (state.sCount[startLine] < state.blkIndent) {
      state.sCount[startLine] += state.blkIndent;
    }
    state.md.block.tokenize(state, startLine, endLine);
    state.parentType = oldParentType;
    state.blkIndent -= 4;
    state.tShift[startLine] = oldTShift;
    state.sCount[startLine] = oldSCount;
    state.bMarks[startLine] = oldBMark;
    const footnoteReferenceClose = new state.Token("footnote_reference_close", "", -1);
    footnoteReferenceClose.level = --state.level;
    state.tokens.push(footnoteReferenceClose);
    return true;
  }
  function footnoteInline(state, silent) {
    const max = state.posMax;
    const start = state.pos;
    if (start + 2 >= max)
      return false;
    if (state.src.charCodeAt(start) !== 94)
      return false;
    if (state.src.charCodeAt(start + 1) !== 91)
      return false;
    const labelStart = start + 2;
    const labelEnd = parseLinkLabel(state, start + 1);
    if (labelEnd < 0)
      return false;
    if (!silent) {
      if (!state.env.footnotes)
        state.env.footnotes = {};
      if (!state.env.footnotes.list)
        state.env.footnotes.list = [];
      const footnoteId = state.env.footnotes.list.length;
      const tokens = [];
      state.md.inline.parse(state.src.slice(labelStart, labelEnd), state.md, state.env, tokens);
      const token = state.push("footnote_ref", "", 0);
      token.meta = { id: footnoteId };
      state.env.footnotes.list[footnoteId] = {
        content: state.src.slice(labelStart, labelEnd),
        tokens
      };
    }
    state.pos = labelEnd + 1;
    state.posMax = max;
    return true;
  }
  function footnoteRef(state, silent) {
    const max = state.posMax;
    const start = state.pos;
    if (start + 3 > max)
      return false;
    if (!state.env.footnotes || !state.env.footnotes.refs)
      return false;
    if (state.src.charCodeAt(start) !== 91)
      return false;
    if (state.src.charCodeAt(start + 1) !== 94)
      return false;
    let pos;
    for (pos = start + 2; pos < max; pos++) {
      if (state.src.charCodeAt(pos) === 32)
        return false;
      if (state.src.charCodeAt(pos) === 10)
        return false;
      if (state.src.charCodeAt(pos) === 93)
        break;
    }
    if (pos === start + 2)
      return false;
    if (pos >= max)
      return false;
    pos++;
    const label = state.src.slice(start + 2, pos - 1);
    if (typeof state.env.footnotes.refs[`:${label}`] === "undefined")
      return false;
    if (!silent) {
      if (!state.env.footnotes.list)
        state.env.footnotes.list = [];
      let footnoteId;
      if (state.env.footnotes.refs[`:${label}`] < 0) {
        footnoteId = state.env.footnotes.list.length;
        state.env.footnotes.list[footnoteId] = { label, count: 0 };
        state.env.footnotes.refs[`:${label}`] = footnoteId;
      } else {
        footnoteId = state.env.footnotes.refs[`:${label}`];
      }
      const footnoteSubId = state.env.footnotes.list[footnoteId].count;
      state.env.footnotes.list[footnoteId].count++;
      const token = state.push("footnote_ref", "", 0);
      token.meta = { id: footnoteId, subId: footnoteSubId, label };
    }
    state.pos = pos;
    state.posMax = max;
    return true;
  }
  function footnoteTail(state) {
    let tokens;
    let current;
    let currentLabel;
    let insideRef = false;
    const refTokens = {};
    if (!state.env.footnotes)
      return;
    state.tokens = state.tokens.filter((token) => {
      if (token?.type === "footnote_reference_open") {
        insideRef = true;
        current = [];
        currentLabel = token.meta.label;
        return false;
      }
      if (token?.type === "footnote_reference_close") {
        insideRef = false;
        refTokens[":" + currentLabel] = current;
        return false;
      }
      if (insideRef)
        current.push(token);
      return !insideRef;
    });
    if (!state.env.footnotes.list)
      return;
    const list2 = state.env.footnotes.list;
    state.tokens.push(new state.Token("footnote_block_open", "", 1));
    for (let i = 0, l = list2.length; i < l; i++) {
      const footnoteOpen = new state.Token("footnote_open", "", 1);
      footnoteOpen.meta = { id: i, label: list2[i].label };
      state.tokens.push(footnoteOpen);
      if (list2[i].tokens) {
        tokens = [];
        const paragraphOpen = new state.Token("paragraph_open", "p", 1);
        paragraphOpen.block = true;
        tokens.push(paragraphOpen);
        const inline = new state.Token("inline", "", 0);
        inline.children = list2[i].tokens;
        inline.content = list2[i].content;
        tokens.push(inline);
        const paragraphClose = new state.Token("paragraph_close", "p", -1);
        paragraphClose.block = true;
        tokens.push(paragraphClose);
      } else if (list2[i].label) {
        tokens = refTokens[`:${list2[i].label}`];
      }
      if (tokens)
        state.tokens = state.tokens.concat(tokens);
      const lastParagraph = state.tokens[state.tokens.length - 1]?.type === "paragraph_close" ? state.tokens.pop() : null;
      const t = list2[i].count > 0 ? list2[i].count : 1;
      for (let j = 0; j < t; j++) {
        const footnoteAnchor = new state.Token("footnote_anchor", "", 0);
        footnoteAnchor.meta = { id: i, subId: j, label: list2[i].label };
        state.tokens.push(footnoteAnchor);
      }
      if (lastParagraph)
        state.tokens.push(lastParagraph);
      state.tokens.push(new state.Token("footnote_close", "", -1));
    }
    state.tokens.push(new state.Token("footnote_block_close", "", -1));
  }
  md.block.ruler.before("reference", "footnote_def", footnoteDef, { alt: ["paragraph", "reference"] });
  md.inline.ruler.after("image", "footnote_inline", footnoteInline);
  md.inline.ruler.after("footnote_inline", "footnote_ref", footnoteRef);
  md.core.ruler.after("inline", "footnote_tail", footnoteTail);
}

// src/plugins/table-of-contents/plugin.mjs
var headings = [];
var slugify = (str) => {
  const encodedString = encodeURI(
    str.trim().toLowerCase().replace(/\s+/g, "-").replace(/[\]\[\!\/\'\"\#\$\%\&\(\)\*\+\,\.\/\:\;\<\=\>\?\@\\\^\{\|\}\~\`。，、；：？！…—·ˉ¨‘’“”々～‖∶＂＇｀｜〃〔〕〈〉《》「」『』．〖〗【】（）［］｛｝]/g, "").replace(/^\-+/, "").replace(/\-+$/, "")
  );
  return { value: encodedString };
};
var slugCount = /* @__PURE__ */ new Map();
function captureHeadings(state, startLine, endLine, silent) {
  const tokens = state.tokens;
  if (headings.length)
    headings = [];
  tokens.forEach((token) => {
    if (token?.type === "heading_open") {
      if (headings.find((heading) => heading.token === token))
        return false;
      const content = tokens[tokens.indexOf(token) + 1].content;
      headings.push({ token, content });
    }
  });
  return false;
}
function toc(state, silent) {
  if (state.src.charCodeAt(state.pos) !== 91)
    return false;
  if (silent)
    return false;
  const match = /^\[\[toc\]\]/im.test(state.src.slice(state.pos));
  if (!match)
    return false;
  let token = state.push("toc_open", "toc", 1);
  token.markup = "[[toc]]";
  token = state.push("toc_body", "", 0);
  token = state.push("toc_close", "toc", -1);
  const newline = state.src.indexOf("\n", state.pos);
  state.pos = newline !== -1 ? newline : state.pos + state.posMax + 1;
  return true;
}
function tableOfContents(md) {
  md.renderer.rules.toc_open = (tokens, index) => '<div class="table-of-contents">';
  md.renderer.rules.toc_body = (tokens, index, options, env, self) => {
    let result = [];
    let ulStack = [];
    headings.forEach((heading) => {
      const level = parseInt(heading.token.tag.replace(/h/ig, ""));
      const content = heading.content;
      let slug = slugify(content);
      if (slugCount.has(slug.value)) {
        const existingSlugCount = slugCount.get(slug.value);
        const currentSlugCount = existingSlugCount + 1;
        slugCount.set(slug.value, currentSlugCount);
        slug = slugify(slug.value + "-" + currentSlugCount);
      } else {
        slugCount.set(slug.value, 0);
      }
      let li = `<li><a href="#${slug.value}">${content}</a></li>`;
      while (ulStack.length > level) {
        result.push("</ul>");
        ulStack.pop();
      }
      if (ulStack.length === level) {
        result.push(li);
      } else {
        result.push("<ul>");
        ulStack.push("<ul>");
        result.push(li);
      }
    });
    while (ulStack.length) {
      result.push("</ul>");
      ulStack.pop();
    }
    return result.join("");
  };
  md.renderer.rules.toc_close = (tokens, index) => "</div>";
  md.block.ruler.after("heading", "capture_headings", captureHeadings);
  md.inline.ruler.push("toc", toc);
}

// src/plugins/color-tag/plugin.mjs
var vscode7 = __toESM(require("vscode"), 1);
function isValidHexColor(str) {
  return /^#[0-9A-F]{3}([0-9A-F]{3})?$/i.test(str);
}
function isValidRgbColor(str) {
  return /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i.test(str);
}
function isValidHslColor(str) {
  return /^hsl\(\s*\d{1,3}(deg)?\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/i.test(str);
}
function colorTag(md) {
  const defaultRender = md.renderer.rules.code_inline || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
  md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const content = token?.content;
    const backgroundColor = isValidHexColor(content) || isValidRgbColor(content) || isValidHslColor(content) ? content : null;
    if (!backgroundColor)
      return defaultRender(tokens, idx, options, env, self);
    const themeKinds = ["light", "dark", "dark", "light"];
    const theme = themeKinds[vscode7.window.activeColorTheme.kind];
    return `<code class="color-tag" theme="${theme}">${content}<span style="background-color: ${content};" class="color-swatch"></span></code>`;
  };
}

// src/plugins/highlighter/plugin.mjs
var vscode8 = __toESM(require("vscode"), 1);
function highlighter(md) {
  const defaultRenderer = md.renderer.rules.mark_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };
  md.renderer.rules.mark_open = function(tokens, idx, options, env, self) {
    const styleVariant = vscode8.workspace.getConfiguration("markdownPreviewPlus.highlighter").get("styleVariant");
    if (styleVariant !== "none") {
      tokens[idx].attrPush(["class", `highlighter ${styleVariant}`]);
    }
    return defaultRenderer(tokens, idx, options, env, self);
  };
  md.inline.ruler.before("emphasis", "mark", (state, silent) => {
    if (silent)
      return false;
    const syntaxVariant = vscode8.workspace.getConfiguration("markdownPreviewPlus.highlighter").get("syntaxVariant");
    if (syntaxVariant === "<mark>")
      return false;
    const targetText = syntaxVariant === "#" ? "#" : "==";
    const targetChar = syntaxVariant === "#" ? 35 : 61;
    const start = state.pos;
    const marker = state.src.charCodeAt(start);
    if (marker !== targetChar)
      return false;
    let end = state.pos + 1;
    while (end < state.src.length && state.src.charCodeAt(end) !== targetChar) {
      end++;
    }
    if (end >= state.src.length || end <= start + 2)
      return false;
    if (state.src.charCodeAt(end) !== targetChar)
      return false;
    if (start > 0 && state.src.charCodeAt(start - 1) !== 32 && state.src.charCodeAt(start - 1) !== 10)
      return false;
    if (end + 1 < state.src.length && state.src.charCodeAt(end + 1) !== 32 && state.src.charCodeAt(end + 1) !== 10)
      return false;
    state.pos = start;
    let token = state.push("mark_open", "mark", 1);
    token.markup = targetText;
    token.level = state.level;
    state.pos = start + 1;
    token = state.push("text", "", 0);
    token.content = state.src.slice(start + 1, end);
    token.level = state.level;
    state.pos = end;
    token = state.push("mark_close", "mark", -1);
    token.markup = targetText;
    token.level = state.level;
    state.pos = end + 1;
    return true;
  });
}

// src/plugins/task-list/plugin.mjs
var vscode9 = __toESM(require("vscode"), 1);

// src/lib/list.mjs
function isSpace2(code) {
  return code === 9 || code === 32 ? true : false;
}
function skipBulletListMarker(state, startLine) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];
  const marker = state.src.charCodeAt(pos++);
  if (marker !== 42 && marker !== 45 && marker !== 43)
    return -1;
  if (pos < max && !isSpace2(state.src.charCodeAt(pos)))
    return -1;
  return pos;
}
function skipOrderedListMarker(state, startLine) {
  const start = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];
  let pos = start;
  if (pos + 1 >= max)
    return -1;
  let ch = state.src.charCodeAt(pos++);
  if (ch < 48 || ch > 57)
    return -1;
  for (; ; ) {
    if (pos >= max)
      return -1;
    ch = state.src.charCodeAt(pos++);
    if (ch >= 48 && ch <= 57) {
      if (pos - start >= 10)
        return -1;
      continue;
    }
    if (ch === 41 || ch === 46)
      break;
    return -1;
  }
  if (pos < max && !isSpace2(state.src.charCodeAt(pos)))
    return -1;
  return pos;
}
function markTightParagraphs(state, idx) {
  const level = state.level + 2;
  for (let i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
    if (state.tokens[i].level === level && state.tokens?.[i]?.type === "paragraph_open") {
      state.tokens[i + 2].hidden = true;
      state.tokens[i].hidden = true;
      i += 2;
    }
  }
}
function list(state, startLine, endLine, silent) {
  let max;
  let pos;
  let start;
  let nextLine = startLine;
  let tight = true;
  if (state.sCount[nextLine] - state.blkIndent >= 4)
    return false;
  if (state.listIndent >= 0 && state.sCount[nextLine] - state.listIndent >= 4 && state.sCount[nextLine] < state.blkIndent) {
    return false;
  }
  let isTerminatingParagraph = silent && state.parentType === "paragraph" && state.sCount[nextLine] >= state.blkIndent ? true : false;
  let isOrdered;
  let markerValue;
  let posAfterMarker;
  if ((posAfterMarker = skipOrderedListMarker(state, nextLine)) >= 0) {
    isOrdered = true;
    start = state.bMarks[nextLine] + state.tShift[nextLine];
    markerValue = Number(state.src.slice(start, posAfterMarker - 1));
    if (isTerminatingParagraph && markerValue !== 1)
      return false;
  } else if ((posAfterMarker = skipBulletListMarker(state, nextLine)) >= 0) {
    isOrdered = false;
  } else {
    return false;
  }
  if (isTerminatingParagraph && state.skipSpaces(posAfterMarker) >= state.eMarks[nextLine])
    return false;
  if (silent)
    return true;
  const markerCharCode = state.src.charCodeAt(posAfterMarker - 1);
  const listTokIdx = state.tokens.length;
  let token;
  if (isOrdered) {
    token = state.push("ordered_list_open", "ol", 1);
    if (markerValue !== 1) {
      token.attrs = [["start", String(markerValue)]];
    }
  } else {
    token = state.push("bullet_list_open", "ul", 1);
  }
  const listLines = [nextLine, 0];
  token.map = listLines;
  token.markup = String.fromCharCode(markerCharCode);
  let prevEmptyEnd = false;
  const terminatorRules = state.md.block.ruler.getRules("list");
  const oldParentType = state.parentType;
  state.parentType = "list";
  while (nextLine < endLine) {
    pos = posAfterMarker;
    max = state.eMarks[nextLine];
    const initial = state.sCount[nextLine] + posAfterMarker - (state.bMarks[nextLine] + state.tShift[nextLine]);
    let offset = initial;
    while (pos < max) {
      const ch = state.src.charCodeAt(pos);
      if (ch !== 9 && ch !== 32)
        break;
      if (ch === 9) {
        offset += 4 - (offset + state.bsCount[nextLine]) % 4;
      } else if (ch === 32) {
        offset++;
      }
      pos++;
    }
    const contentStart = pos;
    let indentAfterMarker = contentStart >= max ? 1 : offset - initial > 4 ? 1 : offset - initial;
    const indent = initial + indentAfterMarker;
    token = state.push("list_item_open", "li", 1);
    token.markup = String.fromCharCode(markerCharCode);
    const itemLines = [nextLine, 0];
    token.map = itemLines;
    if (isOrdered)
      token.info = state.src.slice(start, posAfterMarker - 1);
    const oldTight = state.tight;
    const oldTShift = state.tShift[nextLine];
    const oldSCount = state.sCount[nextLine];
    const oldListIndent = state.listIndent;
    state.listIndent = state.blkIndent;
    state.blkIndent = indent;
    state.tight = true;
    state.tShift[nextLine] = contentStart - state.bMarks[nextLine];
    state.sCount[nextLine] = offset;
    if (contentStart >= max && state.isEmpty(nextLine + 1)) {
      state.line = Math.min(state.line + 2, endLine);
    } else {
      state.md.block.tokenize(state, nextLine, endLine);
    }
    if (!state.tight || prevEmptyEnd)
      tight = false;
    prevEmptyEnd = state.line - nextLine > 1 && state.isEmpty(state.line - 1);
    state.blkIndent = state.listIndent;
    state.listIndent = oldListIndent;
    state.tShift[nextLine] = oldTShift;
    state.sCount[nextLine] = oldSCount;
    state.tight = oldTight;
    token = state.push("list_item_close", "li", -1);
    token.markup = String.fromCharCode(markerCharCode);
    nextLine = state.line;
    itemLines[1] = nextLine;
    if (nextLine >= endLine)
      break;
    if (state.sCount[nextLine] < state.blkIndent)
      break;
    if (state.sCount[nextLine] - state.blkIndent >= 4)
      break;
    let terminate = false;
    for (let i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate)
      break;
    if (isOrdered) {
      posAfterMarker = skipOrderedListMarker(state, nextLine);
      if (posAfterMarker < 0)
        break;
      start = state.bMarks[nextLine] + state.tShift[nextLine];
    } else {
      posAfterMarker = skipBulletListMarker(state, nextLine);
      if (posAfterMarker < 0)
        break;
    }
    if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1))
      break;
  }
  if (isOrdered) {
    token = state.push("ordered_list_close", "ol", -1);
  } else {
    token = state.push("bullet_list_close", "ul", -1);
  }
  token.markup = String.fromCharCode(markerCharCode);
  listLines[1] = nextLine;
  state.line = nextLine;
  state.parentType = oldParentType;
  if (tight)
    markTightParagraphs(state, listTokIdx);
  return true;
}

// src/plugins/task-list/plugin.mjs
function taskList(md) {
  md.renderer.rules.task_list_open = function(tokens, idx, options, env, self) {
    return '<ul class="task-list">';
  };
  md.renderer.rules.task_list_item_open = function(tokens, idx, options, env, self) {
    const checkboxValue = tokens[idx].meta.checkboxValue;
    const isChecked = checkboxValue.charCodeAt(0) !== 32;
    const isStrikethrough = checkboxValue === "x";
    const staticCheckboxes = vscode9.workspace.getConfiguration("markdownPreviewPlus.taskList").get("staticCheckboxes");
    const checkbox = `<label class="tl-marker${staticCheckboxes ? " is-static" : ""}"><input type="checkbox" class="tl-checkbox" ${isChecked ? "checked" : ""}></label>`;
    return `<li class="tl-item">${checkbox}<span class="tl-content${isStrikethrough ? " is-strikethrough" : ""}">`;
  };
  md.renderer.rules.task_list_item_close = function(tokens, idx, options, env, self) {
    return "</span></li>";
  };
  md.renderer.rules.task_list_close = function(tokens, idx, options, env, self) {
    return "</ul>";
  };
  md.block.ruler.at(
    "list",
    (state, startLine, endLine, silent) => {
      const result = list(state, startLine, endLine, silent);
      if (!result)
        return false;
      const tokens = state.tokens;
      if (tokens.at(-1)?.type !== "bullet_list_close")
        return result;
      const listOpenIndex = tokens.findLastIndex((token) => token?.type === "bullet_list_open");
      const listOpenToken = tokens[listOpenIndex];
      const thisListTokens = tokens.slice(listOpenIndex + 1);
      const listItemOpenTokens = thisListTokens.filter((token) => token?.type === "list_item_open");
      const listItemInlineTokens = thisListTokens.filter((token) => token?.type === "inline");
      const listItemCloseTokens = thisListTokens.filter((token) => token?.type === "list_item_close");
      const listCloseToken = tokens.at(-1);
      for (let i = 0; i < listItemOpenTokens.length; i++) {
        const match = listItemInlineTokens[i]?.content?.match(/^\[(.)\]\s(.*)$/);
        if (!match)
          continue;
        const [_, checkboxValue, text] = match;
        listItemOpenTokens[i].type = "task_list_item_open";
        listItemOpenTokens[i].meta ??= {};
        listItemOpenTokens[i].meta.checkboxValue = checkboxValue;
        listItemInlineTokens[i].content = text;
        listItemCloseTokens[i].type = "task_list_item_close";
      }
      if (listItemOpenTokens.some((token) => token?.type === "task_list_item_open")) {
        listOpenToken.type = "task_list_open";
        listCloseToken.type = "task_list_close";
      }
      return result;
    },
    {
      alt: [
        "paragraph",
        "reference",
        "blockquote"
      ]
    }
  );
}

// src/extension.mjs
function activate(context) {
  context.subscriptions.push(
    vscode10.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("markdownPreviewPlus")) {
        vscode10.commands.executeCommand("markdown.preview.refresh");
      }
    })
  );
  return {
    /**
     * Extends the markdown-it instance with the plugin(s) provided.
     * @param {MarkdownIt} md - The markdown-it instance.
     * @returns {MarkdownIt} - The markdown-it instance with the plugin(s) applied.
     */
    extendMarkdownIt(md) {
      return md.use(styledBlockquote).use(footnote).use(tableOfContents).use(colorTag).use(highlighter).use(taskList);
    }
  };
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
