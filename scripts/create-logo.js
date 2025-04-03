const fs = require('fs');
const path = require('path');

// Ensure public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// SVG logo content with placeholders for style and path data
const svgStart = `<svg id="TC" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><defs><style>`;
const svgStyle = `.cls-1{fill:#030203;}.cls-10,.cls-11,.cls-2,.cls-4,.cls-5,.cls-6,.cls-7,.cls-8,.cls-9{fill:none;stroke-width:2px;}.cls-2{stroke:#0f7f5c;}.cls-3{fill:#030516;}.cls-4{stroke:#13dfcd;}.cls-5{stroke:#0dbcfa;}.cls-6{stroke:#0bdad8;}.cls-7{stroke:#0acdf6;}.cls-8{stroke:#0ae2d6;}.cls-9{stroke:#12e7cb;}.cls-10{stroke:#13f4ad;}.cls-11{stroke:#13a9fc;}.cls-12{fill:#1bf9a2;}.cls-13{fill:#16a0fd;}.cls-14{fill:#0befb7;}.cls-15{fill:#0ac5f8;}`;
const svgStyleEnd = `</style></defs>`;

// Path data in chunks to avoid token limit
const pathData = [
  `<path class="cls-1" d="M1024,0V1024H0V0Z"/>`,
  `<path class="cls-2" d="M843.61,466.18l-68,.24a.7.7,0,0,1-.69-.6,219.22,219.22,0,0,0-11.64-44.58A266.07,266.07,0,0,0,644,282.1a261.92,261.92,0,0,0-116.64-33,1,1,0,0,0-1,.92v36.07a1,1,0,0,0,1,1c49.4,1.32,97.1,20.69,135.08,52,43.18,35.64,71.73,86.25,78.49,141.94a.87.87,0,0,0,.87.77l96.83-.56"/>`,
  `<path class="cls-2" d="M843.25,501.51l-62.8.17a.47.47,0,0,0-.48.48h0v11.16a.54.54,0,0,0,.54.54h0l57.68-.14"/>`,
  `<path class="cls-2" d="M192,529.66l52.79-.07a.71.71,0,0,0,.72-.71h0V515.42a1,1,0,0,0-.95-.95h0q-25.36-.09-44.59-.05c-4.26,0-6,2-9.22,5.16-1.47,1.43-3.72,1.82-6.73,1.19"/>`
];

const svgEnd = `</svg>`;

// Combine the parts to create a simplified version of the logo
const simplifiedSvg = svgStart + svgStyle + svgStyleEnd + pathData.join('') + svgEnd;

// Write to file
fs.writeFileSync(path.join(publicDir, 'logo.svg'), simplifiedSvg);

console.log('Logo file created at public/logo.svg');

// Also create a README note
const readmeNote = `
# Logo Generation

A simplified version of the SONAR logo has been generated in public/logo.svg.
This is a basic representation only. For the full detailed logo, please replace 
it with the complete SVG content from the original source.
`;

fs.writeFileSync(path.join(__dirname, '../LOGO_GENERATED.md'), readmeNote);
console.log('Logo generation note created at LOGO_GENERATED.md'); 