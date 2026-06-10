import os
import sys

def resolve_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    out_lines = []
    in_conflict = False
    in_head = False
    
    for line in lines:
        if line.startswith('<<<<<<< HEAD'):
            in_conflict = True
            in_head = True
            continue
        elif line.startswith('======='):
            in_head = False
            continue
        elif line.startswith('>>>>>>>'):
            in_conflict = False
            continue
            
        if not in_conflict:
            out_lines.append(line)
        elif in_head:
            out_lines.append(line)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(out_lines)

files = [
    'frontend/src/components/Navbar.tsx',
    'frontend/src/pages/AboutPage.tsx',
    'frontend/src/pages/LandingPage.tsx',
    'frontend/src/pages/WalletPage.tsx'
]

for file in files:
    resolve_file(file)
    print(f"Resolved {file}")
