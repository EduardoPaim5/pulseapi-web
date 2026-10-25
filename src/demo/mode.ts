const key = "pulseapi-portfolio-demo";

function selectedMode(): boolean {
  const choice = new URLSearchParams(window.location.search).get("demo");
  try {
    if (choice === "0") sessionStorage.removeItem(key);
    if (choice === "1") sessionStorage.setItem(key, "1");
    return choice === "1" || (choice !== "0" && sessionStorage.getItem(key) === "1");
  } catch {
    return choice === "1";
  }
}

// Explicit opt-in only. Never enter demo mode after an API failure.
export const demoMode = selectedMode();
