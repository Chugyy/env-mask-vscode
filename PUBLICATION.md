# Guide de publication ENV Mask

## Statut actuel
✅ Git initialisé et commit initial créé
✅ Métadonnées ajoutées au package.json
✅ LICENSE MIT ajoutée
✅ .gitignore et .vscodeignore configurés

## Prochaines étapes

### 1. Créer le repository GitHub

```bash
# Option A : Via GitHub CLI (si installé)
gh repo create env-mask-vscode --public --source=. --remote=origin --push

# Option B : Manuellement
# 1. Va sur https://github.com/new
# 2. Nom du repo : env-mask-vscode
# 3. Description : "VS Code extension to visually mask .env file values"
# 4. Public
# 5. NE PAS initialiser avec README (on a déjà les fichiers)
# 6. Clique "Create repository"
# 7. Puis exécute :

git remote add origin https://github.com/hugohoarau/env-mask-vscode.git
git branch -M main
git push -u origin main
```

### 2. Ajouter l'icône

Ajoute un fichier `icon.png` (128x128px minimum) à la racine du projet, puis :

```bash
git add icon.png
git commit -m "Add extension icon"
git push
```

Si pas d'icône, retire la ligne dans package.json :
```bash
# Supprimer la ligne 11 : "icon": "icon.png",
```

### 3. Créer un Publisher sur Azure DevOps

1. Va sur https://marketplace.visualstudio.com/manage
2. Clique "Create Publisher"
3. Remplis :
   - **Publisher ID** : `hugohoarau` (ou ton choix, doit être unique)
   - **Display name** : Hugo Hoarau
   - **Description** : Extensions VS Code minimalistes
4. Clique "Create"
5. Note ton Publisher ID

### 4. Générer un Personal Access Token (PAT)

1. Va sur https://dev.azure.com
2. Clique sur ton profil (en haut à droite) > "Personal Access Tokens"
3. Clique "+ New Token"
4. Configure :
   - **Name** : `vsce-marketplace`
   - **Organization** : **All accessible organizations** (important !)
   - **Expiration** : 90 jours (ou Custom)
   - **Scopes** : Coche "Marketplace" > **Manage**
5. Clique "Create"
6. **COPIE LE TOKEN** (tu ne le reverras plus !)

### 5. Publier l'extension

```bash
# Connexion avec ton Publisher ID
vsce login hugohoarau
# Colle le PAT quand demandé

# Vérifier que tout est OK
vsce package

# Publier sur le Marketplace
vsce publish
```

### 6. Vérification

Une fois publié, l'extension sera disponible sur :
- https://marketplace.visualstudio.com/items?itemName=hugohoarau.env-mask
- Dans VS Code : Extensions > Rechercher "ENV Mask"

### 7. Mises à jour futures

```bash
# Modifier le code...
git add .
git commit -m "Description des changements"
git push

# Publier une nouvelle version
vsce publish patch    # 0.0.1 -> 0.0.2
# ou
vsce publish minor    # 0.0.1 -> 0.1.0
# ou
vsce publish major    # 0.0.1 -> 1.0.0
```

---

## Troubleshooting

### Erreur "Publisher not found"
- Vérifie que le `publisher` dans package.json correspond exactement à ton Publisher ID Azure

### Erreur PAT invalide
- Le token doit avoir le scope "Marketplace (Manage)"
- L'organization doit être "All accessible organizations"

### Erreur "Missing icon"
- Ajoute `icon.png` 128x128px ou retire la ligne du package.json

### Erreur repository
- Vérifie que le repo GitHub existe et est accessible publiquement
