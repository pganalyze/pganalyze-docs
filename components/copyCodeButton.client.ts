// Framework-agnostic copy button for docs code blocks — the default copy button
// on the public docs site (the in-app build injects its own button via
// WithCopyButton). CodeBlock renders
//   <copy-code-button><button class="copyIcon">…copy icon…</button></copy-code-button>
// and this custom element wires that button to copy the adjacent code block's
// text on the client, so copy works on statically-rendered docs pages without
// hydrating the CodeBlock React component.
//
// Defined once via a <script> in DocsLayout; the registry persists across
// view-transition navigations and new instances upgrade automatically.

import { faCheck } from "@fortawesome/pro-light-svg-icons";

// Check icon shown briefly after a copy.
const [CHECK_W, CHECK_H, , , rawCheckPath] = faCheck.icon;
const CHECK_PATH = Array.isArray(rawCheckPath)
  ? rawCheckPath.join("")
  : rawCheckPath;
const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CHECK_W} ${CHECK_H}" aria-hidden="true" focusable="false" width="1em" height="1em" fill="currentColor"><path d="${CHECK_PATH}"/></svg>`;

class CopyCodeButtonElement extends HTMLElement {
  connectedCallback() {
    const button = this.querySelector("button");
    if (!button || button.dataset.copyWired === "true") return;
    button.dataset.copyWired = "true";

    button.addEventListener("click", async (event) => {
      event.preventDefault();
      // <copy-code-button> is a direct child of CodeBlock's wrapper (its class is
      // CSS-module-hashed, so anchor on the parent rather than a class name); the
      // code lives in the sibling [data-code-block] container's <code>.
      const code =
        this.parentElement?.querySelector("[data-code-block] code")
          ?.textContent ?? "";
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        return; // clipboard unavailable (e.g. insecure context) — leave as-is
      }
      const original = button.innerHTML;
      button.innerHTML = CHECK_ICON;
      button.setAttribute("title", "Copied!");
      window.setTimeout(() => {
        button.innerHTML = original;
        button.removeAttribute("title");
      }, 2000);
    });
  }
}

if (
  typeof customElements !== "undefined" &&
  !customElements.get("copy-code-button")
) {
  customElements.define("copy-code-button", CopyCodeButtonElement);
}

export {};
