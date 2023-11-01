let updateInterval;
      let count = 0;

      function generateUUID() {
        fetch('/api/generate')
            .then(response => response.json())
            .then(data => {
                document.getElementById('uuid').textContent = data.uuid;
                document.getElementById('uuid_validate').value = data.uuid;
            });
      }

      function validateUUIDv7() {
        // use contents of uuid label to validate
        let uuid = document.getElementById('uuid_validate').value;
        let resultElem = document.getElementById('validationResult'); // Reference to the result paragraph
    
        fetch('/api/validate/' + uuid)
            .then(response => response.json())
            .then(data => {
                if (data.valid) {
                    resultElem.textContent = 'UUIDv7 is valid with time: ' + data.timestamp;
                    resultElem.className = "valid";  // Set class to 'valid'
                } else {
                    resultElem.textContent = 'UUIDv7 is invalid!';
                    resultElem.className = "invalid";  // Set class to 'invalid'
                }
                resultElem.style.display = 'block';  // Show the result paragraph
            });
      }
      
      function toggleAutoUpdate() {
          if (document.getElementById('autoUpdate').checked) {
              // If checkbox is checked, start auto-updating
              startAutoUpdate();
              generateUUID();
          } else {
              // If checkbox is unchecked, clear the interval
              clearInterval(updateInterval);
          }
      }
      
      function startAutoUpdate() {
          // Ensure any pre-existing interval is cleared before starting a new one
          clearInterval(updateInterval);
          
          // Start the interval
          updateInterval = setInterval(function() {
              if (count >= 30) {
                  clearInterval(updateInterval);
                  document.getElementById('autoUpdate').checked = false;
              } else {
                  generateUUID();
                  count++;
              }
          }, 1000);
      }
      
      // Start auto-updating when the page loads, since the checkbox is checked by default
      window.onload = function() {
          generateUUID();
          // startAutoUpdate();
      };