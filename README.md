# ENV Mask

Extension VS Code minimaliste pour masquer visuellement les valeurs dans les fichiers `.env`.

## Fonctionnalités

- **Masquage automatique** : Toutes les valeurs `KEY=value` sont remplacées visuellement par `••••••`
- **Démasquage intelligent** : La ligne active (où se trouve le curseur) reste visible
- **Toggle rapide** : `Cmd/Ctrl+Shift+P` → "ENV Mask: Toggle Masking"
- **Configuration** :
  - `envMask.enabled` : Activer/désactiver le masquage (défaut: `true`)
  - `envMask.unmaskActiveLine` : Démasquer la ligne du curseur (défaut: `true`)

## Usage

1. Ouvrir un fichier `.env`
2. Les valeurs sont automatiquement masquées
3. Positionner le curseur sur une ligne pour voir sa valeur
4. Toggle via commande si besoin

## Développement

```bash
npm install
npm run build       # Build une fois
npm run watch       # Build en continu
```

Debug : `F5` dans VS Code

## Architecture

**1 seul fichier de logique** (`src/extension.ts`) :
- Regex `/^([A-Z_][A-Z0-9_]*)=(.+)$/gm` pour détecter les variables
- API `TextEditorDecorationType` pour masquage visuel
- 3 hooks : changement d'éditeur, de document, de sélection

**Aucune modification fichier** : tout est visuel via l'API de décoration VS Code.
