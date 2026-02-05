# Sprecher-Skript: Verteidigung "Sorti"
**Zielnote:** 1.0 (Bachelor-Niveau)  
**Dauer:** ~20 Minuten  
**Sprecher-Persona:** Souverän, leidenschaftlich, analytisch. (Kein Ablesen, sondern Erklären!)

---

## I. Einleitung & Fundament (Min 0:00 – 04:00)

### Folie 1: Titel & Begrüßung
*   **Sprechertext:** "Schönen guten Tag. Mein Projekt trägt den Namen 'Sorti'. Es ist nicht nur ein Klassifikator für Müll, sondern eine experimentelle Reise durch die Tiefen von Convolutional Neural Networks. Wir alle kennen das Problem der Mülltrennung aus dem Alltag. Aber heute schauen wir unter die Motorhaube: Wie bringt man einer Maschine bei, den Unterschied zwischen einer zerknüllten Alufolie und einer glänzenden Plastikverpackung zu 'verstehen', wenn beide für ein einfaches Auge fast identisch aussehen?"
*   **Strategischer Fokus:** Positionierung des Projekts als ingenieurwissenschaftliche Problemlösung (nicht nur "Coding", sondern "System-Design").
*   **Implementierungs-Details:** Das Projekt wurde komplett in Python mit TensorFlow/Keras entwickelt, wobei der Fokus auf einer modularen Pipeline lag, die schnelle Iterationen zwischen den Experimenten ermöglichte.

### Folie 2: Motivation & Problemstellung
*   **Sprechertext:** "Die größte Hürde bei der Müllklassifizierung ist die Varianz. Müll hat keine semantische Formkonstanz wie ein Auto oder ein Gesicht. Eine Plastikflasche kann intakt, zerdrückt oder in Teilen vorliegen. Wir stehen also vor der Herausforderung, dass das Modell keine Formen lernen darf, sondern Texturen und Materialeigenschaften extrahieren muss. Das Ziel: Ein System, das robust genug für reale, unvorhersehbare Daten ist."
*   **Strategischer Fokus:** Definition der "Intra-Class Variance" und "Inter-Class Similarity" als Kernprobleme.
*   **Implementierungs-Details:** Vorbereitung auf das Feature-Engineering durch CNNs. Wir nutzen die hierarchische Natur von Convolutions, um von einfachen Kanten (Layer 1) zu komplexen Materialoberflächen (Layer 5) zu gelangen.

---

## II. Die Datenbasis & Roadmap (Min 04:00 – 07:00)

### Folie 3: Die Daten & Herausforderungen
*   **Sprechertext:** "Unser Datensatz umfasst 9 Kategorien, von Metall über Glas bis hin zu organischem Abfall. Die Krux: Die Bilder sind oft unter schlechten Lichtverhältnissen aufgenommen. In der Implementierung habe ich daher `image_dataset_from_directory` genutzt, aber mit einem entscheidenden Detail: Einem strikten Validierungs-Split von 20%, um sicherzustellen, dass wir nie auf Daten testen, die das Modell bereits 'gesehen' hat. Wir haben hier eine klassische 'Long Tail' Distribution bei einigen Klassen, was die Gewichtung später noch wichtig macht."
*   **Strategischer Fokus:** Datenintegrität und Bewusstsein für die Grenzen des Datensatzes.
*   **Implementierungs-Details:** Standardisierung der Inputs auf ein einheitliches Format. Initial 128x128 Pixel, um Rechenzeit zu sparen, bevor wir für das finale Modell die Informationsdichte erhöhten.

### Folie 4: Die Strategie – Der 5-Akter
*   **Sprechertext:** "Ich habe das Projekt in fünf distinkte Phasen unterteilt. Warum? Weil man im Deep Learning oft den Fehler macht, sofort das komplexeste Modell zu bauen. Mein Ansatz war: 'Build it simple, find the failure, fix the failure'. Wir wandern von der Baseline über die Regularisierung und Skalierung hin zur mathematischen Optimierung der Aktivierungsfunktionen."
*   **Strategischer Fokus:** Wissenschaftliches Vorgehen (Iteratives Prototyping). Jedes Experiment dient als Hypothesentest für das nächste.

---

## III. Die Evolution der Architektur (Min 07:00 – 16:00)

### Folie 5: Akt 1 – Die Arroganz (Baseline)
*   **Sprechertext:** "Die Baseline war ein schlichtes CNN mit drei Conv-Layern. Das Ergebnis war ein Lehrbuchbeispiel für Overfitting: 99% Training-Accuracy, aber nur 73% im Test. Strategisch gesehen war das Modell zu mächtig für die wenigen Informationen, die es extrahieren sollte. Es hat die Pixel-Positionen auswendig gelernt statt der Merkmale."
*   **Implementierungs-Details:** Nutzung von `Flatten` und großen `Dense`-Layern am Ende. Das führte zu einer explodierenden Parameteranzahl (Millionen von Gewichten), die für einen so kleinen Datensatz schlicht kontraproduktiv war.

### Folie 6: Akt 2 – Die Demut (Regularisierung)
*   **Sprechertext:** "Um das Auswendiglernen zu verhindern, haben wir dem Modell 'Steine in den Weg gelegt'. Wir haben Data Augmentation implementiert – Zoom, Rotation, Flips. Technisch gesehen haben wir das direkt in das Keras-Modell als Layer integriert, damit die Transformationen auf der GPU laufen. Zusätzlich kam Dropout zum Einsatz. Die Accuracy sank auf 68%, aber – und das ist wichtig – die Lücke zwischen Training und Test schloss sich. Das Modell wurde ehrlich."
*   **Strategischer Fokus:** Bekämpfung der Varianz durch künstliche Datensatzvergrößerung.
*   **Implementierungs-Details:** `RandomFlip("horizontal_and_vertical")`, `RandomRotation(0.2)` und `Dropout(0.5)` vor dem Output-Layer.

### Folie 7: Akt 3 – Die Kraft (Skalierung & Stabilität)
*   **Sprechertext:** "Ein ehrliches, aber schwaches Modell bringt uns nicht weiter. Also haben wir die Tiefe auf 5 Blöcke erhöht. Um das Training bei dieser Tiefe stabil zu halten, habe ich **BatchNormalization** eingeführt. Das wirkt wie eine interne Standardisierung nach jeder Schicht. Das Ergebnis: 87% Accuracy. Aber: Die Kurven waren extrem volatil. Das Modell war wie ein Rennwagen ohne Stoßdämpfer."
*   **Strategischer Fokus:** Kapazitätserhöhung bei gleichzeitiger Kontrolle der Gradientenflüsse.
*   **Implementierungs-Details:** 5 Blöcke mit Filtern von 16 bis zu 256. Einführung von `GlobalAveragePooling2D` statt `Flatten`, um die Parameteranzahl drastisch zu reduzieren und das Modell robuster gegen räumliche Verschiebungen zu machen.

### Folie 8: Akt 4 – Die Wissenschaft (ELU & He-Init)
*   **Sprechertext:** "Um die Instabilität zu lösen, sind wir an die mathematischen Grundlagen gegangen. Standard-ReLU-Einheiten 'sterben' oft ab, wenn sie negative Werte erhalten. Wir haben auf **ELU (Exponential Linear Unit)** umgestellt. Gepaart mit der **He-Normal-Initialisierung** sorgte das dafür, dass die Varianz der Aktivierungen über alle 5 Blöcke hinweg konstant blieb. Das Training wurde butterweich, die Kurven stabilisierten sich bei 85%."
*   **Strategischer Fokus:** Lösung des "Dying ReLU"-Problems und Optimierung der Konvergenzgeschwindigkeit.
*   **Implementierungs-Details:** `activation='elu'` in allen Conv-Layern und `kernel_initializer='he_normal'`. Dies stellt sicher, dass die Gewichte zu Beginn weder zu groß (Exploding Gradients) noch zu klein (Vanishing Gradients) sind.

### Folie 9: Der Plot Twist (Die Metrik-Falle)
*   **Sprechertext:** "Hier kam der Moment der Wahrheit. 85% sehen auf dem Papier toll aus. Aber ein Blick auf die **Confusion Matrix** offenbarte ein Desaster: Das Modell hat Metall fast immer als Plastik oder Glas klassifiziert. Warum? Weil die Details von Metalloberflächen bei 128 Pixeln einfach verloren gingen. Die hohe Gesamtgenauigkeit kam nur durch die 'einfachen' Klassen wie Kleidung zustande. Ein klassischer Fall, wo die Metrik 'Accuracy' uns angelogen hat."
*   **Strategischer Fokus:** Kritische Evaluation jenseits der Hauptmetrik. Fokus auf Recall und Precision für unterrepräsentierte/schwierige Klassen.

### Folie 10: Akt 5 – Die Reife (Auflösung & Scheduler)
*   **Sprechertext:** "Der finale Schlag: Erhöhung der Auflösung auf **256x256 Pixel**, um die metallischen Texturen greifbar zu machen. Zusätzlich haben wir einen **Learning Rate Scheduler** implementiert. Wenn das Modell stagniert, senkt das System automatisch die Lernrate, um feingranularer in das Minimum der Loss-Function zu gleiten. Der Recall für Metall stieg von 30% auf fast 80%. Das ist der Unterschied zwischen einem Prototyp und einer produktionsreifen KI."
*   **Strategischer Fokus:** Information Density & Dynamic Optimization.
*   **Implementierungs-Details:** `input_shape=(256, 256, 3)` und der Keras Callback `ReduceLROnPlateau(factor=0.2, patience=3)`.

---

## IV. Abschluss & Q&A (Min 16:00 – 20:00)

### Folie 11: Fazit
*   **Sprechertext:** "Was nehmen wir mit? Erstens: Deep Learning ist ein iterativer Prozess der Fehleranalyse. Zweitens: Die Architektur ist wichtig, aber die mathematischen Details wie Aktivierungsfunktionen und Initialisierung entscheiden über Sieg oder Niederlage. Unser Champion-Modell ist nicht das mit der höchsten Peak-Accuracy, sondern das mit der besten Balance über alle Materialklassen hinweg."
*   **Strategischer Fokus:** Zusammenfassung der Lessons Learned: Validität vor Performance.

### Folie 12: Ausblick & Dank
*   **Sprechertext:** "Wie geht es weiter? Der nächste logische Schritt wäre Transfer Learning mit einem EfficientNet-Backbone, um die 95% zu knacken. Aber durch den 'From Scratch'-Ansatz haben wir jetzt ein tiefes Verständnis für die Merkmalsextraktion von Müll gewonnen. Vielen Dank für Ihre Aufmerksamkeit – ich bin gespannt auf Ihre Fragen."

---

## Anhang: Vertiefende Experten-Fragen (Vorbereitung)

**F: Warum ELU statt Leaky ReLU?**  
*   **Antwort:** "ELU bietet eine glattere Sättigung für negative Werte, was die Gradienten stabiler macht. Während Leaky ReLU für extrem negative Werte immer weiter wächst, sättigt ELU ab, was eine gewisse Regularisierung bewirkt und den Mittelwert der Aktivierungen näher an Null bringt."

**F: Welchen Einfluss hatte Global Average Pooling auf die Overfitting-Problematik?**  
*   **Antwort:** "Massiv. Ein `Flatten`-Layer nach einem 256-Filter-Block würde bei 256x256 Input Zehntausende Neuronen erzeugen. Jeder Dense-Layer dahinter hätte Millionen Parameter. GAP reduziert das auf exakt 256 Werte – einen pro Feature Map. Das zwingt das Netz, globale Merkmale zu lernen, anstatt sich auf die exakte Pixelposition zu verlassen."

**F: Warum haben Sie die Lernrate reduziert und nicht einfach mehr Epochen trainiert?**  
*   **Antwort:** "Weil das Modell bei einer hohen Lernrate um das Minimum 'herumspringt'. Es ist wie ein Golfball, der zu schnell geschlagen wird und über das Loch rollt. Die Reduktion der Lernrate erlaubt es dem Optimizer, in die feinen Senken der Loss-Landschaft einzutauchen, die er vorher schlicht übersprungen hätte."