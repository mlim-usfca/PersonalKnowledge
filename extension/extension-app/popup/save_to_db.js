export function getCurrentWindowTabURLs() {
  return new Promise((resolve, reject) => {
    browser.tabs.query({ active: true, currentWindow: true })
      .then((tabs) => {
        const tabURL = tabs[0] ? tabs[0].url : null;

        if (tabURL) {
          // Log the current tab URL
          console.log('Current tab URL:', tabURL);

          // Send the URL to the backend
          sendURLToBackend(tabURL)
            .then(() => {
              console.log('URL sent to backend successfully.');
              resolve(tabURL);
            })
            .catch((error) => {
              console.error('Error sending URL to backend:', error);
              reject(error);
            });
        } else {
          resolve([]);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Function to send URL to the backend
function sendURLToBackend(url) {
  const backendURL = 'https://your-backend-api.com/save-link';

  return fetch(backendURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ link: url }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
}
