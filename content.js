(() => {
  console.log("VTO Auto-Mater started");

  let refreshLoop = null;
  let dropWindowOpened = false;

  // Build a unique CSS path for debugging/logging
  const buildCssPath = (el) => {
    if (!(el instanceof Element)) return "";
    const path = [];
    while (el.nodeType === Node.ELEMENT_NODE) {
      let selector = el.nodeName.toLowerCase();
      if (el.id) {
        selector += `#${el.id}`;
        path.unshift(selector);
        break;
      } else {
        let sibling = el, nth = 1;
        while ((sibling = sibling.previousElementSibling)) {
          if (sibling.nodeName.toLowerCase() === selector) nth++;
        }
        if (nth !== 1) selector += `:nth-of-type(${nth})`;
      }
      path.unshift(selector);
      el = el.parentNode;
    }
    return path.join(" > ");
  };

  // Handle "Stay logged in" button if it appears
  const handleStayLoggedIn = () => {
    const stayBtn = [...document.querySelectorAll("button")].find(
      (b) => b.textContent.trim().toLowerCase() === "stay logged in"
    );
    if (stayBtn) {
      console.log("Detected 'Stay logged in' prompt → clicking");
      console.log("Selector:", buildCssPath(stayBtn));
      stayBtn.click();
      return true;
    }
    return false;
  };

  // Handle confirm modal "Accept VTO" button
  const confirmAccept = () => {
    const confirmBtn = document.querySelector(
      "button[data-test-id='VtoSummaryModal_acceptButton']"
    );
    if (confirmBtn) {
      console.log("Clicking confirm 'Accept VTO' button");
      console.log("Selector:", buildCssPath(confirmBtn));
      confirmBtn.click();
      clearInterval(refreshLoop);
      console.log("VTO successfully accepted and confirmed. Auto-Mater finished.");
      return true;
    }
    return false;
  };

  // Look for "Accept" buttons in the drop list
  const tryAcceptDrop = () => {
    const acceptBtns = [...document.querySelectorAll("button")].filter(
      (b) => b.textContent.trim().toLowerCase() === "accept"
    );

    if (acceptBtns.length === 0) {
      console.log("No 'Accept' buttons found → reloading");
      setTimeout(() => location.reload(), 1000);
      return false;
    }

    acceptBtns.forEach((btn, i) => {
      console.log(`Accept button #${i + 1}:`, buildCssPath(btn));
    });

    console.log("Clicking first 'Accept' button");
    acceptBtns[0].click();

    // Attempt confirm shortly after click
    setTimeout(() => {
      if (!confirmAccept()) {
        console.log("Confirm button not yet visible → will check again...");
      }
    }, 500);

    return true;
  };

  // Main loop
  const tick = () => {
    handleStayLoggedIn();

    if (confirmAccept()) return;

    const accepted = tryAcceptDrop();
    if (accepted) return;

    const now = new Date();
    const hour = now.getHours();
    const min = now.getMinutes();
    const sec = now.getSeconds();

    // Aggressive reload: 7:59:50 → 8:00:10
    if (
      (hour === 19 && min === 59 && sec >= 50) ||
      (hour === 20 && min === 0 && sec <= 10)
    ) {
      dropWindowOpened = true;
      console.log(`Aggressive reload at ${now.toLocaleTimeString()}`);
      location.reload();
    } else if (dropWindowOpened && hour === 20 && min === 0 && sec > 10) {
      console.log("Drop window passed. Auto-Mater stopped.");
      clearInterval(refreshLoop);
    }
  };

  const startWatcher = () => {
    if (refreshLoop) return;
    console.log("Watching for VTO drop at 8PM...");
    refreshLoop = setInterval(tick, 2000); // check every 2s
  };

  startWatcher();
})();
