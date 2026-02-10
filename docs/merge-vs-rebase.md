#docs/merge-vs-rebase.md

# Merge vs Rebase

## 1. Définition
### Merge
Fusionne deux historiques en créant un commit de merge (historique non-linéaire).

### Rebase
Rejoue les commits d’une branche au-dessus d’une autre (historique linéaire).

## 2. Avantages / Inconvénients

### Merge
**Avantages**
- Historique fidèle (trace exacte des branches et merges)
- Très sûr sur branches partagées

**Inconvénients**
- Historique plus “bruyant” (merge commits)

### Rebase
**Avantages**
- Historique linéaire, plus lisible
- Permet de nettoyer une branche feature avant PR

**Inconvénients**
- Réécrit l’historique (dangereux sur branches partagées)
- Peut compliquer la collaboration si mal utilisé

## 3. Quand utiliser quoi ?
- Merge : intégration dans `develop`/`main`, branches partagées
- Rebase : nettoyage local d’une branche feature avant PR

## 4. Proofs in Git History

### 4.1 Proof: Merge
pelagie@pelagie-HP-EliteBook-830-G6:~/projet_devops/devops-foundations$ git log --oneline --graph --decorate --max-count=15
* 86b0f4d (HEAD -> feature/rebase-demo) docs: add line 2 to rebase demo
* d10e8af docs: add line 1 to rebase demo
* 7118cc9 docs: add rebase demo file
*   23bd6b4 (origin/develop, develop) Merge pull request #1 from PELAGIE-AINTANGAR/feature/docs-baseline
|\  
| * d33660f (origin/feature/docs-baseline, feature/docs-baseline) docs: add merge vs rebase documentation
| * ad15074 chore: add env example template
| * 4ddf5a9 docs: add contributing guidelines
| * 8225cc6 chore: add env example template
| * 9fba040 chore: add gitignore
|/  
* 3bf8aef chore: initial commit

##Before rebase
pelagie@pelagie-HP-EliteBook-830-G6:~/projet_devops/devops-foundations$ git log --oneline --graph --decorate --all --max-count=30
*   23bd6b4 (HEAD -> develop, origin/develop) Merge pull request #1 from PELAGIE-AINTANGAR/feature/docs-baseline
|\  
| * d33660f (origin/feature/docs-baseline, feature/docs-baseline) docs: add merge vs rebase documentation
| * ad15074 chore: add env example template
| * 4ddf5a9 docs: add contributing guidelines
| * 8225cc6 chore: add env example template
| * 9fba040 chore: add gitignore
|/  
| * 514455b (main) test: try direct push2
| * be92667 (origin/main) test: try direct push
|/  
* 3bf8aef chore: initial commit
##after rebase
pelagie@pelagie-HP-EliteBook-830-G6:~/projet_devops/devops-foundations$ git log --oneline --graph --decorate --all --max-count=15
*   23bd6b4 (HEAD -> develop, origin/develop) Merge pull request #1 from PELAGIE-AINTANGAR/feature/docs-baseline
|\  
| * d33660f (origin/feature/docs-baseline, feature/docs-baseline) docs: add merge vs rebase documentation
| * ad15074 chore: add env example template
| * 4ddf5a9 docs: add contributing guidelines
| * 8225cc6 chore: add env example template
| * 9fba040 chore: add gitignore
|/  
| * 514455b (main) test: try direct push2
| * be92667 (origin/main) test: try direct push
|/  
* 3bf8aef chore: initial commit
## 5. Politique choisie pour ce projet

- **Merge commits** pour intégrer les branches `feature/*` vers `develop`
  afin de conserver une traçabilité claire des fonctionnalités.

- **Rebase autorisé uniquement en local** sur les branches `feature/*`
  avant l’ouverture d’une Pull Request.

- **Rebase strictement interdit** sur les branches partagées `develop`
  et `main` afin d’éviter toute réécriture de l’historique.
