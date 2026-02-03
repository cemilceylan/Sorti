# Beleg: Automatisierte Müllklassifizierung mit Convolutional Neural Networks (Sorti)

**Kurs:** ProgData WS25 (Intro to Deep Learning / Computer Vision)  
**Autor:** [Dein Name]  
**Datum:** 3. Februar 2026  

---

## 1. Einleitung & Motivation
In der modernen Kreislaufwirtschaft ist die effiziente Trennung von Abfällen eine der größten technologischen Herausforderungen. Manuelle Sortierung ist zeitaufwendig und fehleranfällig. Das Projekt "Sorti" zielt darauf ab, ein tiefes neuronales Netz (CNN) zu entwickeln, das Bilder von Abfällen autonom in neun Kategorien (z. B. Metall, Glas, Bio-Müll) klassifiziert. Die besondere Schwierigkeit liegt in der hohen Varianz der Objekte: Eine zerknitterte Cola-Dose sieht visuell völlig anders aus als eine neue, behält aber ihre chemische Klassifizierung bei. Ziel ist es, ein Modell zu entwickeln, das robuste Merkmale lernt, anstatt sich auf bloße Pixelmuster zu verlassen.

## 2. Stand der Technik
Traditionelle Computer-Vision-Ansätze basierten oft auf manuell entwickelten Filtern für Kanten oder Farben. Moderne Deep-Learning-Verfahren, insbesondere Convolutional Neural Networks (CNNs), automatisieren diesen Prozess. Durch die Verwendung von Faltungsschichten (Convolutional Layers) lernt das System eine Hierarchie von Merkmalen: von einfachen Kanten in den ersten Schichten bis hin zu komplexen Formen (wie dem Flaschenhals oder der Textur von Karton) in tieferen Schichten.

## 3. Methodik: Der 5-Akter (The Experimental Arc)
Um die optimale Architektur zu finden, wurde kein starrer Plan verfolgt, sondern eine **evolutionäre Strategie in 5 Akten**. Jeder "Run" basierte auf der Fehleranalyse des Vorgängers:

1.  **Akt 1 (Baseline):** Ein naives Modell, um zu sehen, wie schnell das Netz lernt (und overfittet).
2.  **Akt 2 (Regularisierung):** Einfügen von "Bremsen" (Dropout, Augmentation), um das Auswendiglernen zu stoppen.
3.  **Akt 3 (Scale):** Massive Erhöhung der neuronalen Kapazität (Tiefe), um komplexe Merkmale zu erfassen.
4.  **Akt 4 (Optimization):** Mathematische Feinjustierung (Aktivierungsfunktionen, Initialisierung) für maximale Leistung.
5.  **Akt 5 (Stability):** Fokus auf Zuverlässigkeit und Fehlerbalance statt reiner Spitzenleistung.

## 4. Implementierung & Systemaufbau
Das System wurde in **Python** unter Verwendung von **TensorFlow/Keras** auf einer **A100 GPU (Google Colab)** trainiert.

### 4.1 Datenbasis
*   **Input:** RGB-Bilder, resized auf 128x128 (Run 1-4) und 256x256 (Run 5).
*   **Klassen:** 9 Kategorien (Battery, Biological, Cardboard, Clothes, Glass, Metal, Paper, Plastic, Shoes).

### 4.2 Die finale Architektur (Run 4/5 Basis)
*   **Backbone:** Ein tiefes **5-Block-CNN**. Jeder Block folgt dem Muster:
    *   `Conv2D` (Filter steigend: 32 -> 512)
    *   `BatchNormalization` (für stabile Gradienten)
    *   `ELU`-Aktivierung (Run 4 & 5) oder `ReLU` (Run 3)
    *   `MaxPooling2D`
*   **Head:** `GlobalAveragePooling2D` (statt Flatten) zur extremen Parameter-Reduktion und Vermeidung von Overfitting im Klassifikator.
*   **Regularisierung:**
    *   **Data Augmentation:** RandomFlip, RandomRotation, RandomZoom.
    *   **Dropout:** 50% der Verbindungen werden im Training gekappt.
*   **Training:**
    *   **Optimizer:** Adam.
    *   **Callbacks:** `EarlyStopping` (Geduld) und `ReduceLROnPlateau` (Lernraten-Anpassung bei Stagnation).

## 5. Durchführung & Ergebnisse (Die 5 Runs)

### Run 1: Die "Arroganz" (Baseline)
*   **Setup:** 3 Blöcke, keine Regularisierung.
*   **Ergebnis:** 99% Training vs. 73% Validation Accuracy.
*   **Lektion:** Das Modell hat die Bilder auswendig gelernt (Overfitting). Es ist "arrogant" und scheitert an neuen Daten.

### Run 2: Die "Demut" (Regularisierung)
*   **Setup:** 3 Blöcke + Augmentation + Dropout + GlobalAveragePooling.
*   **Ergebnis:** Einbruch auf ~68% Accuracy, aber kein Overfitting mehr (Train ≈ Val).
*   **Lektion:** Das Modell ist jetzt "ehrlich", aber zu "dumm" (Underfitting). Die 3-Block-Architektur hat nicht genug Kapazität für 9 komplexe Klassen.

### Run 3: Die "Kraft" (Deep CNN)
*   **Setup:** Upgrade auf **5 Blöcke** (bis 512 Filter) + BatchNormalization.
*   **Ergebnis:** Sprung auf **~87% Peak Accuracy**.
*   **Problem:** Extrem instabile Loss-Kurven ("Zittern"). Das Modell lernt schnell, ist aber volatil.

### Run 4: Die "Wissenschaft" (Der Sprinter)
*   **Setup:** 5 Blöcke + **ELU** Aktivierung + **He-Normal** Initialisierung + **128px Auflösung**.
*   **Ergebnis:** Stabilste Konvergenz und **höchste Validierungs-Accuracy (85.2%)**.
*   **Der Haken:** Die Confusion Matrix zeigte eine "Shadow Overfitting". Es ignorierte schwierige Klassen wie **Metall** (Recall 30%) und **Schuhe** (Recall 20%) fast komplett, um den Score zu maximieren.

### Run 5: Die "Reife" (Der Marathonläufer)
*   **Setup:** **256px Auflösung** + `ReduceLROnPlateau` (Lernrate dynamisch senken) + **ELU/He-Init**.
*   **Ergebnis:** Etwas niedrigere Peak-Accuracy (~82%), aber **massive Verbesserung der Confusion Matrix**.
*   **Durchbruch:** Der Recall für Metall stieg auf **78%**. Das Modell ist "fairer" und robuster, auch wenn der Score etwas tiefer ist.

## 6. Zusammenfassung & Fazit
Das Projekt zeigt, dass "Accuracy" nicht alles ist.
*   **Run 4** ist unser "akademischer Sieger" (höchste Zahl).
*   **Run 5** ist unser "praktischer Sieger" (beste Fehlerverteilung und Zuverlässigkeit).
Wir haben gelernt, dass Tiefe (Capacity) notwendig ist, aber erst durch mathematische Stabilisierung (Batch Norm, He-Init) und intelligente Trainingssteuerung (ReduceLROnPlateau) kontrollierbar wird.

---

## 7. Gliederung der Verteidigung (20 Min)

**Titel:** "Sorti: Vom Pixel-Raten zum Verstehen - Eine KI-Evolution"

### 7.1 Zeitplan & Folien

**Einleitung (3 Min)**
*   **Folie 1: Intro.** Projektziel & Relevanz (Mülltrennung ist schwer).
*   **Folie 2: Die Herausforderung.** Visuelle Varianz (Zerknülltes Papier vs. flaches Papier).

**Die Reise (12 Min - Der Kern)**
*   **Folie 3: Akt 1 (Baseline).** Grafik: Riesiger Gap zwischen Train/Val. -> *Diagnose: Overfitting.*
*   **Folie 4: Akt 2 (Regularisierung).** Grafik: Kurven treffen sich, aber tief. -> *Diagnose: Underfitting (zu wenig Gehirn).*
*   **Folie 5: Akt 3 (Scale).** Architektur-Diagramm (5 Blöcke). -> *Lösung: Mehr Neuronen = Mehr Verständnis.*
*   **Folie 6: Akt 4 (Optimization).** Run 4 Kurve (glatt). Erklärung: Warum ELU & He-Init besser sind als ReLU & Glorot. -> *Resultat: 85% Peak.*
*   **Folie 7: Der Konflikt (Confusion Matrix).** Zeigen, dass Run 4 bei Metall versagt.
*   **Folie 8: Akt 5 (Lösung).** Run 5 Confusion Matrix. -> *Resultat: Metall wird erkannt. Balance > Peak Score.*

**Abschluss (5 Min)**
*   **Folie 9: Live-Demo / Beispiele.** Zeigen von Klassifizierungen (Richtig vs. Falsch).
*   **Folie 10: Fazit.** "Wir brauchen nicht nur mehr Daten, wir brauchen besseres Training."

### 7.2 Kernbotschaften (Q&A Vorbereitung)
*   **Warum ist Run 5 besser, wenn Run 4 mehr % hat?**
    *   "Weil ein Müllroboter, der 100% Papier erkennt aber 0% Metall, nutzlos ist. Run 5 ist ausgeglichen."
*   **Was bringt GlobalAveragePooling?**
    *   "Es reduziert Millionen von Parametern auf wenige Hundert. Das verhindert Overfitting im letzten Schritt extrem effektiv."
*   **Warum ELU statt ReLU?**
    *   "ReLU tötet Neuronen bei negativen Werten (Dying ReLU). ELU lässt sie leicht negativ sein, was den Informationsfluss in tiefen Netzen am Leben erhält."

---

## 8. Literaturverzeichnis / Web-Quellen

1.  **TensorFlow Core Team**, "Image classification Tutorial," *TensorFlow Core Documentation*. [Online]. Verfügbar: https://www.tensorflow.org/tutorials/images/classification.
2.  **Gary Thung**, "TrashNet Dataset Repository," *GitHub*. [Online]. Verfügbar: https://github.com/garythung/trashnet.
3.  **Jason Brownlee**, "A Gentle Introduction to the Rectified Linear Unit (ReLU)," *Machine Learning Mastery*. [Online]. Verfügbar: https://machinelearningmastery.com/rectified-linear-activation-function-for-deep-learning-neural-networks/.
4.  **Keras Team**, "Keras Documentation: Layer Weight Initializers," *Keras.io*. [Online]. Verfügbar: https://keras.io/api/layers/initializers/.
