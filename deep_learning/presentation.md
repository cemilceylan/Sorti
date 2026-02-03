# Sprecher-Skript: Verteidigung "Sorti"
**Zielnote:** 1.0 (Bachelor-Niveau)  
**Dauer:** ~20 Minuten  
**Sprecher-Persona:** Souverän, leidenschaftlich, analytisch. (Kein Ablesen, sondern Erklären!)

---

## Einleitung (Min 0:00 – 03:00)

### Folie 1: Titel & Begrüßung
"Schönen guten Tag zusammen. Mein Projekt heißt 'Sorti' und im Kern geht es um ein Problem, das uns im Alltag ständig begegnet: Mülltrennung. Aber während wir Menschen meistens instinktiv wissen, was wohin gehört, ist das für eine KI eine echte Herausforderung. Ich möchte Ihnen heute zeigen, wie ich ein neuronales Netz nicht einfach nur 'trainiert', sondern in einem Prozess über fünf Stufen hinweg quasi 'erzogen' habe, um von einfachen Pixelmustern zu einem echten Verständnis von Materialoberflächen zu kommen."

### Folie 2: Motivation & Problemstellung
"Warum ist das eigentlich so schwer? Schauen wir uns mal das Bild hier an. *[Auf Folie zeigen]* Müll hat keine feste Form. Ein Blatt Papier kann glatt sein oder zerknüllt, eine Dose kann perfekt rund sein oder völlig deformiert. Ein einfaches KI-Modell, das nur auf Formen achtet, ist hier sofort aufgeschmissen. Wir brauchen ein System, das lernt, woraus ein Objekt besteht – also die Textur und die Reflexionen erkennt. In einer echten Recyclinganlage entscheidet das am Ende über die Reinheit des Materials und damit über den Erfolg des ganzen Prozesses."

---

## Die Datenbasis (Min 03:00 – 05:00)

### Folie 3: Die Daten & Herausforderungen
"Kurz zum Datensatz: Wir haben 9 Kategorien. Das klingt machbar, aber der Teufel steckt im Detail. Wir haben es hier mit einer extremen 'Inter-Class Similarity' zu tun. Auf gut Deutsch: Ein glänzendes Stück Plastik sieht einem Stück Metall verdammt ähnlich – erst recht auf einem kleinen 128-Pixel-Bild. Wir haben deshalb im Projektverlauf nicht nur an der KI geschraubt, sondern auch an der Auflösung, um dem Netz überhaupt die Chance zu geben, diese feinen Unterschiede zu 'sehen'."

### Folie 4: Die Strategie – Der 5-Akter
"Ich habe das Ganze nicht als linearen Prozess geplant, sondern als eine Art 'Evolution'. Ich habe fünf Experimente durchgeführt, wobei jedes einzelne die direkte Antwort auf die Schwächen des vorherigen war. Wir gehen jetzt mal gemeinsam diesen Weg: Von einem Modell, das anfangs nur stumpf auswendig gelernt hat, bis hin zu einem System, das wirklich robust generalisiert."

---

## Hauptteil: Die Evolution (Min 05:00 – 15:00)

### Folie 5: Akt 1 – Die Arroganz (Baseline)
"Angefangen haben wir mit einem ganz simplen Modell. Und das Ergebnis war ein klassischer Anfängerfehler: Die Trainingsgenauigkeit ging fast sofort auf 99% hoch, aber bei den Testdaten blieben wir bei 73% hängen. *[Auf Kurve zeigen]* Dieser riesige Graben hier ist das Problem. Das Modell war 'arrogant' – es hat einfach die Bilder auswendig gelernt, anstatt die Merkmale dahinter zu verstehen. Ein klarer Fall von Overfitting."

### Folie 6: Akt 2 – Die Demut (Regularisierung)
"Also mussten wir das Modell bremsen. Wir haben Dropout und Data Augmentation eingeführt – wir haben die Bilder also gedreht, gezoomt und verzerrt, damit das Netz nicht mehr schummeln kann. Das Ergebnis? Der Graben war weg, Training und Test waren auf einem Level. Aber: Die Genauigkeit lag nur noch bei 68%. Jetzt hatten wir ein Modell, das zwar 'ehrlich' war, aber schlichtweg zu wenig 'Gehirnschmalz' hatte. Die Architektur war zu flach für die Komplexität der Daten."

### Folie 7: Akt 3 – Die Kraft (Skalierung)
"Die logische Konsequenz: Wir brauchen mehr Kapazität. Ich habe das Netz auf 5 Blöcke aufgepumpt. Damit das bei dieser Tiefe überhaupt noch stabil lernt, kam **BatchNormalization** zum Einsatz – das wirkt wie ein Stabilisator für die Datenflüsse im Netz. Plötzlich waren wir bei 87% Accuracy. Ein Riesensprung! Aber die Lernkurve war total unruhig, sie hat richtig 'gezittert'. Das Modell war zwar stark, aber extrem nervös und unvorhersehbar."

### Folie 8: Akt 4 – Die Wissenschaft (Mathematische Optimierung)
"Jetzt wurde es spannend. Um diese Instabilität in den Griff zu bekommen, haben wir die Mathematik hinter den Neuronen verändert. Wir sind von der Standard-Aktivierung ReLU auf **ELU** umgestiegen. 
Der Punkt ist: ReLU schaltet Neuronen bei negativen Werten einfach komplett ab – die 'sterben' dann quasi. ELU lässt diese Signale sanft durch. Zusammen mit der passenden Gewichts-Initialisierung nach 'He' wurde das Training plötzlich butterweich. Wir landeten bei soliden 85,2% bei 128 Pixeln Auflösung. Wissenschaftlich gesehen war das unser Durchbruch."

### Folie 9: Der Plot Twist (Die bittere Wahrheit)
"Aber – und das ist der Moment, wo man als Entwickler ehrlich zu sich selbst sein muss: Ein Blick in die Confusion Matrix hat gezeigt, dass die 85% eine Mogelpackung waren. Das Modell hat bei Metall und Schuhen fast alles falsch gemacht, aber weil es bei den 'einfachen' Klassen wie Kleidung so gut war, sah die Gesamtzahl super aus. In der Realität wäre dieser Roboter am Sortierband völlig nutzlos gewesen, weil er Metall einfach ignoriert hätte."

### Folie 10: Akt 5 – Die Reife (Der Marathonläufer)
"Deshalb der finale Schritt: Wir haben die Auflösung auf **256 Pixel** hochgedreht, damit das Netz die Metallstrukturen überhaupt erkennen kann. Und wir haben einen automatischen 'Gear Shifter' eingebaut – einen Scheduler, der die Lernrate senkt, wenn es nicht mehr weitergeht. 
Das Ergebnis war verblüffend: Die Gesamtzahl sank zwar auf 82%, aber der Recall für Metall sprang von mickrigen 30% auf **78%** hoch. Wir haben also ein bisschen Spitzenleistung geopfert, um ein Modell zu bekommen, das wirklich alle Klassen ernst nimmt."

---

## Abschluss & Diskussion (Min 15:00 – 20:00)

### Folie 11: Fazit
"Was haben wir also gelernt? Deep Learning ist kein reines Zahlenspiel. Run 4 war unser 'Sprinter' – schnell und beeindruckend auf dem Papier. Aber Run 5 ist unser 'Marathonläufer' – er ist derjenige, den man tatsächlich in eine Fabrik stellen würde. Wir haben gesehen, dass mathematische Details wie ELU oft wichtiger sind als einfach nur mehr Layer. Und vor allem: Man darf sich niemals von einer einzigen Prozentzahl blenden lassen."

### Folie 12: Ausblick
"Wenn wir das Projekt weiterführen würden, wäre der nächste Schritt Transfer Learning. Aber durch diesen 'From Scratch'-Ansatz wissen wir jetzt ganz genau, *warum* das Netz welche Fehler macht. Und genau dieses Verständnis ist die Basis für alles Weitere. Vielen Dank – ich freue mich auf Ihre Fragen!"

---

## Anhang: Mögliche Q&A Fragen (Vorbereitung)

#### Architektur & Design
**F: Warum haben Sie GlobalAveragePooling statt Flatten verwendet?**
A: "Das hat zwei Gründe. Erstens: **Overfitting.** Flatten führt zu riesigen Dense-Layern mit Millionen Parametern, die nur auswendig lernen. GAP reduziert jede Feature Map auf einen Wert, was die Parameterzahl drastisch senkt. Zweitens: Es zwingt die letzte Convolution-Layer dazu, semantisch bedeutungsvolle Features zu generieren, da diese direkt für die Klassifikation genutzt werden."

**F: Warum Batch Normalization? Und warum *nach* der Convolution?**
A: "Batch Norm stabilisiert die Verteilung der Aktivierungen (Mean 0, Variance 1). Ohne das müssten die Schichten ständig gegen 'wandernde' Daten kämpfen (Internal Covariate Shift). Wir platzieren es vor der Aktivierung, damit ELU immer Eingaben in einem Bereich bekommt, in dem die Funktion optimal arbeitet."

#### Training & Optimierung
**F: Warum ist der Loss bei Run 3 so gesprungen?**
A: "Das war ein Zeichen für eine zu hohe Lernrate. Der Optimizer 'springt' über das Minimum hin und her, anstatt hineinzugleiten. Gelöst haben wir das in Run 5 mit dem `ReduceLROnPlateau` Scheduler, der die Lernrate bei Stagnation dynamisch senkt – quasi ein automatischer Gangwechsel für den Endspurt."

**F: Warum Adam und nicht SGD?**
A: "Adam ist für solche Projekte der Goldstandard, weil er die Lernrate für jeden Parameter individuell anpasst und gleichzeitig Momentum nutzt. Das führt deutlich schneller zu guten Ergebnissen als einfaches SGD."

#### Aktivierungsfunktionen & Initialisierung
**F: Warum ELU und nicht Leaky ReLU?**
A: "Leaky ReLU ist linear für negative Werte, ELU ist logarithmisch glatt. Diese Glätte hilft dem Optimierungsalgorithmus enorm. Außerdem pusht ELU den Mittelwert der Aktivierungen näher an Null, was das gesamte Netz stabiler macht – besonders bei unseren 'dreckigen' Müllbildern."

**F: Warum haben Sie He-Normal Initialisierung für ELU verwendet?**
A: "Standard-Initialisierungen (wie Glorot/Xavier) gehen von einer symmetrischen Aktivierung um Null aus (wie Tanh). ELU und ReLU sind aber nicht symmetrisch. He-Init korrigiert das, indem es die Varianz der Gewichte verdoppelt. Ohne He-Init würde das Signal in einem tiefen 5-Block-Netzwerk von Layer zu Layer schwächer werden (Vanishing Variance), bis das Netz nichts mehr lernt. He-Init sorgt dafür, dass die Signalstärke bis zur letzten Schicht konstant bleibt."

#### Daten & Strategie
**F: Wie gehen Sie mit der Klassen-Imbalance um?**
A: "Ein Teil wurde durch Augmentation abgefangen. Aber Run 4 hat gezeigt, dass das nicht reicht. Erst in Run 5 hat die höhere Auflösung geholfen, da die Merkmale der kleinen Klassen (wie Batterien) distinkter wurden. Ein weiterer Schritt wäre 'Class Weighting' im Loss-Modul gewesen."

**F: Warum kein Transfer Learning?**
A: "Das war eine bewusste Entscheidung für den Lerneffekt. Ich wollte die fundamentalen Probleme wie Vanishing Gradients oder Receptive Fields 'from scratch' verstehen. Mit einem Pre-trained Model knackt man zwar die 90%, lernt aber weniger über die Natur der Daten."
