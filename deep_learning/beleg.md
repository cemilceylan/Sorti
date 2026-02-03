# Beleg: Automatisierte Müllklassifizierung mit Convolutional Neural Networks (Sorti)

**Kurs:** ProgData WS25 (Intro to Deep Learning / Computer Vision)  
**Autor:** [Dein Name]  
**Datum:** 2. Februar 2026  

---

## 1. Einleitung & Motivation
In der modernen Kreislaufwirtschaft ist die effiziente Trennung von Abfällen eine der größten technologischen Herausforderungen. Manuelle Sortierung ist zeitaufwendig und fehleranfällig. Das Projekt "Sorti" zielt darauf ab, ein tiefes neuronales Netz (CNN) zu entwickeln, das Bilder von Abfällen autonom in neun Kategorien (z. B. Metall, Glas, Bio-Müll) klassifiziert. Die besondere Schwierigkeit liegt in der hohen Varianz der Objekte: Eine zerknitterte Cola-Dose sieht visuell völlig anders aus als eine neue, behält aber ihre chemische Klassifizierung bei. Ziel ist es, ein Modell zu entwickeln, das robuste Merkmale lernt, anstatt sich auf bloße Pixelmuster zu verlassen.

## 2. Stand der Technik
Traditionelle Computer-Vision-Ansätze basierten oft auf manuell entwickelten Filtern für Kanten oder Farben. Moderne Deep-Learning-Verfahren, insbesondere Convolutional Neural Networks (CNNs), automatisieren diesen Prozess. Durch die Verwendung von Faltungsschichten (Convolutional Layers) lernt das System eine Hierarchie von Merkmalen: von einfachen Kanten in den ersten Schichten bis hin zu komplexen Formen (wie dem Flaschenhals oder der Textur von Karton) in tieferen Schichten.

## 3. Methodik: Der experimentelle Ansatz
Um die beste Architektur zu finden, wurde ein iterativer 3-Stufen-Plan (3-Act Structure) verfolgt:
*   **Phase 1 (Baseline):** Ein einfaches Modell zur Identifikation des Overfitting-Problems.
*   **Phase 2 (Regularisierung):** Einsatz von Data Augmentation und Dropout zur Verbesserung der Generalisierung.
*   **Phase 3 (Champion):** Skalierung der Netzwerktiefe und Stabilisierung durch Batch Normalization, um die maximale Genauigkeit zu erreichen.

## 4. Implementierung & Systemaufbau
Das System wurde in **Python** unter Verwendung von **TensorFlow/Keras** implementiert.
*   **Datensatz:** 128x128 Pixel Auflösung, 9 Klassen.
*   **Architektur:** Ein 5-Block-CNN. Jeder Block besteht aus einer `Conv2D`-Schicht mit integrierter **L2-Kernel-Regularisierung** (zur Vermeidung von Gewichts-Explosionen), gefolgt von **BatchNormalization** zur Stabilisierung des Gradientenflusses, `ReLU`-Aktivierung und `MaxPooling`.
*   **Regularisierung:** Kombination aus räumlicher Regularisierung (`RandomFlip`, `RandomRotation`, `RandomZoom`), struktureller Regularisierung (`Dropout(0.5)`) und Gewichtungs-Regularisierung (**L2-Penalty**).
*   **Optimierung:** Verwendung des Adam-Optimierers mit einer lernratenabhängigen Reduzierung (`ReduceLROnPlateau`), um das globale Minimum der Loss-Function präzise zu erreichen.

## 5. Durchführung & Ergebnisse
Die Experimente wurden in fünf Phasen (Runs) unterteilt, um die Auswirkungen spezifischer Optimierungen zu isolieren.

*   **Run 1 (Baseline):** Das Modell erreichte schnell ~99% Trainingsgenauigkeit, stagnierte aber bei **~73% Validierungsgenauigkeit**.
    *   *Diagnose:* Massives Overfitting ("Arroganz"). Das Modell lernte Pixelmuster auswendig, keine Merkmale.
*   **Run 2 (Regularisierung):** Mit Data Augmentation und Dropout sank die Genauigkeit auf **~68%**, aber der Spalt zwischen Training und Validierung schloss sich fast vollständig.
    *   *Diagnose:* Das "Ehrliche" Modell. Die geringe Genauigkeit zeigte das Kapazitätslimit der 3-Block-Architektur auf.
*   **Run 3 (Scale):** Die Skalierung auf 5 Blöcke (512 Filter) brachte den Durchbruch auf **~87% Peak Accuracy**, jedoch mit instabilen Loss-Kurven ("Zittern").
    *   *Diagnose:* Kapazitätsproblem gelöst, aber Stabilitätsprobleme am Ende des Trainings.
*   **Run 4 (Optimization):** Der Wechsel zu **ELU-Aktivierung** und **He-Normal-Initialisierung** stabilisierte das Training signifikant und erzielte solide **~85%**.
    *   *Diagnose:* "Scientific Climax". Mathematische Optimierung statt purer Masse.
*   **Run 5 (Stability):** Erhöhung der Auflösung auf 180x180 und Einsatz von `ReduceLROnPlateau`.
    *   *Ergebnis:* Robusteste Generalisierung mit **81% Test-Genauigkeit** über alle Klassen.

### 5.1 Fehleranalyse (Confusion Matrix)
Die detaillierte Analyse der Testdaten offenbart die Evolution der Modell-Intelligenz:
*   **Frühe Probleme (Run 1-3):** Massive Probleme bei **Metall** und **Schuhen** (Recall oft < 40%). Das Modell ignorierte diese Minderheitenklassen zugunsten von einfachen Klassen wie Kleidung.
*   **Der Durchbruch (Run 5):** Run 5 ist das einzige Modell, das eine ausgeglichene Performance zeigt.
    *   **Biological:** 97% Precision (nahezu perfekt).
    *   **Battery:** 96% Precision.
    *   **Schwachstelle:** Die Unterscheidung zwischen **Plastik** und **Metall** bleibt aufgrund ähnlicher Oberflächenreflexionen die größte Herausforderung.

## 6. Zusammenfassung & Fazit
Das Projekt "Sorti" demonstriert erfolgreich den Weg vom "naiven" Skript zum robusten Deep-Learning-Modell.
*   **Haupterkenntnis:** Kapazität (Tiefe) ist notwendig, aber ohne mathematische Stabilisierung (Batch Norm, He-Init) und dynamische Lernratenanpassung nicht kontrollierbar.
*   **Finales Modell:** Run 4 stellt das "wissenschaftliche Optimum" dar (beste Validierungsmetriken), während Run 5 das "praxistauglichste" Modell ist (beste Test-Generalisierung).

## 7. Gliederung der Verteidigung (Narrativer Bogen)
**Leitmotiv:** "Vom Scheitern zum Verstehen - Eine Evolution in 5 Akten."

*   **Akt 1: Die Arroganz (Run 1)**
    *   Problem: Overfitting.
    *   Learning: Wir brauchen Regularisierung.
*   **Akt 2: Die Schwäche (Run 2)**
    *   Problem: Underfitting (68%).
    *   Learning: Regularisierung wirkt, aber das Gehirn ist zu klein (3 Blöcke). Wir brauchen Kapazität.
*   **Akt 3: Die rohe Kraft (Run 3)**
    *   Problem: Instabilität trotz 87% Peak.
    *   Learning: Tiefe Netzwerke sind schwer zu trainieren.
*   **Akt 4: Die Wissenschaft (Run 4)**
    *   Lösung: ELU + He Normal.
    *   Ergebnis: Stabiles High-Performance Modell.
*   **Akt 5: Die Reife (Run 5)**
    *   Lösung: Höhere Auflösung & `ReduceLROnPlateau`.
    *   Ergebnis: Echte Generalisierung (81% Test Accuracy) und Lösung des "Metall-Problems".