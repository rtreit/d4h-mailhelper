(function () {
  // Add version number for debugging
  const VERSION = "0.3";
  console.log(`D4H Mail Helper v${VERSION}: Content script loaded on ${window.location.href}`);
  
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
    btn.textContent = "Copy Exercises";

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
        boxShadow: "0 4px 8px rgba(0,0,0,0.6)",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        pointerEvents: "auto", // Button is clickable
        textTransform: "uppercase" // Make text uppercase to be more obvious
    });

    // --- Attach to DOM ---
    overlay.appendChild(btn);
    document.documentElement.appendChild(overlay);

    console.log("D4H Mail Helper: Button attached to overlay.");

    // --- Add Click Logic ---
    btn.addEventListener("click", function() {
      console.log("D4H Mail Helper: Button clicked");
      
      try {
        const rows = Array.from(document.querySelectorAll("tr")).reverse();
        console.log(`D4H Mail Helper: Found ${rows.length} table rows`);

        // Map rows to HTML list item strings
        const listItems = rows.flatMap((tr) => {
          const links = Array.from(tr.querySelectorAll("a"));
          const ev = links.find((a) => /\/exercises\/view\//.test(a.href));
          const dt = links.find((a) => /\/calendar\/day/.test(a.href));

          if (ev && dt) {
            const what = makeAnchor(ev.href, ev.innerText);
            const when = makeAnchor(dt.href, dt.innerText);
            // Return a string for a list item with em dash
            return [`  <li>${what} — ${when}</li>`];
          }
          return [];
        }).join("\n");

        // If no rows were found, alert the user and stop
        if (!listItems) {
          alert("No valid exercise rows found to copy.");
          return;
        }

        // Assemble the HTML list with clean formatting
        const htmlList = `<ul style="margin:0;padding-left:20px">\n${listItems}\n</ul>`;
        console.log("D4H Mail Helper: Generated HTML:", htmlList);

        // --- Use simpler clipboard method first ---
        navigator.clipboard.writeText(htmlList)
          .then(() => {
            console.log("D4H Mail Helper: Plain text copy successful");
            alert("Bullet-list format copied – paste into the email body 📨");
          })
          .catch(err => {
            console.error("Plain text copy failed:", err);
            
            // Try the multi-format method
            try {
              console.log("D4H Mail Helper: Attempting to copy HTML using ClipboardItem");
              const blobHtml = new Blob([htmlList], { type: "text/html" });
              const blobPlain = new Blob([htmlList], { type: "text/plain" });

              navigator.clipboard.write([
                new ClipboardItem({
                  "text/html": blobHtml,
                  "text/plain": blobPlain
                })
              ]).then(() => {
                console.log("D4H Mail Helper: HTML copy successful!");
                alert("Bullet-list format copied – paste into the email body 📨");
              }).catch((clipErr) => {
                console.error("HTML copy failed:", clipErr);
                fallbackCopyMethod(htmlList);
              });
            } catch (e) {
              console.error("Modern clipboard API not supported:", e);
              fallbackCopyMethod(htmlList);
            }
          });
      } catch (err) {
        console.error("D4H Mail Helper: Error in click handler:", err);
        alert("Error copying data. See console for details.");
      }
    });

    // Fallback copy method using execCommand
    function fallbackCopyMethod(html) {
      // Create a temporary, editable element to hold the HTML
      const container = document.createElement('div');
      container.contentEditable = 'true';
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.opacity = '0';
      container.innerHTML = html;
      document.body.appendChild(container);

      // Select and copy
      const range = document.createRange();
      range.selectNodeContents(container);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      let success = false;
      try {
        success = document.execCommand('copy');
      } catch (err) {
        console.error('Copy command failed', err);
      }

      // Clean up
      selection.removeAllRanges();
      document.body.removeChild(container);

      if (success) {
        alert('Formatted exercise list copied to clipboard (fallback method)!');
      } else {
        alert('Could not copy list. See console for details.');
      }
    }
  }

  // --- Main Execution Logic ---
  function main() {
    console.log("D4H Mail Helper: Main function executing");
    
    // Always add a debug message to the page for troubleshooting
    const debugMsg = document.createElement('div');
    debugMsg.style.position = 'fixed';
    debugMsg.style.bottom = '10px';
    debugMsg.style.left = '10px';
    debugMsg.style.padding = '5px';
    debugMsg.style.background = 'rgba(255,255,0,0.7)';
    debugMsg.style.color = 'black';
    debugMsg.style.zIndex = '9999999';
    debugMsg.style.fontSize = '10px';
    debugMsg.style.fontFamily = 'Arial, sans-serif';
    debugMsg.textContent = `D4H Helper v${VERSION} loaded at ${new Date().toTimeString().split(' ')[0]}`;
    
    // Try to add the debug message in a way that works even if other parts fail
    setTimeout(() => {
      try {
        document.body.appendChild(debugMsg);
        console.log("D4H Mail Helper: Debug message added to page");
      } catch (e) {
        console.error("Failed to add debug message:", e);
      }
    }, 1000);
    
    // Try adding the button regardless of table detection
    addButton();
    
    // Also add a backup method in case the button wasn't added correctly
    setTimeout(() => {
      if (!document.querySelector("#d4h-mail-helper-btn")) {
        console.log("D4H Mail Helper: Button not found, trying again");
        addButton();
      }
    }, 3000);
  }

  // Run the script with a slight delay to let page initialize
  setTimeout(main, 500);
})();
