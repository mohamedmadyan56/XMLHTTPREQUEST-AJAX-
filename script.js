/**
 * ========================================
 * AJAX Event Listener - Learning Module
 * ========================================
 * 
 * This file demonstrates how to work with AJAX using XMLHttpRequest
 * to handle HTTP requests and responses with event listeners.
 * 
 * Topics Covered:
 * - XMLHttpRequest Object Creation
 * - HTTP Methods (GET, POST)
 * - Event Listeners (load, error, readystatechange)
 * - Response Parsing (JSON)
 * - Request States (readyState property)
 */

// ========================================
// 1. XMLHTTPREQUEST BASICS
// ========================================

/**
 * Create a new XMLHttpRequest instance
 * This object contains all methods and properties needed to make HTTP requests
 * Methods: open(), send(), addEventListener()
 * Properties: readyState, status, response, responseText
 */
const myHttp = new XMLHttpRequest();

// ========================================
// 2. UNDERSTANDING REQUEST STATES (readyState)
// ========================================

/**
 * readyState Values:
 * 0 - UNSENT: Request not initialized
 * 1 - OPENED: Connection established (after open() called)
 * 2 - HEADERS_RECEIVED: Request received (headers available)
 * 3 - LOADING: Request processing (data being downloaded)
 * 4 - DONE: Response is complete and ready to use
 */

// Note: You cannot manually set readyState. It updates automatically.
// These are just for reference:
const readyStates = {
  UNSENT: 0,              // Request not initialized
  OPENED: 1,              // Connection established
  HEADERS_RECEIVED: 2,    // Request received
  LOADING: 3,             // Request processing
  DONE: 4                 // Response ready
};

// ========================================
// 3. BASIC AJAX REQUEST EXAMPLE
// ========================================

/**
 * Step 1: Configure the request
 * Parameters:
 * - method: 'GET' or 'POST' etc.
 * - url: API endpoint
 * - async: true (default) for asynchronous requests
 */
myHttp.open('GET', 'https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza');

/**
 * Step 2: Send the request
 * For GET requests, send() takes no parameters
 * For POST requests, you pass data: send(JSON.stringify(data))
 */
myHttp.send();

// ========================================
// 4. EVENT LISTENERS - HANDLING RESPONSES
// ========================================

/**
 * Method 1: addEventListener('load', callback)
 * Triggered when response is successfully loaded (best practice for modern code)
 * More reliable than 'readystatechange'
 */
myHttp.addEventListener('load', function() {
  // Check for successful response (status 200-299)
  if (myHttp.status >= 200 && myHttp.status < 300) {
    try {
      // Parse JSON response
      const responseData = JSON.parse(myHttp.response);
      console.log('✓ Data loaded successfully:', responseData);
      
      // Process data here
      handleSuccess(responseData);
      
    } catch (error) {
      console.error('❌ Error parsing JSON:', error);
    }
  } else {
    console.error('❌ Server error - Status:', myHttp.status);
  }
});

/**
 * Method 2: addEventListener('readystatechange', callback)
 * Triggered every time readyState changes
 * More control but requires checking state
 */
myHttp.addEventListener('readystatechange', function() {
  // Only process when state is DONE (4)
  if (myHttp.readyState === 4) {
    console.log('Request completed - Status:', myHttp.status);
    
    // Check if response is successful
    if (myHttp.status === 200) {
      console.log('Response data:', myHttp.response);
    }
  }
  
  // You can also monitor other states
  if (myHttp.readyState === 3) {
    console.log('Loading data...');
  }
});

/**
 * Method 3: addEventListener('error', callback)
 * Triggered when network error occurs (not HTTP errors)
 * Examples: No internet, server unreachable, CORS issues
 */
myHttp.addEventListener('error', function() {
  console.error('❌ Network Error - Could not reach server');
  alert('Error in loading data from server. Check your internet connection.');
});

/**
 * Method 4: addEventListener('abort', callback)
 * Triggered when request is aborted
 */
myHttp.addEventListener('abort', function() {
  console.error('❌ Request was aborted');
});

// ========================================
// 5. HELPER FUNCTIONS
// ========================================

/**
 * Function: handleSuccess(data)
 * Description: Process successful API response
 * Parameter: data - parsed JSON response object
 */
function handleSuccess(data) {
  console.log('Total recipes found:', data.results.length);
  
  // Example: Loop through results
  data.results.forEach((recipe, index) => {
    console.log(`Recipe ${index + 1}:`, recipe.title);
  });
}

/**
 * Function: fetchData(url, method)
 * Description: Reusable function to fetch data from any API
 * Parameters: 
 * - url: API endpoint
 * - method: HTTP method (default: 'GET')
 * Returns: Promise for better chaining
 */
function fetchData(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    
    request.open(method, url);
    
    // Success handler
    request.addEventListener('load', function() {
      if (this.status >= 200 && this.status < 300) {
        try {
          const data = JSON.parse(this.response);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON response'));
        }
      } else {
        reject(new Error(`HTTP Error: ${this.status}`));
      }
    });
    
    // Error handler
    request.addEventListener('error', function() {
      reject(new Error('Network error'));
    });
    
    request.send();
  });
}

/**
 * Function: postData(url, data)
 * Description: Send POST request with data
 * Parameters:
 * - url: API endpoint
 * - data: object to send
 */
function postData(url, data) {
  const request = new XMLHttpRequest();
  
  request.open('POST', url);
  request.setRequestHeader('Content-Type', 'application/json');
  
  request.addEventListener('load', function() {
    console.log('POST Response:', this.response);
  });
  
  request.addEventListener('error', function() {
    console.error('POST Request failed');
  });
  
  request.send(JSON.stringify(data));
}

// ========================================
// 6. HOW TO USE - EXAMPLES
// ========================================

/**
 * Example 1: Using fetchData function
 * fetchData('https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza')
 *   .then(data => {
 *     console.log('Recipes:', data.results);
 *   })
 *   .catch(error => {
 *     console.error('Failed to fetch:', error.message);
 *   });
 */

/**
 * Example 2: Using postData function
 * postData('https://api.example.com/data', { name: 'Ahmed', age: 25 });
 */

// ========================================
// 7. COMMON ISSUES & SOLUTIONS
// ========================================

/**
 * Issue 1: CORS Error
 * Cause: Browser blocks cross-domain requests
 * Solution: Use a CORS proxy or make requests to same domain
 * 
 * Issue 2: JSON Parse Error
 * Cause: Response is not valid JSON
 * Solution: Check response format, use responseText for non-JSON
 * 
 * Issue 3: Slow Response
 * Cause: Large data transfer or slow server
 * Solution: Add timeout, show loading indicator
 * 
 * Issue 4: Request not sending
 * Cause: Missing send() call or invalid URL
 * Solution: Always call send(), verify URL is correct
 */

// ========================================
// END OF MODULE
// ================================= ======