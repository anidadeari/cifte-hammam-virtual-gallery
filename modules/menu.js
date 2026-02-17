export const hideMenu = () => {
  const menu = document.getElementById('menu');
  menu.style.display = 'none'; // Hide the menu
};

export const showMenu = () => {
  const menu = document.getElementById('menu');
  menu.style.display = 'block'; // Show the menu
};

// Lock the pointer (controls are activated) and hide the menu when the experience starts
export const startExperience = (controls) => {
  controls.lock(); // Lock the pointer (controls are activated)
  hideMenu();
};

export const setupPlayButton = (controls) => {
  const playButton = document.getElementById('play_button'); // Get the reference
  playButton.addEventListener('click', () => startExperience(controls)); // Add the click event listener to the play button to start the experience
};
export function setupInfoPanelToggle() {
  const panel = document.getElementById("info-panel");
  const btn = document.getElementById("toggle-info");

  if (!panel || !btn) return;

  let collapsed = false;

  btn.addEventListener("click", () => {
    collapsed = !collapsed;
    panel.classList.toggle("is-collapsed", collapsed);
    btn.textContent = collapsed ? "Show" : "Hide";
  });
}
