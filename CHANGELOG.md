# Changelog

All notable changes to the User-Agent Changer extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-01-01

### Changed
- **Remove the `view-source` protocol** from special pages where the extension must be disabled

## [1.0.2] - 2025-12-31

### Changed
- **Migrated to `activeTab` permission** for better Chrome Web Store compliance
  - Removed `host_permissions: ["<all_urls>"]` 
  - Removed `declarativeNetRequestWithHostAccess` permission
  - Added `activeTab` permission (safer and more privacy-friendly)
- **Improved User-Agent detection**
  - Now uses Service Worker's `navigator.userAgent` directly
  - No hardcoded User-Agent strings that could become outdated
  - Automatically updates with browser version changes
  - Cached in session storage for performance

### Technical
- User-Agent is now obtained from the Service Worker context (always available, no permissions needed)
- Switched from `chrome.storage.local` to `chrome.storage.session` for UA caching
- Extension initializes User-Agent automatically on startup
- All functionality remains intact: manual UA per tab, permanent spoofs, AUTO mode, etc.

### Security & Privacy
- Reduced permissions for better user privacy
- Extension now only accesses active tabs when user interacts with it
- Faster Chrome Web Store approval process with minimal permissions
- Improved user trust with more transparent permission model

## [1.0.1] - 2025-12-31

### Added
- New i18n messages for permanent spoof management:
  - Success message when adding permanent spoof
  - Confirmation dialog for deleting permanent spoof
  - Success message when deleting permanent spoof
  - Error message when domain already has a spoof configured
  - Message when no permanent spoofs are configured

### Changed
- Updated export section UI text formatting (removed bullet points)
- Improved button focus styles with visible outline for better accessibility
- Refactored options.html structure for better maintainability
- Enhanced notification messaging system

### Fixed
- Button focus outline visibility for improved accessibility
- Export section list formatting for cleaner UI presentation

### Removed
- Unused CSS rules in import-export.css

## [1.0.0] - 2025-12-29

### Added
- Initial release of User-Agent Changer extension
- Quick User-Agent switching with popup interface
- Two operation modes for User-Agents:
  - **Replace mode**: Completely replaces the browser's User-Agent
  - **Append mode**: Adds text to the current User-Agent
- Global User-Agent modes:
  - **DEFAULT**: Uses browser's original User-Agent
  - **AUTO**: Automatic User-Agent detection based on site
- Per-tab User-Agent management
- Custom badge system with configurable alias (max 4 characters)
- Visual feedback: No badge shown when DEFAULT mode is active
- Comprehensive options page with four main sections:
  1. Custom User-Agents management
  2. Permanent Spoof List with wildcard support
  3. Import/Export settings functionality
  4. About & Settings (theme, language, version info)
- Pre-configured User-Agents (iPhone 14, Android)
- Multi-language support:
  - English (en)
  - Spanish (es)
- Theme support:
  - Auto (follows system preference)
  - Light theme
  - Dark theme
- Protection for Chrome special pages:
  - Extension automatically disables on `chrome://`, `edge://`, `about:`, `view-source:`, and `chrome-extension://` pages
  - Red badge with ✕ symbol on special pages
  - Clear security messaging in popup
- Import/Export functionality:
  - Export all settings to timestamped JSON file
  - Import settings with drag & drop support
  - Preview before importing
  - Option to merge or replace existing settings
- Permanent Spoof List:
  - Domain pattern matching with wildcards
  - Automatic User-Agent application for matched domains
  - Easy management interface
- Real-time badge updates
- Immediate User-Agent changes without page reload

### Technical
- Built with Manifest V3
- Uses declarativeNetRequest API for header modification
- Chrome Storage API for local configuration persistence
- Chrome Tabs API for per-tab management
- Chrome Badge API for icon indicators
- Internationalization support via Chrome i18n API
- CSS Custom Properties for dynamic theming
- Modular JavaScript architecture:
  - Separate background service worker components
  - Dedicated modules for badge, listeners, permanent spoofs, and User-Agent logic
  - Utility modules for storage, messaging, notifications, and validations

### Security
- All data stored locally in browser
- No external server communication
- No browsing data collection
- Open source and auditable
- Automatic protection on browser special pages
- Respects browser security restrictions

---

## Version Format

- **[Major.Minor.Patch]** - YYYY-MM-DD
- **Major**: Incompatible API changes
- **Minor**: New features (backwards compatible)
- **Patch**: Bug fixes (backwards compatible)

## Links

- [Repository](https://github.com/Trystan4861/UserAgentChanger)
- [Issues](https://github.com/Trystan4861/UserAgentChanger/issues)
- [Releases](https://github.com/Trystan4861/UserAgentChanger/releases)
