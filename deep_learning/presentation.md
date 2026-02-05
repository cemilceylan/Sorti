# Sprecher-Skript: Verteidigung "Sorti"
**Ziel:** Verteidigung des Deep Learning Projekts (Note 1.0)
**Dauer:** ~20 Minuten
**Stil:** Professionell, analytisch, story-driven ("Die Evolution des Modells").

---

## 1. Motivation und Problemstellung

**Sprechertext:**
"Herzlich Willkommen zur Verteidigung meines Projekts 'Sorti'.
Wir leben in einer Welt, die in Müll versinkt. Die Industrie bewegt sich hin zur Kreislaufwirtschaft, aber die größte Hürde ist oft der erste Schritt: Die korrekte Trennung. Mein Ziel war es, ein KI-Modell zu entwickeln, das genau dieses Problem löst."

**Das Problem:**
"Für uns Menschen ist es leicht: Wir sehen eine Dose, wir wissen 'Metall'. Für eine KI ist das extrem schwer.
*   **Die Kernfrage:** Kann ein mathematisches Modell den Unterschied zwischen einer zerknüllten Alufolie und einer glänzenden Plastikverpackung 'verstehen'?
*   Es geht hier nicht um einfache Formen – eine Dose kann plattgedrückt sein. Es geht um das Verständnis von **Textur, Reflektion und Materialbeschaffenheit**."

---

## 2. Die Daten und Herausforderungen

**Sprechertext:**
"Schauen wir uns das Fundament an: Die Daten."

**Fakten:**
*   **Quellen:** Kombination aus 'Garbage Classification' (cchangcs) und 'Garbage Dataset' (Suman Kunwar).
*   **Umfang:** 15.244 Bilder in 9 Klassen (von Batterie bis Schuhe).
*   **Split:** 80% Training, 20% Validierung.

**Die Herausforderungen:**
1.  **Granulare Details:** Metall und Plastik können beide glänzen. Glas und Plastik sind beide transparent. Das Modell muss feinste Nuancen lernen.
2.  **Kein Form-Lernen:** Da Müll oft deformiert ist (zerknüllt, zerrissen), darf das Modell nicht einfach 'Zylinder = Flasche' lernen. Es muss die Textur extrahieren.
3.  **Hardware-Hunger:** Je tiefer wir graben, desto größer wird das Modell. Wir brauchten massive Rechenpower."

---

## 3. Strategie und Implementierung

**Sprechertext:**
"Wie geht man so ein komplexes Problem an? Nicht mit der Brechstange, sondern mit Strategie."

**Das Setup:**
*   **Umgebung:** Google Colab mit einer **A100 GPU** (40GB VRAM) und 83GB System RAM.
*   **Framework:** TensorFlow / Keras.
*   **Optimizer:** Adam (Adaptive Learning Rate).
*   **Loss Function:** Sparse Categorical Crossentropy.

**Die 5-Phasen-Strategie:**
"Ich habe das Modell nicht einfach 'gebaut'. Ich habe es **evolviert**. Mein Mantra war: *Build it simple, find the failure, fix the failure.* Wir sind durch 5 Phasen gegangen, wobei jede Phase die Schwäche der vorherigen korrigiert hat."

### Phase 1: Baseline (128x128)
*   "Wir starteten simpel. Das Ergebnis? Massives Overfitting. Das Modell hat die Bilder auswendig gelernt (Memory), aber nicht verstanden."

### Phase 2: Regularisierung (128x128)
*   "Wir fügten 'Bremsen' ein: Dropout und Data Augmentation. Das Overfitting verschwand, aber das Modell war zu 'dumm' (Underfitting). Es fehlte die Kapazität."

### Phase 3: Scaling (128x128)
*   "Wir machten das Gehirn größer: 5 Convolutional Blöcke. Die Accuracy erreichte einen numerischen Peak von **87,04%**.
*   **Aber:** Das Training war instabil wie ein Erdbeben. Die Loss-Kurve hatte massive Sprünge. In der Wissenschaft ist ein 'Glückstreffer' weniger wert als ein stabiles System."

### Phase 4: Der Champion (128x128)
*   "Hier kam die mathematische Optimierung: **ELU** und **He-Normal**.
*   **Das Ergebnis:** Wir halten die **87% Accuracy**, aber bei absolut glatten Kurven. Das Modell ist reproduzierbar, stabil und balanciert die Klassen besser aus (z.B. Metall-Recall).
*   **Fazit:** Run 4 ist unser wissenschaftlicher Champion."

### Phase 5: Das High-Res Experiment (256x256)
*   "Wir dachten: 'Mehr Pixel = Mehr Performance'. Wir skalierten auf 256x256 Pixel hoch.
*   **Das Ergebnis:** Überraschenderweise sank die Accuracy auf **81%**.
*   **Die Lektion:** Größer ist nicht immer besser. Die höhere Auflösung brachte mehr Rauschen als nützliche Information."

---

## 4. Ausblick und Fazit

**Sprechertext:**
"Was nehmen wir aus dieser Reise mit?"

**Fazit:**
1.  **Deep Learning ist ein Prozess:** Es geht nicht um den ersten Code, sondern um iterative Fehleranalyse (Overfitting -> Underfitting -> Instability -> Perfection).
2.  **Architektur > Brute Force:** Run 4 (kleine Bilder, schlaue Mathematik) hat Run 5 (große Bilder) geschlagen.
3.  **Genauigkeit ist nicht alles:** Wir brauchen ein Modell, das auch effizient ist.

**Technische Anekdote (Lessons Learned):**
"Ein kurzes Wort zur Fehlerkultur: Anfangs dachte ich, mein Champion-Modell (Run 4) wäre schlecht (66%). Der Grund? Ich hatte es versehentlich mit 256er-Bildern getestet, obwohl es auf 128er trainiert war. Nach der Korrektur zeigte sich die wahre Stärke von 87%. Pre-Processing ist entscheidend!"

**Ausblick:**
*   **Transfer Learning:** Der nächste logische Schritt wäre der Einsatz von vortrainierten Netzen (z.B. EfficientNet), um die letzten Prozentpunkte zu holen.
*   **Anwendung:** Eine App, die das Kamerabild scannt und direkt anzeigt: 'Blaue Tonne' oder 'Gelber Sack'."

"Vielen Dank. Ich stehe nun für Ihre Fragen zur Verfügung."
