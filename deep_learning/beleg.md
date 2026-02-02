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
*(Hinweis: Diese Sektion wird nach Abschluss der Re-Runs mit den finalen Metriken gefüllt)*
*   **Run 1 (Baseline):** Erreichte ~97% Trainingsgenauigkeit, aber nur ~69% Validierungsgenauigkeit (Starkes Overfitting).
*   **Run 2 (Regularisiert):** Stabilisierung der Validierungskurve bei ~76%.
*   **Run 3 (Champion):** Finales Modell mit **87,43% Peak Accuracy**.

### 5.1 Fehleranalyse (Confusion Matrix)
Die Analyse der Konfusionsmatrix zeigt spezifische Schwächen:
*   **Metall vs. Plastik:** Glänzende Oberflächen führen zu Verwechslungen, da das Modell "Glanz" fälschlicherweise als primäres Merkmal für Metall lernt.
*   **Bio-Müll:** Die am schwersten zu klassifizierende Gruppe aufgrund der fehlenden geometrischen Konsistenz (z.B. Apfelrest vs. Bananenschale).

## 6. Zusammenfassung & Ausblick
Das Projekt zeigt, dass ein maßgeschneidertes CNN auch mit begrenzten Daten hohe Genauigkeiten erzielen kann, wenn Regularisierungstechniken konsequent angewendet werden.
*   **Fazit:** Die Erhöhung der Kapazität (5 Blocks) in Kombination mit Batch Normalization war der entscheidende Durchbruch.
*   **Zukünftige Arbeit:** Integration von Transfer Learning (z.B. MobileNetV2) und Experimente mit höherer Auflösung (256x256), um die Metall-Plastik-Unterscheidung zu schärfen.

---
*(Dokumentation basierend auf `approach.md` und `results.md`)*

## 7. Gliederung der Verteidigung (20 Minuten)
**Ziel:** ~10 Folien. Fokus auf die Story ("Vom Scheitern zum Erfolg") und die technischen Learnings.

*   **Folie 1: Titel & Übersicht**
    *   Projektname, Kurs, Datum.
*   **Folie 2: Die Motivation & Daten**
    *   Warum ist das schwer? (Visuelle Varianz).
    *   Zeigen eines 3x3 Rasters der 128x128 Bilder.
*   **Folie 3: Das Scheitern (Run 1 - Baseline)**
    *   Graph: Starkes Overfitting.
    *   Narrativ: "Das Modell hat auswendig gelernt."
*   **Folie 4: Die Reparatur (Run 2 - Regularisierung)**
    *   Konzept: Augmentation & Dropout.
    *   Ergebnis: Stabilisierung, aber "Gläserne Decke" bei der Genauigkeit.
*   **Folie 5: Der Champion (Run 3 - Deep CNN)**
    *   Architektur: 5 Blöcke, 512 Filter.
    *   Technik: **Batch Normalization** & **L2** für Stabilität und Tiefe.
*   **Folie 6: Finale Ergebnisse**
    *   Graph: Hohe Accuracy (>85%), niedriger Loss.
    *   Vergleichstabelle der 3 Runs.
*   **Folie 7: Fehleranalyse (Deep Dive)**
    *   Bild: `confusion_matrix.png`.
    *   Diskussion: Warum wird Plastik oft für Metall gehalten? (Glanz-Problem).
*   **Folie 8: Fazit & Ausblick**
    *   Zusammenfassung der Learnings.
    *   Nächste Schritte: Transfer Learning oder höhere Auflösung.
*   **Folie 9: Live Demo (Optional)**
    *   Echtzeit-Klassifizierung eines Testbildes im Notebook.