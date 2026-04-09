const path = require('path');

// react-scripts is sensitive to Windows UNC-style current directories.
// Normalize to the project root before invoking the CRA build.
process.chdir(path.resolve(__dirname, '..'));

require('react-scripts/scripts/build');
