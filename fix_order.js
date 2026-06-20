/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

let code = fs.readFileSync('src/app/page.tsx', 'utf-8');

// The block we want to extract is from `  /* ── Go to world ── */` down to `/* ── Focus name on world 1 ── */`
const startSplit = `  /* ── Go to world ── */`;
const endSplit = `  /* ── Focus name on world 1 ── */`;

if (code.includes(startSplit) && code.includes(endSplit)) {
    const parts1 = code.split(startSplit);
    const parts2 = parts1[1].split(endSplit);
    
    const extracted = startSplit + parts2[0];
    
    // remove extracted from original place
    const remainingCode = parts1[0] + endSplit + parts2[1];
    
    // insert extracted before `  /* ── Worlds Array Logic ── */`
    const insertPoint = `  /* ── Worlds Array Logic ── */`;
    
    if (remainingCode.includes(insertPoint)) {
        const finalParts = remainingCode.split(insertPoint);
        const finalCode = finalParts[0] + extracted + "\n" + insertPoint + finalParts[1];
        fs.writeFileSync('src/app/page.tsx', finalCode);
        console.log("Fixed!");
    } else {
        console.log("Could not find insert point.");
    }
} else {
    console.log("Could not find splits.");
}
