const butInstall = document.getElementById('buttonInstall');
let deferredPrompt; // This will hold the event to trigger the installation process

// Logic for installing the PWA

// Capture the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent Chrome <= 67 from automatically showing the prompt
  event.preventDefault();

  // Store the event for later use
  deferredPrompt = event;

  // Show the install button or any other UI indication that
  // user can install the app
  butInstall.style.display = 'block';
});

// Handle the installation process
butInstall.addEventListener('click', async () => {
  // Hide our user interface that shows the install button
  butInstall.style.display = 'none';

  // Show the prompt to the user
  if (deferredPrompt) {
    deferredPrompt.prompt();

    // Check the user's response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    deferredPrompt = null;
  }
});

// Handle post-installation
window.addEventListener('appinstalled', (event) => {
  console.log('👍', 'appinstalled', event);

  // Optionally, hide the install button or provide other post-installation user feedback
  butInstall.style.display = 'none';
});
