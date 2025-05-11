# Chrome Extension Text Input Example

This project is a simple Chrome extension that allows users to enter text into a text box and submit it to a specified API endpoint.

## Project Structure

```
chrome-extension
├── src
│   ├── background.js        # Background script for handling events and API calls
│   ├── content.js          # Content script for interacting with web pages
│   ├── popup
│   │   ├── popup.html      # HTML structure for the popup
│   │   ├── popup.js        # JavaScript logic for the popup
│   │   └── popup.css       # Styles for the popup
├── manifest.json           # Configuration file for the Chrome extension
└── README.md               # Documentation for the project
```

## Installation

1. Clone this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click on "Load unpacked" and select the `chrome-extension` directory.

## Usage

1. Click on the extension icon in the Chrome toolbar.
2. A popup will appear with a text box and a submit button.
3. Enter your text in the text box and click the submit button.
4. The text will be sent to the specified API endpoint via a POST request.

## API Endpoint

Make sure to specify the API endpoint in the `popup.js` file where the POST request is made. Adjust the endpoint URL as needed for your application.

## License

This project is licensed under the MIT License.