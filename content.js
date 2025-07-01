(function () {
  console.log("D4H Mail Helper: Content script loaded on", window.location.href);
  
  // ----- helper to make <a> … </a> blocks -----------------------------
  const makeAnchor = (href, text) =>
    `<a href="${href}">${text.replace(/\s+/g, " ").trim()}</a>`;

  // ----- add the UI button --------------------------------------------
  function addButton() {
    // Check if button already exists in any frame context
    if (document.querySelector("#d4h-mail-helper-btn")) {
        console.log("D4H Mail Helper: Button already exists.");
        return;
    }

    console.log("D4H Mail Helper: Creating the button.");

    // --- Create the Button Element ---
    const btn = document.createElement("button");
    btn.id = "d4h-mail-helper-btn";
    btn.textContent = "🟠 Copy mail block";

    // --- Create the Overlay Container ---
    const overlay = document.createElement("div");
    overlay.id = "d4h-mail-helper-overlay";

    // --- Apply Styles ---
    Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        zIndex: "2147483647", // Max possible z-index
        pointerEvents: "none", // Clicks pass through the overlay
    });

    Object.assign(btn.style, {
        position: "absolute",
        top: "60px",
        right: "20px",
        background: "#ff9900",
        color: "white",
        border: "2px solid #cc7700",
        padding: "8px 12px",
        borderRadius: "6px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.4)",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        pointerEvents: "auto", // Button is clickable
    });

    // --- Attach to DOM ---
    overlay.appendChild(btn);
    document.documentElement.appendChild(overlay);

    console.log("D4H Mail Helper: Button attached to overlay.");

    // --- Add Click Logic ---
    btn.onclick = () => {
      const rows = Array.from(document.querySelectorAll("tr"));

      // Map rows to HTML table row strings
      const tableRows = rows.flatMap((tr) => {
        const links = Array.from(tr.querySelectorAll("a"));
        const ev = links.find((a) => /\/exercises\/view\//.test(a.href));
        const dt = links.find((a) => /\/calendar\/day/.test(a.href));

        if (ev && dt) {
          const what = makeAnchor(ev.href, ev.innerText);
          const when = makeAnchor(dt.href, dt.innerText);
          // Return a string for a table row
          return [`    <tr>\n      <td style="padding: 5px; border: 1px solid #ccc;">${what}</td>\n      <td style="padding: 5px; border: 1px solid #ccc;">${when}</td>\n    </tr>`];
        }
        return [];
      }).join("\n");

      // If no rows were found, alert the user and stop
      if (!tableRows) {
        alert("No valid exercise rows found to copy.");
        return;
      }

      // Assemble the full HTML table with inline styles for email clients
      const htmlTable = `
<table style="border-collapse: collapse; width: 100%; font-family: sans-serif;">
  <thead>
    <tr>
      <th style="padding: 8px; border: 1px solid #ccc; background-color: #f0f0f0; text-align: left;">Training</th>
      <th style="padding: 8px; border: 1px solid #ccc; background-color: #f0f0f0; text-align: left;">Date</th>
    </tr>
  </thead>
  <tbody>
${tableRows}
  </tbody>
</table>`;

      // --- Copy the raw HTML string to the clipboard ---
      navigator.clipboard.writeText(htmlTable).then(() => {
        alert('HTML table source code copied to clipboard!');
      }).catch(err => {
        console.error('D4H Mail Helper: Could not copy text:', err);
        alert('Could not copy HTML source to clipboard. See console for details.');
      });
    };
  }

  // --- Main Execution Logic ---
  function main() {
    // We are in an iframe, so we need to find the table
    if (document.querySelector("table")) {
      addButton();
    } else {
      // Fallback if table is not immediately available
      const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector("table")) {
          addButton();
          obs.disconnect(); // Stop observing once found
        }
      });

      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        // If body isn't ready, wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => {
          observer.observe(document.body, { childList: true, subtree: true });
        });
      }
    }
  }

  // Run the script
  main();
})();
