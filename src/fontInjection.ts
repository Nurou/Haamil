const loadStylesheet = async () => {
  const pageId = window.location.pathname.split('/').filter(Boolean).pop();
  if (pageId) {
    try {
      await import(`./page-fonts/page${pageId}.css`);
      console.log(`Loaded page font for page ${pageId}`);
    } catch (error) {
      console.error(`Failed to load page font for page ${pageId}:`, error);
    }
  }
};

// Function to call loadStylesheet initially
const initialize = async () => {
  await loadStylesheet();
};

// Call initialize on page load
initialize();

// Event listener for popstate to detect URL changes
window.addEventListener('navigate', async () => {
  await loadStylesheet();
});
