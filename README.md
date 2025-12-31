# User-Agent Changer - Chrome Extension

A professional Chrome extension that allows you to quickly and easily change your browser's User-Agent string. Perfect for web developers, testers, and users who need to emulate different browsers and devices.

**[README en español](README_ES.md)** | **[Changelog](CHANGELOG.md)** | **[License](LICENSE)**

## 🌟 Key Features

### 🎯 Quick User-Agent Switching
- **Intuitive popup interface**: Fast User-Agent switching with a single click
- **Global and per-tab modes**: 
  - **DEFAULT**: Use browser's original User-Agent
  - **AUTO**: Automatically detect and use the best User-Agent for each site
  - **Custom User-Agents**: Set specific User-Agents per tab
- **Visual badge system**: Shows the active User-Agent alias on the extension icon
  - No badge when DEFAULT is active
  - Custom badge for each User-Agent

### 🔧 Comprehensive Management Interface
Full-featured options page with multiple sections:

#### 1. **Custom User-Agents**
- Add unlimited custom User-Agents
- Two operation modes:
  - **Replace**: Completely replaces the browser's User-Agent
  - **Append**: Adds text to the current User-Agent
- Customizable badge with:
  - Alias (max 4 characters)
- Edit and delete custom User-Agents
- Pre-configured User-Agents included (iPhone 14, Android)

#### 2. **Permanent Spoof List**
- Set specific User-Agents for particular domains
- Supports wildcards: `*.example.com`, `localhost/core/*`
- Automatic application without manual intervention
- Manage your permanent spoofs list easily

#### 3. **Import/Export Settings**
- **Export**: Save all your settings to a JSON file
  - Custom User-Agents
  - Permanent Spoof List
  - Extension settings
  - Timestamped file names
- **Import**: Restore settings from a JSON file
  - Drag & drop support
  - Preview before importing
  - Merge or replace existing settings

#### 4. **About & Settings**
- Theme selector (Auto, Light, Dark)
- Language selector (English, Spanish)
- Extension information and version
- Reset functionality
- Support and contribution links

### 🛡️ Chrome Special Pages Protection
- Extension automatically disables on Chrome special pages
- Prevents modification of protected pages like:
  - `chrome://` (Chrome internal pages)
  - `chrome-extension://` (Extension pages)
  - `edge://` (Edge internal pages)
  - `about:` (About pages)
  - `view-source:` (Source view pages)
- Clear visual feedback with:
  - Gray badge with ✕ symbol
  - Disabled message in popup
  - Security explanation

### 🌍 Multi-language Support
- **English** (en)
- **Spanish** (es)
- Easy to add more languages via JSON locale files

### 🎨 Theme Support
- **Auto**: Follows system preference
- **Light**: Light theme
- **Dark**: Dark theme
- Consistent styling across all interfaces

## 📦 Installation

1. Download or clone this repository
2. Open Google Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top right corner)
4. Click **Load unpacked**
5. Select the `UserAgentChanger` project folder
6. Done! The extension icon will appear in your toolbar

## 🚀 Usage

### Quick User-Agent Change:
1. Click the extension icon in the toolbar
2. Select one of the options:
   - **DEFAULT**: Use browser's original User-Agent (global setting)
   - **AUTO**: Automatic User-Agent detection (global setting)
   - **Custom User-Agent**: Apply specific User-Agent to current tab
3. The badge will show the active User-Agent alias
4. Changes apply immediately

### Manage User-Agents:
1. Click the extension icon
2. Click **"⚙️ Manage User-Agents"** button
3. A new tab opens with the full management interface

#### Add Custom User-Agent:
1. Go to **"Custom User-Agents"** section
2. Fill in the form:
   - **Name**: Descriptive name (e.g., "iPhone 14 Pro")
   - **Alias**: Short identifier for badge (max 4 characters)
   - **Mode**: Choose "Replace" or "Append"
   - **User-Agent String**: Full User-Agent string
3. Click **"Add User-Agent"**

#### Configure Permanent Spoofs:
1. Go to **"Permanent Spoof List"** section
2. Enter the domain pattern (e.g., `*.google.com`, `localhost/*`)
3. Select the User-Agent to apply
4. Click **"Add Permanent Spoof"**
5. The spoof will apply automatically to matching domains

#### Import/Export Settings:
1. Go to **"Import/Export Settings"** section
2. **To Export**:
   - Click **"Click Here To Download"**
   - Save the JSON file with your settings
3. **To Import**:
   - Select a JSON file or drag & drop it
   - Preview the settings before importing
   - Choose to merge or replace existing settings
   - Confirm the import

## 📁 Project Structure

```
UserAgentChanger/
├── manifest.json                    # Extension configuration
├── popup.html                       # Popup HTML
├── options.html                     # Options page HTML
├── generate_icons.html              # Icon generator utility
├── README.md                        # This file (English)
├── README_ES.md                     # Spanish README
├── CHANGELOG.md                     # Version history
├── LICENSE                          # MIT License
├── LICENSE_ES.md                    # Spanish license
├── _locales/                        # Internationalization
│   ├── en/
│   │   └── messages.json           # English translations
│   └── es/
│       └── messages.json           # Spanish translations
├── css/                            # Stylesheets
│   ├── commons.css                 # Common styles
│   ├── popup.css                   # Popup styles
│   ├── theme.css                   # Theme variables
│   └── options/                    # Options page styles
│       ├── about.css
│       ├── cards.css
│       ├── forms.css
│       ├── header.css
│       ├── import-export.css
│       └── layout.css
├── icons/                          # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── icon256.png
│   └── logo.png
└── js/                             # JavaScript files
    ├── background.js               # Main background service worker
    ├── background-badge.js         # Badge management
    ├── background-listeners.js     # Event listeners
    ├── background-permanentSpoofs.js # Permanent spoofs logic
    ├── background-userAgent.js     # User-Agent application
    ├── popup.js                    # Popup logic
    ├── options.js                  # Options page logic
    ├── i18n.js                     # Internationalization
    ├── messaging.js                # Inter-component communication
    ├── notify.js                   # Notification system
    ├── storage.js                  # Storage utilities
    ├── ua.js                       # User-Agent utilities
    ├── utils.js                    # General utilities
    ├── validations.js              # Input validations
    └── version.js                  # Version management
```

## 🔧 Technologies Used

- **Manifest V3**: Latest Chrome extension system
- **declarativeNetRequest API**: For modifying HTTP request headers
- **Chrome Storage API**: For persisting configurations
- **Chrome Badge API**: For showing indicators on the icon
- **Chrome Tabs API**: For per-tab User-Agent management
- **HTML5/CSS3/JavaScript**: Modern and responsive interface
- **CSS Custom Properties**: Dynamic theming
- **Internationalization API**: Multi-language support

## ⚙️ Required Permissions

This extension requires the following permissions to function properly:

### Chrome API Permissions:

- **`declarativeNetRequest`**
  - **Purpose**: Allows the extension to modify HTTP request headers
  - **Why needed**: Essential for changing the User-Agent header in web requests. This API enables the extension to intercept and modify the User-Agent string before requests are sent to servers.

- **`activeTab`**
  - **Purpose**: Grants temporary access to the currently active tab when you interact with the extension
  - **Why needed**: Allows the extension to apply User-Agent changes to the tab you're currently viewing when you use the popup. This is a privacy-friendly permission that only works when you explicitly click the extension icon.
  - **Security benefit**: Unlike broad permissions, `activeTab` only grants access when you actively use the extension, ensuring maximum privacy and security.

- **`storage`**
  - **Purpose**: Provides access to Chrome's storage API
  - **Why needed**: Stores all extension configurations locally, including:
    - Custom User-Agent definitions
    - Permanent spoof list
    - User preferences (theme, language)
    - Badge colors and settings
    - Active User-Agent state per tab

- **`tabs`**
  - **Purpose**: Allows interaction with browser tabs
  - **Why needed**: Required for:
    - Detecting when tabs are created, updated, or removed
    - Managing per-tab User-Agent settings
    - Updating the badge on the extension icon for each tab
    - Opening the options page in a new tab
    - Detecting Chrome special pages to disable the extension

- **`scripting`**
  - **Purpose**: Provides access to Chrome's scripting API
  - **Why needed**: Enables advanced functionality for:
    - Dynamic content interaction if needed
    - Future feature enhancements
    - Improved compatibility with web pages

### Security & Privacy Notes:
- **Minimal permissions**: Uses `activeTab` instead of broad host permissions for enhanced privacy
- **Chrome Web Store compliant**: Follows best practices for extension permissions
- **Always up-to-date User-Agent**: Automatically uses the browser's current User-Agent (obtained from Service Worker) as the base, ensuring compatibility without hardcoded values
- **Local storage only**: All data is stored locally using Chrome's storage API
- **No external communication**: No data is transmitted to external servers
- **Header-only modification**: The extension only modifies User-Agent headers, not page content
- **Automatic protection**: Prevents modifications on Chrome special pages (`chrome://`, `edge://`, etc.)

## 💡 Use Cases

1. **Web Development**: Test how your site looks on different devices
2. **Testing**: Verify User-Agent-specific behavior
3. **Web Scraping**: Simulate different browsers or devices
4. **Privacy**: Modify your browser fingerprint
5. **Content Access**: Some sites show different content based on device
6. **Automation**: Set permanent spoofs for specific development environments
7. **API Testing**: Test API responses for different User-Agents

## 🛡️ Privacy & Security

- All data is stored locally in your browser
- No information is sent to external servers
- No browsing data is collected
- Open source and auditable
- Automatic protection on Chrome special pages
- Respects browser security restrictions

## 📝 Technical Notes

- User-Agent applies to all HTTP/HTTPS requests
- Changes are immediate without needing to reload tabs
- "Append" mode uses the current Chrome User-Agent as base
- DEFAULT mode shows no badge on icon
- Permanent spoofs take precedence over global settings
- Extension is disabled on Chrome special pages for security

## 🌐 Supported Browsers

- Google Chrome (Chromium-based browsers)
- Microsoft Edge
- Brave
- Opera
- Any Chromium-based browser supporting Manifest V3

## 👨‍💻 Author

**Trystan4861**
- GitHub: [@Trystan4861](https://github.com/Trystan4861)
- Repository: [UserAgentChanger](https://github.com/Trystan4861/UserAgentChanger)

## 🤝 Contributing

Contributions are welcome! If you find a bug or have a suggestion:

1. Open an issue on the [GitHub repository](https://github.com/Trystan4861/UserAgentChanger/issues)
2. If you want to contribute code, fork the repository and create a pull request
3. Follow the existing code style and conventions
4. Add appropriate tests for new features
5. Update documentation as needed

### Development Setup

1. Clone the repository
2. Make your changes
3. Test in Chrome by loading the unpacked extension
4. Submit a pull request with a clear description

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have problems or questions:
- Check that the extension is enabled in `chrome://extensions/`
- Verify you have sufficient permissions
- Check the extension's error console
- Review [closed issues](https://github.com/Trystan4861/UserAgentChanger/issues?q=is%3Aissue+is%3Aclosed) for similar problems
- Open a [new issue](https://github.com/Trystan4861/UserAgentChanger/issues/new) if needed

## 🎯 Roadmap

Future features under consideration:
- More pre-configured User-Agents
- User-Agent templates
- Statistics and usage tracking
- Cloud sync (optional)
- Browser detection improvements
- Additional language support
- Custom User-Agent rotation
- Advanced filtering options

---

Developed with ❤️ to facilitate web development and testing.

**Star ⭐ this repository if you find it useful!**
