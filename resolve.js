const fs = require('fs');

const files = [
    'frontend/src/components/Navbar.tsx',
    'frontend/src/pages/AboutPage.tsx',
    'frontend/src/pages/LandingPage.tsx',
    'frontend/src/pages/WalletPage.tsx'
];

files.forEach(filepath => {
    const lines = fs.readFileSync(filepath, 'utf8').split('\n');
    const out_lines = [];
    let in_conflict = false;
    let in_head = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('<<<<<<< HEAD')) {
            in_conflict = true;
            in_head = true;
            continue;
        } else if (line.startsWith('=======')) {
            in_head = false;
            continue;
        } else if (line.startsWith('>>>>>>>')) {
            in_conflict = false;
            continue;
        }

        if (!in_conflict) {
            out_lines.push(line);
        } else if (in_head) {
            out_lines.push(line);
        }
    }

    fs.writeFileSync(filepath, out_lines.join('\n'), 'utf8');
    console.log(`Resolved ${filepath}`);
});
