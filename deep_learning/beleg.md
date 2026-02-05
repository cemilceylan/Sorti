# Beleg: Automatisierte Müllklassifizierung mit Convolutional Neural Networks (Sorti)

**Kurs:** ProgData WS25 (Intro to Deep Learning / Computer Vision)  
**Autor:** Cemil  
**Datum:** 5. Februar 2026  

---

## 1. Einleitung & Motivation

In der modernen Abfallwirtschaft ist die effiziente und sortenreine Trennung von Materialien ("Kreislaufwirtschaft") der Schlüssel zur Nachhaltigkeit. Während Menschen intuitiv zwischen einer Glasflasche und einer Plastikflasche unterscheiden können, stellt dies für Computer Vision eine enorme Herausforderung dar. Visuelle Ähnlichkeiten (z.B. glänzende Oberflächen bei Metall und Plastik) und die unendliche Varianz der Verformung (zerknüllte Dosen vs. intakte Dosen) machen "Müll" zu einer der schwierigsten Klassen für die Objekterkennung.

Das Projekt **Sorti** hat das Ziel, ein Convolutional Neural Network (CNN) zu entwickeln, das "From Scratch" (ohne vortrainierte Modelle) lernt, diese Materialien robust zu unterscheiden.

## 2. Datenbasis und Herausforderungen

### 2.1 Die Daten
Der Datensatz ist eine Kombination aus zwei Open-Source-Quellen ("Garbage Classification" von cchangcs und "Garbage Dataset" von Suman Kunwar), was zu einer Gesamtmenge von **15.244 Bildern** führt.
*   **Klassen (9):** Battery, Biological, Cardboard, Clothes, Glass, Metal, Paper, Plastic, Shoes.
*   **Split:** 80% Training, 20% Validierung (streng getrennt, um Data Leakage zu vermeiden).

### 2.2 Die Herausforderungen
1.  **Hohe Intra-Class Variance:** Eine Plastikflasche kann durchsichtig, grün, zerdrückt oder flach sein.
2.  **Hohe Inter-Class Similarity:** Zerknülltes Papier sieht zerknülltem weißen Plastik oft zum Verwechseln ähnlich.
3.  **Textur vs. Form:** Das Modell darf keine Formen auswendig lernen (da Müll oft deformiert ist), sondern muss Texturen und Materialoberflächen "verstehen" (z.B. die Reflexion von Licht auf Metall).

## 3. Strategie: Der 5-Akter ("Build, Break, Fix")

Anstatt sofort ein komplexes Modell zu bauen, folgte die Entwicklung einer evolutionären Strategie in 5 Phasen. Jede Phase war eine direkte Antwort auf die Schwächen der vorherigen.

### Phase 1: Die Baseline (Die "Arroganz")
*   **Setup:** 3 Conv-Blöcke, Input 128x128, keine Regularisierung.
*   **Ergebnis:** 99% Training Accuracy vs. 73% Validation Accuracy.
*   **Diagnose:** **Overfitting.** Das Modell hat die Trainingsbilder auswendig gelernt ("Memory"), anstatt Konzepte zu verstehen. Es war "arrogant" (hohe Confidence bei falschen Vorhersagen), was zu einer explodierenden Loss-Kurve führte.

### Phase 2: Die Regularisierung (Die "Demut")
*   **Änderung:** Einführung von **Data Augmentation** (Flip, Rotation, Zoom) und **Dropout (50%)**.
*   **Ergebnis:** Der Gap schloss sich (Train ≈ Val), aber die Accuracy stagnierte bei ~68%.
*   **Diagnose:** **Underfitting.** Wir haben das "Auswendiglernen" erfolgreich gestoppt, aber das Modell (3 Blöcke) war nun zu "dumm" (zu wenig Kapazität), um die komplexen Unterschiede zwischen den 9 Klassen zu lernen.

### Phase 3: Scaling (Die "Kraft")
*   **Änderung:** Upgrade auf **5 Conv-Blöcke** (bis zu 512 Filter) und **BatchNormalization**.
*   **Ergebnis:** Numerischer Bestwert von **87,04% Accuracy**.
*   **Problem:** Das Training war extrem instabil ("Zitter-Kurve"). Das Modell hatte zwar die Kraft (Kapazität), aber keine Kontrolle. Solche "Glückstreffer" sind in der Produktion schwer zu reproduzieren.

### Phase 4: Optimization (Der "Champion")
*   **Änderung:** Mathematische Feinjustierung (Aktivierung: **ELU**, Initialisierung: **He-Normal**).
*   **Ergebnis:** **87% Test Accuracy** (Confusion Matrix) bei absolut stabiler Konvergenz.
*   **Der Sieg:** Obwohl Run 3 minimal höher peakte, ist Run 4 der wahre Sieger. Die Kurven sind glatt, das Modell ist reproduzierbar und zeigt eine bessere Balance in schwierigen Klassen (z.B. Metall Recall 79%).
*   **Fazit:** Mathematik (ELU) schlägt rohe Gewalt.

### Phase 5: Das Experiment (High-Res & Limits)
*   **Hypothese:** "Mehr Pixel = Mehr Details = Bessere Erkennung?"
*   **Setup:** Erhöhung der Input-Auflösung auf **256x256** + `ReduceLROnPlateau`.
*   **Ergebnis:** Accuracy sank auf **81%**.
*   **Erkenntnis:** **Bigger isn't always better.** Die höhere Auflösung brachte mehr Rauschen (Noise) als Signal. Für die Architektur (5 Blöcke) war 128x128 der "Sweet Spot". Zudem stieg der Rechenaufwand massiv an.

---

## 4. Technische Analyse & "Lessons Learned"

### 4.1 Die "Resolution Trap" (Fehleranalyse)
Ein entscheidendes Learning entstand bei der Auswertung der Modelle. Zunächst schien es, als ob Modell 4 (der Champion) nur eine Accuracy von 66% hätte.
*   **Der Fehler:** Die Evaluierungs-Pipeline skalierte alle Bilder standardmäßig auf **256x256** (passend zu Run 5).
*   **Der Effekt:** Modell 4 (trainiert auf 128px) bekam nun 256px-Bilder als Input. Da CNNs feste Filtergrößen lernen, zerstörte dieser Skalierungs-Mismatch die Performance (Drop von 87% auf 66%).
*   **Die Lösung:** Nach Korrektur der Pipeline (Downscaling auf 128px für Modell 1-4) bestätigten sich die starken Ergebnisse von 87%.
*   **Fazit:** *Pre-Processing ist Teil des Modells.* Eine Diskrepanz zwischen Training- und Inference-Pipeline kann selbst das beste Modell unbrauchbar machen.

### 4.2 Confusion Matrix (Run 4)
Der Champion (Run 4) zeigt eine hervorragende Balance:
*   **Plastik:** 95% Recall (Das Modell erkennt fast jede Plastikflasche).
*   **Metall:** 79% Recall (Schwierigste Klasse aufgrund von Reflexionen).
*   **Kleidung:** 92% Recall (Sehr gut unterscheidbare Textur).
Die häufigsten Verwechslungen finden zwischen *Glas* und *Plastik* statt, was aufgrund der Transparenz beider Materialien für Computer Vision erwartbar ist.

## 5. Implementierung
Das System wurde in **Python** (Google Colab, A100 GPU) umgesetzt:
*   **Framework:** TensorFlow / Keras.
*   **Daten-Pipeline:** `tf.keras.utils.image_dataset_from_directory` für effizientes Streaming.
*   **Architektur:** Sequential Model mit `Conv2D`, `BatchNormalization`, `ELU`, `MaxPooling2D` und `GlobalAveragePooling2D`.

## 6. Zusammenfassung & Ausblick
Das Projekt "Sorti" zeigt, dass ein **"From Scratch"**-Ansatz für spezialisierte Aufgaben konkurrenzfähige Ergebnisse (87%) liefern kann.

**Wichtigste Erkenntnisse:**
1.  **Architektur > Auflösung:** Eine mathematisch saubere Architektur (ELU/He-Init) auf kleinen Bildern (128px) schlägt Brute-Force (256px).
2.  **Iterative Entwicklung:** Der Weg über Overfitting (Run 1) und Underfitting (Run 2) war notwendig, um die Grenzen der Architektur zu verstehen.

**Nächste Schritte:**
*   **Transfer Learning:** Einsatz von EfficientNetB0, um die 95%-Marke zu knacken.
*   **Deployment:** Integration des Modells in eine Mobile App zur Echtzeit-Erkennung an der Mülltonne.