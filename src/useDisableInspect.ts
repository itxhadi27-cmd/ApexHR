import { useEffect } from "react";

/**
 * Disables the right-click context menu and common keyboard shortcuts
 * used to open developer tools or view/save page source.
 *
 * NOTE: This is only a deterrent. It does not provide real protection —
 * source code remains accessible via browser dev tools, view-source,
 * or by disabling JavaScript. It will also interfere with normal
 * browser features such as copy/paste, "open in new tab", and
 * accessibility tools.
 */
export function useDisableInspect() {
  useEffect(() => {
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();

    const blockShortcuts = (e: KeyboardEvent) => {
      // F12 - DevTools
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
      // Ctrl/Cmd+Shift+I, J, C - DevTools panels
      if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) {
        e.preventDefault();
        return false;
      }
      // Ctrl/Cmd+U - View Source
      if ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "U") {
        e.preventDefault();
        return false;
      }
      // Ctrl/Cmd+S - Save Page
      if ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "S") {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockShortcuts);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockShortcuts);
    };
  }, []);
}
