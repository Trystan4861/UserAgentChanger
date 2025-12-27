# User-Agent Changer Extension - Flow Documentation

## 📋 Overview

This document describes the complete flow of the User-Agent Changer extension, detailing how each component interacts and the expected behavior at each stage.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
├──────────────────────────┬──────────────────────────────────────┤
│      popup.html          │         options.html                 │
│    (Quick Actions)       │    (Full Configuration)              │
└──────────┬───────────────┴────────────┬─────────────────────────┘
           │                            │
           └────────────┬───────────────┘
                        │
           ┌────────────▼────────────────┐
           │    Module Layer (js/)       │
           │  ┌──────────────────────┐   │
           │  │ i18n.js              │   │
           │  │ notify.js            │   │
           │  │ storage.js           │   │
           │  │ validations.js       │   │
           │  │ ua.js                │   │
           │  │ version.js           │   │
           │  │ messaging.js         │   │
           │  │ utils.js             │   │
           │  └──────────────────────┘   │
           └────────────┬────────────────┘
                        │
           ┌────────────▼────────────────┐
           │   background.js             │
           │   (Service Worker)          │
           └────────────┬────────────────┘
                        │
           ┌────────────▼────────────────┐
           │   Chrome APIs               │
           │  - storage                  │
           │  - webRequest               │
           │  - declarativeNetRequest    │
           │  - action (badge)           │
           └─────────────────────────────┘
```

---

## 🔄 Component Flow

### 1. Extension Initialization

```
Extension Loaded
    │
    ├─> background.js initializes
    │   ├─> Loads default user agents if first time
    │   ├─> Sets up webRequest listeners
    │   ├─> Sets up declarativeNetRequest rules
    │   ├─> Initializes badge
    │   └─> Listens for messages from UI
    │
    └─> Ready for user interaction
```

### 2. Popup Flow (popup.html)

```
User clicks extension icon
    │
    ├─> popup.html loads
    │   │
    │   ├─> Scripts load in order:
    │   │   1. i18n.js         → Initializes translations
    │   │   2. notify.js       → Notification system ready
    │   │   3. storage.js      → Storage functions ready
    │   │   4. validations.js  → Validation functions ready
    │   │   5. ua.js           → User agent utilities ready
    │   │   6. version.js      → Version management ready
    │   │   7. messaging.js    → Communication layer ready
    │   │   8. utils.js        → General utilities ready
    │   │   9. popup.js        → UI logic executes
    │   │
    │   ├─> popup.js initializes:
    │   │   ├─> Applies i18n translations
    │   │   ├─> Updates version display
    │   │   ├─> Loads user agents from storage
    │   │   ├─> Renders user agent list
    │   │   ├─> Highlights active user agent
    │   │   └─> Attaches event listeners
    │   │
    │   └─> User interacts:
    │       │
    │       ├─> Selects User Agent
    │       │   ├─> Validates selection
    │       │   ├─> Updates storage (setActiveId)
    │       │   ├─> Sends message to background
    │       │   │   └─> background.js updates headers
    │       │   ├─> Updates badge
    │       │   └─> Shows success notification
    │       │
    │       ├─> Clicks "Disable"
    │       │   ├─> Sets activeId to null
    │       │   ├─> Sends message to background
    │       │   │   └─> background.js removes headers
    │       │   ├─> Clears badge
    │       │   └─> Shows notification
    │       │
    │       └─> Clicks "Manage"
    │           └─> Opens options.html
```

### 3. Options Flow (options.html)

```
User opens options page
    │
    ├─> options.html loads
    │   │
    │   ├─> Scripts load in same order as popup
    │   │
    │   ├─> options.js initializes:
    │   │   ├─> Applies i18n translations
    │   │   ├─> Updates version display
    │   │   ├─> Loads user agents from storage
    │   │   ├─> Loads permanent spoofs from storage
    │   │   ├─> Renders all lists
    │   │   ├─> Sets up navigation menu
    │   │   └─> Attaches event listeners
    │   │
    │   └─> User interacts:
    │       │
    │       ├─> Section 1: Custom User-Agents
    │       │   │
    │       │   ├─> Add New User Agent
    │       │   │   ├─> Fills form fields
    │       │   │   ├─> Validates input (validations.js)
    │       │   │   ├─> Generates ID (ua.js)
    │       │   │   ├─> Creates user agent object
    │       │   │   ├─> Saves to storage (storage.js)
    │       │   │   ├─> Re-renders list
    │       │   │   └─> Shows success notification
    │       │   │
    │       │   ├─> Edit User Agent
    │       │   │   ├─> Loads data into form
    │       │   │   ├─> User modifies
    │       │   │   ├─> Validates changes
    │       │   │   ├─> Updates in storage
    │       │   │   ├─> Re-renders list
    │       │   │   └─> Shows notification
    │       │   │
    │       │   └─> Delete User Agent
    │       │       ├─> Confirms deletion
    │       │       ├─> Removes from storage
    │       │       ├─> Checks if was active
    │       │       │   └─> If yes, disables spoofing
    │       │       ├─> Re-renders list
    │       │       └─> Shows notification
    │       │
    │       ├─> Section 2: Permanent Spoof List
    │       │   │
    │       │   ├─> Add Permanent Spoof
    │       │   │   ├─> Selects domain pattern
    │       │   │   ├─> Validates domain (validations.js)
    │       │   │   ├─> Selects user agent
    │       │   │   ├─> Creates spoof object
    │       │   │   ├─> Saves to storage (storage.js)
    │       │   │   ├─> Sends message to background
    │       │   │   │   └─> background.js updates rules
    │       │   │   ├─> Re-renders list
    │       │   │   └─> Shows notification
    │       │   │
    │       │   └─> Delete Permanent Spoof
    │       │       ├─> Confirms deletion
    │       │       ├─> Removes from storage
    │       │       ├─> Sends message to background
    │       │       │   └─> background.js updates rules
    │       │       ├─> Re-renders list
    │       │       └─> Shows notification
    │       │
    │       ├─> Section 3: Import/Export
    │       │   │
    │       │   ├─> Import Settings
    │       │   │   ├─> User selects JSON file
    │       │   │   ├─> Validates JSON structure
    │       │   │   ├─> Shows preview
    │       │   │   ├─> User confirms import
    │       │   │   ├─> Merges with existing data
    │       │   │   ├─> Saves to storage (storage.js)
    │       │   │   ├─> Sends message to background
    │       │   │   │   └─> background.js updates all
    │       │   │   ├─> Re-renders all lists
    │       │   │   └─> Shows notification
    │       │   │
    │       │   └─> Export Settings
    │       │       ├─> Gathers all settings
    │       │       ├─> Creates JSON structure (storage.js)
    │       │       ├─> Generates filename with timestamp
    │       │       ├─> Triggers download
    │       │       └─> Shows notification
    │       │
    │       └─> Section 4: About
    │           └─> Displays extension information
```

### 4. Background Service Worker Flow

```
background.js (Service Worker)
    │
    ├─> On Install/Update
    │   ├─> Checks if first install
    │   ├─> Initializes default data
    │   └─> Sets up declarativeNetRequest rules
    │
    ├─> On Startup
    │   ├─> Loads active user agent
    │   ├─> Loads permanent spoofs
    │   ├─> Updates badge
    │   └─> Sets up listeners
    │
    ├─> Web Request Interception
    │   │
    │   ├─> Request is made
    │   │   │
    │   │   ├─> Check if permanent spoof matches domain
    │   │   │   ├─> Yes → Use specific UA for domain
    │   │   │   └─> No → Check global active UA
    │   │   │
    │   │   ├─> Get user agent configuration
    │   │   │   ├─> Mode: "replace" → Replace entire UA
    │   │   │   └─> Mode: "append" → Append to UA
    │   │   │
    │   │   └─> Modify request headers
    │   │       └─> Request continues with modified UA
    │   │
    │   └─> Request completes
    │
    ├─> Message Handling
    │   │
    │   ├─> "setActiveUserAgent"
    │   │   ├─> Updates active UA in memory
    │   │   ├─> Updates badge
    │   │   └─> Responds to sender
    │   │
    │   ├─> "disableUserAgent"
    │   │   ├─> Clears active UA
    │   │   ├─> Clears badge
    │   │   └─> Responds to sender
    │   │
    │   ├─> "updatePermanentSpoofs"
    │   │   ├─> Reloads permanent spoofs
    │   │   ├─> Updates declarativeNetRequest rules
    │   │   └─> Responds to sender
    │   │
    │   └─> "getBadgeInfo"
    │       ├─> Gets current active UA
    │       └─> Responds with badge data
    │
    └─> Badge Management
        ├─> Active UA: Shows alias with custom color
        ├─> No active UA: Clears badge
        └─> Updates on every change
```

---

## 📦 Module Responsibilities

### Core Data Modules

#### `storage.js`
**Purpose:** Centralized Chrome Storage management

**Functions:**
- `getStorage(key)` - Get value from storage
- `setStorage(key, value)` - Set value in storage
- `removeStorage(key)` - Remove value from storage
- `getUserAgents()` - Get all user agents
- `saveUserAgents(userAgents)` - Save user agents array
- `getActiveId()` - Get active user agent ID
- `setActiveId(id)` - Set active user agent ID
- `findUserAgentById(id)` - Find specific user agent
- `getActiveUserAgent()` - Get active user agent object
- `setActiveUserAgent(userAgent)` - Set active user agent
- `getPermanentSpoofs()` - Get permanent spoof list
- `savePermanentSpoofs(spoofs)` - Save spoof list
- `exportSettings()` - Export all settings to JSON
- `importSettings(data)` - Import settings from JSON

**Used by:** All UI components (popup.js, options.js)

---

#### `validations.js`
**Purpose:** Input validation and data integrity

**Functions:**
- `isValidUserAgent(ua)` - Validate UA string
- `validateUserAgent(uaObject)` - Validate UA object structure
- `isValidDomain(domain)` - Basic domain validation
- `validateDomain(domain)` - Extended domain validation with wildcards
- `isValidHexColor(color)` - Validate hex color code

**Used by:** options.js for form validation

---

### Utility Modules

#### `ua.js`
**Purpose:** User Agent specific utilities

**Functions:**
- `generateId()` - Generate unique ID for user agents

**Used by:** options.js when creating new user agents

---

#### `version.js`
**Purpose:** Extension version management

**Functions:**
- `getExtensionVersion()` - Get manifest version
- `updateVersionDisplay()` - Update version in UI

**Used by:** popup.js, options.js for version display

---

#### `messaging.js`
**Purpose:** Communication between UI and background

**Functions:**
- `sendMessageToBackground(message)` - Send message to service worker

**Used by:** popup.js, options.js for background communication

---

#### `utils.js`
**Purpose:** General utility functions

**Functions:**
- `deepClone(obj)` - Deep clone objects
- `debounce(func, wait)` - Debounce function calls

**Used by:** All components as needed

---

### UI Support Modules

#### `i18n.js`
**Purpose:** Internationalization support

**Functions:**
- Translates UI elements based on browser locale
- Supports `data-i18n` and `data-i18n-placeholder` attributes
- Falls back to English if translation missing

**Used by:** popup.js, options.js on initialization

---

#### `notify.js`
**Purpose:** User notifications

**Functions:**
- `showNotification(message, type)` - Show toast notification
- Supports types: success, error, warning, info

**Used by:** popup.js, options.js for user feedback

---

## 🔐 Storage Structure

### Chrome Storage Schema

```javascript
{
  // Array of custom user agents
  "userAgents": [
    {
      "id": "unique_id_123",
      "name": "iPhone 14 Pro",
      "alias": "iOS",
      "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0...)",
      "mode": "replace", // or "append"
      "badgeBgColor": "#1a73e8"
    }
    // ... more user agents
  ],
  
  // Currently active user agent ID
  "activeUserAgentId": "unique_id_123", // or null if disabled
  
  // Permanent domain-specific spoofs
  "permanentSpoofs": [
    {
      "domain": "example.com",
      "userAgentId": "unique_id_456"
    },
    {
      "domain": "*.github.com",
      "userAgentId": "unique_id_789"
    },
    {
      "domain": "localhost/api/*",
      "userAgentId": "unique_id_101"
    }
    // ... more spoofs
  ],
  
  // User preferences
  "language": "es", // or "en"
  
  // Extension settings
  "settings": {
    "enableNotifications": true,
    "debugMode": false
  }
}
```

---

## 🎯 Message Protocol

### Messages from UI → Background

```javascript
// Activate a user agent
{
  "action": "setActiveUserAgent",
  "userAgentId": "unique_id_123"
}

// Disable user agent spoofing
{
  "action": "disableUserAgent"
}

// Update permanent spoof rules
{
  "action": "updatePermanentSpoofs",
  "spoofs": [/* array of spoof objects */]
}

// Get current badge information
{
  "action": "getBadgeInfo"
}

// Reload extension (after import)
{
  "action": "reloadExtension"
}
```

### Responses from Background → UI

```javascript
// Success response
{
  "success": true,
  "data": { /* response data */ }
}

// Error response
{
  "success": false,
  "error": "Error message"
}
```

---

## 🔀 Data Flow Examples

### Example 1: User Activates a User Agent from Popup

```
1. User clicks on "iPhone 14 Pro" card in popup
   │
2. popup.js event handler triggered
   │
3. Validates selection
   │
4. storage.js → setActiveId("unique_id_123")
   │
5. messaging.js → sendMessageToBackground({
     action: "setActiveUserAgent",
     userAgentId: "unique_id_123"
   })
   │
6. background.js receives message
   │
7. background.js loads user agent data
   │
8. background.js updates webRequest listener
   │
9. background.js updates badge:
   - Text: "iOS"
   - Color: "#1a73e8"
   │
10. background.js sends response: { success: true }
    │
11. popup.js receives response
    │
12. notify.js → showNotification("User-Agent activated", "success")
    │
13. popup.js re-renders list (highlights active)
    │
14. User sees visual feedback
```

### Example 2: User Adds Permanent Spoof in Options

```
1. User fills form in options:
   - Domain: "github.com"
   - User Agent: "iPhone 14 Pro"
   │
2. User clicks "Add Permanent Spoof"
   │
3. options.js validates input
   - validations.js → validateDomain("github.com") ✓
   │
4. Creates spoof object:
   {
     domain: "github.com",
     userAgentId: "unique_id_123"
   }
   │
5. storage.js → getPermanentSpoofs()
   │
6. Adds new spoof to array
   │
7. storage.js → savePermanentSpoofs(updatedArray)
   │
8. messaging.js → sendMessageToBackground({
     action: "updatePermanentSpoofs",
     spoofs: updatedArray
   })
   │
9. background.js receives message
   │
10. background.js updates declarativeNetRequest rules:
    - Adds rule for "github.com" pattern
    - Maps to specific user agent
    │
11. background.js sends response: { success: true }
    │
12. options.js receives response
    │
13. notify.js → showNotification("Permanent spoof added", "success")
    │
14. options.js re-renders permanent spoofs list
    │
15. User sees updated list
```

### Example 3: User Imports Settings

```
1. User drags JSON file to import area
   │
2. options.js reads file
   │
3. Parses JSON
   │
4. validations.js validates structure:
   - Checks userAgents array
   - Validates each UA object
   - Checks permanentSpoofs array
   - Validates domain patterns
   │
5. Shows preview with summary:
   - X user agents to import
   - Y permanent spoofs to import
   │
6. User confirms import
   │
7. storage.js → importSettings(data)
   - Merges with existing data
   - Handles duplicates
   - Preserves active state if valid
   │
8. Saves to Chrome Storage
   │
9. messaging.js → sendMessageToBackground({
     action: "reloadExtension"
   })
   │
10. background.js reloads all data
    - Updates webRequest listeners
    - Updates declarativeNetRequest rules
    - Updates badge
    │
11. background.js sends response: { success: true }
    │
12. options.js receives response
    │
13. notify.js → showNotification("Settings imported successfully", "success")
    │
14. options.js re-renders all sections
    │
15. User sees all imported data
```

---

## 🚀 Initialization Sequence

### First-Time Installation

```
Extension installed
    │
    ├─> background.js detects first install
    │   │
    │   ├─> Initializes default user agents:
    │   │   [
    │   │     {
    │   │       id: "default_1",
    │   │       name: "iPhone 14 Pro",
    │   │       alias: "iOS",
    │   │       userAgent: "Mozilla/5.0...",
    │   │       mode: "replace",
    │   │       badgeBgColor: "#007AFF"
    │   │     },
    │   │     {
    │   │       id: "default_2",
    │   │       name: "Chrome Windows",
    │   │       alias: "WIN",
    │   │       userAgent: "Mozilla/5.0...",
    │   │       mode: "replace",
    │   │       badgeBgColor: "#4285F4"
    │   │     }
    │   │   ]
    │   │
    │   ├─> Saves to storage
    │   │
    │   ├─> Sets activeUserAgentId: null
    │   │
    │   ├─> Sets permanentSpoofs: []
    │   │
    │   ├─> Sets default language based on browser
    │   │
    │   └─> Extension ready
    │
    └─> User opens popup first time
        └─> Sees default user agents
```

### Subsequent Startups

```
Browser starts / Extension reloaded
    │
    ├─> background.js initializes
    │   │
    │   ├─> Loads activeUserAgentId from storage
    │   │
    │   ├─> Loads all user agents
    │   │
    │   ├─> Loads permanent spoofs
    │   │
    │   ├─> Sets up webRequest listeners
    │   │
    │   ├─> Configures declarativeNetRequest rules
    │   │
    │   ├─> Updates badge if active UA exists
    │   │
    │   └─> Listens for messages
    │
    └─> Extension ready
```

---

## 🎨 UI State Management

### Popup States

1. **No Active User Agent**
   - All UA cards normal appearance
   - No card highlighted
   - Badge shows default icon
   
2. **Active User Agent**
   - Selected card highlighted with border/background
   - Card shows "ACTIVE" indicator
   - Badge shows alias and custom color
   
3. **Loading State**
   - Shows loading indicator while fetching data
   - Prevents user interaction during load
   
4. **Error State**
   - Shows error message if data fails to load
   - Provides retry option

### Options States

1. **Form States**
   - **Empty**: Ready for new entry
   - **Editing**: Populated with existing data
   - **Validating**: Shows validation errors inline
   - **Submitting**: Disabled during save operation

2. **List States**
   - **Empty**: Shows "No items" message
   - **Populated**: Shows all items with actions
   - **Filtering**: Shows filtered results (future feature)

3. **Import/Export States**
   - **Ready**: Waiting for user action
   - **File Selected**: Shows preview
   - **Processing**: Shows progress indicator
   - **Complete**: Shows success/error message

---

## 🔧 Error Handling

### Storage Errors

```
Error occurs in Chrome Storage
    │
    ├─> storage.js catches error
    │
    ├─> Logs error to console
    │
    ├─> Returns default/empty value
    │
    └─> notify.js shows error notification
```

### Validation Errors

```
Invalid input detected
    │
    ├─> validations.js returns false
    │
    ├─> UI shows inline error message
    │
    ├─> Prevents form submission
    │
    └─> User corrects input
```

### Background Communication Errors

```
Message to background fails
    │
    ├─> messaging.js catches error
    │
    ├─> Returns rejected promise
    │
    ├─> Calling function handles error
    │
    └─> notify.js shows error notification
```

---

## 🔄 Update Scenarios

### User Agent Modified

```
User edits user agent in options
    │
    ├─> Updates in storage
    │
    ├─> If it's the active UA:
    │   ├─> Sends update to background
    │   └─> background.js reloads UA config
    │
    └─> Re-renders affected lists
```

### User Agent Deleted

```
User deletes user agent
    │
    ├─> Checks if it's active
    │   │
    │   ├─> If YES:
    │   │   ├─> Deactivates UA
    │   │   ├─> Updates background
    │   │   └─> Clears badge
    │   │
    │   └─> If NO:
    │       └─> Simply removes
    │
    ├─> Checks if used in permanent spoofs
    │   │
    │   └─> If YES:
    │       ├─> Shows warning
    │       ├─> User confirms
    │       └─> Removes related spoofs
    │
    ├─> Removes from storage
    │
    └─> Re-renders lists
```

---

## 📱 Platform Considerations

### Chrome/Edge
- Uses Manifest V3
- Uses declarativeNetRequest for permanent spoofs
- Uses chrome.storage.local for persistence
- Uses chrome.action for badge

### Firefox (Future Support)
- May need Manifest V2 compatibility
- Different badge API
- Different storage limits
- Different declarativeNetRequest support

---

## 🎯 Performance Considerations

### Storage Access
- Minimize storage reads/writes
- Cache frequently accessed data
- Use batch operations when possible

### Background Script
- Keep service worker lightweight
- Use event-driven architecture
- Avoid heavy computations
- Cache compiled rules for permanent spoofs

### UI Rendering
- Debounce expensive operations
- Use virtual scrolling for long lists (future)
- Optimize DOM manipulations
- Lazy load non-critical UI

---

## 🔮 Future Enhancements

### Planned Features
1. **User Agent Profiles**
   - Group related UAs
   - Quick profile switching
   
2. **Import from Browser**
   - Detect current browser UA
   - One-click add
   
3. **UA Rotation**
   - Automatically rotate through UAs
   - Time-based or request-based
   
4. **Statistics**
   - Track UA usage
   - Show request counts
   
5. **Sync Across Devices**
   - Chrome Sync integration
   - Backup to cloud
   
6. **Advanced Domain Matching**
   - Regular expressions
   - Path-specific rules
   - Query parameter matching

### Technical Improvements
1. **TypeScript Migration**
   - Type safety
   - Better IDE support
   
2. **Build System**
   - Minification
   - Code splitting
   - Asset optimization
   
3. **Testing**
   - Unit tests for modules
   - Integration tests for flows
   - E2E tests for UI
   
4. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

---

## 📝 Development Guidelines

### Adding New Features

1. **Plan the Flow**
   - Update this document first
   - Define data structures
   - Identify affected modules

2. **Implement Incrementally**
   - Start with storage structure
   - Add validation rules
   - Implement UI
   - Wire up background logic

3. **Test Thoroughly**
   - Test each module independently
   - Test integration points
   - Test error scenarios
   - Test edge cases

4. **Document Changes**
   - Update flow.md
   - Add inline comments
   - Update README if needed

### Code Organization

- **One responsibility per file**
- **Clear function names**
- **Consistent code style**
- **Meaningful comments**
- **Error handling everywhere**

### Debugging Tips

1. **Check Console Logs**
   - Each module logs when loaded
   - Look for initialization errors

2. **Inspect Storage**
   - Chrome DevTools → Application → Storage
   - Verify data structure

3. **Monitor Background**
   - chrome://extensions → Service Worker
   - Check background console

4. **Test Messages**
   - Log message send/receive
   - Verify response structure

---

## 🎓 Learning Resources

### Chrome Extension APIs
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Chrome Runtime API](https://developer.chrome.com/docs/extensions/reference/runtime/)
- [Chrome Action API](https://developer.chrome.com/docs/extensions/reference/action/)
- [Declarative Net Request](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/)

### Best Practices
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Extension Architecture](https://developer.chrome.com/docs/extensions/mv3/architecture-overview/)
- [Security Best Practices](https://developer.chrome.com/docs/extensions/mv3/security/)

---

## 📞 Support & Contribution

### Reporting Issues
- Describe expected behavior
- Describe actual behavior
- Provide reproduction steps
- Include console errors
- Mention browser version

### Contributing
- Follow existing code style
- Update documentation
- Test your changes
- Submit clear pull request

---

**Document Version:** 1.0.0  
**Last Updated:** 2024-12-27  
**Maintained By:** @trystan4861
