/**
 * User Agent Changer - Background Script
 * Main entry point that imports all modules
 */

// Import all background modules
importScripts(
  'background-userAgent.js',
  'background-badge.js',
  'background-permanentSpoofs.js',
  'background-listeners.js'
);

console.log('User Agent Changer - Background script loaded');
