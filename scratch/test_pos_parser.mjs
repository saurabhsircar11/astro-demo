import fs from 'fs';
import path from 'path';

// Read the docParser.ts file and extract the functions we want to test using eval
const docParserCode = fs.readFileSync(path.resolve('./apps/web-engine-project/src/utils/docParser.ts'), 'utf8');

// Strip out the imports and exports so we can evaluate it
const cleanCode = docParserCode
  .replace(/import .*;/g, '')
  .replace(/export async function .*?{.*?^}/ms, '')
  .replace(/export /g, '');

// A mock to simulate the parser environment
const mockEnv = `
  ${cleanCode}
  
  // Expose the parser to the script
  global.testParseTableBlock = parseTableBlock;
  global.testParseTextRun = parseTextRun;
  global.testOptimizeImages = function(obj) { return obj; } // Placeholder
`;

eval(mockEnv);

console.log("=== Testing parseTextRun (CTA Mapping) ===");
const boldLink = {
  content: "Primary Button",
  textStyle: {
    bold: true,
    link: { url: "https://example.com" }
  }
};
console.log("Bold Link Output:", global.testParseTextRun(boldLink));

const italicLink = {
  content: "Secondary Button",
  textStyle: {
    italic: true,
    link: { url: "https://example.com" }
  }
};
console.log("Italic Link Output:", global.testParseTextRun(italicLink));

console.log("\n=== Testing parseTableBlock (Positional) ===");
const mockTable = {
  tableRows: [
    {
      tableCells: [
        {
          content: [
            {
              paragraph: {
                elements: [{ textRun: { content: "hero-marquee (m-lockup)" } }]
              }
            }
          ]
        }
      ]
    },
    {
      tableCells: [
        {
          content: [
            {
              paragraph: {
                elements: [
                  { textRun: { content: "Left Side Content" } },
                ]
              }
            }
          ]
        },
        {
          content: [
            {
              paragraph: {
                elements: [
                  { textRun: { content: "Right Side Content (Image)" } },
                ]
              }
            }
          ]
        }
      ]
    }
  ]
};

const block = global.testParseTableBlock(mockTable, {});
console.log("Parsed Block Type:", block.type);
console.log("Parsed Block Variants:", block.data.variants);
console.log("Parsed cell_0_0:", block.data.cell_0_0);
console.log("Parsed cell_0_1:", block.data.cell_0_1);

// Test [...slug].astro optimization logic
console.log("\n=== Testing Image Optimization ===");
const astroCode = fs.readFileSync(path.resolve('./apps/web-engine-project/src/pages/[...slug].astro'), 'utf8');

// Extract just the optimizeImageUrl, generateSrcset, getOptimizationConfig, optimizeImagesInObject
const astroExtract = astroCode.match(/const IMAGE_OPTIMIZER_URL.*?(?=\/\/ 1\. Fetch Page Content AST)/s)[0];

const astroMockEnv = `
  const process = { env: {} };
  ${astroExtract}
  global.testOptimizeImagesInObject = optimizeImagesInObject;
`;

eval(astroMockEnv);

const testHtml = '<img src="https://example.com/test.jpg" alt="test" />';
console.log("Optimizing HTML string:", testHtml);
console.log("Optimized Output:", global.testOptimizeImagesInObject(testHtml));

console.log("\nAll tests ran.");
