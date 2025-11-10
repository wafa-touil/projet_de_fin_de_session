#!/usr/bin/env python3
"""
Script simple pour créer un fichier ZIP du projet QuizMaster
Usage: python create_export.py
"""

import zipfile
import os
from pathlib import Path

def create_zip():
    print("Création du fichier ZIP QuizMaster...")
    
    zip_filename = "QuizMaster_Export.zip"
    
    exclude_dirs = {
        '__pycache__', 'node_modules', '.git', 'venv', 'env',
        'dist', 'build', '.vscode', '.idea', 'staticfiles'
    }
    
    exclude_files = {
        '.pyc', '.pyo', '.pyd', '.so', '.dll', '.dylib',
        'db.sqlite3', '.DS_Store', 'Thumbs.db'
    }
    
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        base_path = Path('.')
        
        for root, dirs, files in os.walk(base_path):
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
            
            for file in files:
                if any(file.endswith(ext) for ext in exclude_files):
                    continue
                if file.startswith('.'):
                    continue
                    
                file_path = Path(root) / file
                arcname = file_path.relative_to(base_path)
                
                print(f"Ajout: {arcname}")
                zipf.write(file_path, arcname)
    
    print(f"\n✓ Fichier créé avec succès: {zip_filename}")
    print(f"Taille: {os.path.getsize(zip_filename) / 1024 / 1024:.2f} MB")
    print("\nVous pouvez maintenant télécharger ce fichier ZIP et l'utiliser ailleurs!")

if __name__ == "__main__":
    create_zip()
