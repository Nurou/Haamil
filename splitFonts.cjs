const path = require('path');
const fs = require('fs');

// Path to the fonts.css file
const fontsFilePath = path.join(__dirname, './public/fonts.css');

// Read the fonts.css file
fs.readFile(fontsFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the fonts.css file:', err);
    return;
  }

  // Regular expression to match @font-face rules
  const fontFaceRegex = /@font-face\s*{[^}]*}/g;

  // Extract all @font-face rules
  const fontFaceRules = data.match(fontFaceRegex);
  if (!fontFaceRules) {
    console.log('No @font-face rules found.');
    return;
  }

  // Create a directory for the output CSS files
  const outputDir = path.join(__dirname, 'output-fonts');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Process each @font-face rule
  fontFaceRules.forEach((rule, index) => {
    // Extract the font-family name
    const fontFamilyMatch = rule.match(/font-family:\s*'([^']+)'/);
    if (!fontFamilyMatch) {
      console.warn(`Skipping rule ${index + 1}: Could not find font-family name.`);
      return;
    }
    const fontFamily = fontFamilyMatch[1];

    // Create a new CSS file for each @font-face rule
    const outputFilePath = path.join(outputDir, `${fontFamily}.css`);
    fs.writeFile(outputFilePath, rule, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing to file ${outputFilePath}:`, err);
      } else {
        console.log(`Created ${outputFilePath}`);
      }
    });
  });
});
