/**
 * True Friends Quiz — Question Bank
 * Questions organized by language and category.
 * {name} is replaced at runtime with the host player's nickname.
 */
var QUESTIONS = {
  en: [
    // Favorites
    {
      id: 1,
      question: "What is {name}'s favorite color?",
      answers: ["Red", "Blue", "Green", "Purple"],
    },
    {
      id: 2,
      question: "What is {name}'s favorite food?",
      answers: ["Pizza", "Sushi", "Burger", "Pasta"],
    },
    {
      id: 3,
      question: "What is {name}'s favorite season?",
      answers: ["Spring", "Summer", "Autumn", "Winter"],
    },
    {
      id: 4,
      question: "What is {name}'s favorite movie genre?",
      answers: ["Action", "Comedy", "Horror", "Romance"],
    },
    {
      id: 5,
      question: "What is {name}'s favorite animal?",
      answers: ["Dog", "Cat", "Horse", "Dolphin"],
    },
    {
      id: 6,
      question: "What is {name}'s favorite music genre?",
      answers: ["Pop", "Rock", "Hip-Hop", "Classical"],
    },
    {
      id: 7,
      question: "What is {name}'s favorite drink?",
      answers: ["Coffee", "Tea", "Juice", "Soda"],
    },
    {
      id: 8,
      question: "What is {name}'s favorite day of the week?",
      answers: ["Monday", "Friday", "Saturday", "Sunday"],
    },
    {
      id: 9,
      question: "What is {name}'s favorite hobby?",
      answers: ["Reading", "Gaming", "Sports", "Cooking"],
    },
    {
      id: 10,
      question: "What is {name}'s favorite ice cream flavor?",
      answers: ["Chocolate", "Vanilla", "Strawberry", "Pistachio"],
    },

    // Personality
    {
      id: 11,
      question: "What would {name} do if they won the lottery?",
      answers: [
        "Travel the world",
        "Buy a house",
        "Invest it all",
        "Throw a huge party",
      ],
    },
    {
      id: 12,
      question: "What is {name} most afraid of?",
      answers: ["Spiders", "Heights", "Public speaking", "The dark"],
    },
    {
      id: 13,
      question: "What superpower would {name} choose?",
      answers: ["Flying", "Invisibility", "Time travel", "Super strength"],
    },
    {
      id: 14,
      question: "How does {name} react when they're stressed?",
      answers: ["Eats snacks", "Goes silent", "Talks a lot", "Exercises"],
    },
    {
      id: 15,
      question: "What is {name}'s hidden talent?",
      answers: ["Singing", "Dancing", "Drawing", "Cooking"],
    },
    {
      id: 16,
      question: "What does {name} do first thing in the morning?",
      answers: ["Check phone", "Make coffee", "Shower", "Stay in bed"],
    },
    {
      id: 17,
      question: "What would {name} take to a desert island?",
      answers: ["A book", "Music player", "A friend", "A survival kit"],
    },
    {
      id: 18,
      question: "How would {name} describe themselves in one word?",
      answers: ["Funny", "Caring", "Adventurous", "Chill"],
    },
    {
      id: 19,
      question: "What would {name} do on a perfect day off?",
      answers: [
        "Sleep all day",
        "Go on an adventure",
        "Hang with friends",
        "Binge-watch shows",
      ],
    },
    {
      id: 20,
      question: "What is {name}'s worst habit?",
      answers: [
        "Being late",
        "Procrastinating",
        "Overthinking",
        "Snacking too much",
      ],
    },

    // Would you rather
    {
      id: 21,
      question: "Would {name} rather be famous or rich?",
      answers: ["Famous", "Rich", "Both", "Neither"],
    },
    {
      id: 22,
      question: "Would {name} rather live in the mountains or by the beach?",
      answers: ["Mountains", "Beach", "City", "Countryside"],
    },
    {
      id: 23,
      question: "Would {name} rather give up social media or TV forever?",
      answers: ["Social media", "TV", "Neither", "Both is fine"],
    },
    {
      id: 24,
      question: "Would {name} rather travel to the past or the future?",
      answers: ["Past", "Future", "Stay in present", "Both!"],
    },
    {
      id: 25,
      question: "Would {name} rather have a rewind or pause button in life?",
      answers: ["Rewind", "Pause", "Fast forward", "None of these"],
    },

    // Experiences & Dreams
    {
      id: 26,
      question: "What is {name}'s dream vacation destination?",
      answers: ["Japan", "Maldives", "New York", "Paris"],
    },
    {
      id: 27,
      question: "What career would {name} pick in another life?",
      answers: ["Chef", "Astronaut", "Artist", "Athlete"],
    },
    {
      id: 28,
      question: "What is {name}'s go-to karaoke song genre?",
      answers: ["80s classics", "Pop hits", "Rock anthems", "I don't sing!"],
    },
    {
      id: 29,
      question: "If {name} could meet any celebrity, who would it be?",
      answers: [
        "A musician",
        "A movie star",
        "A sports legend",
        "A historical figure",
      ],
    },
    {
      id: 30,
      question: "What does {name} value most in a friendship?",
      answers: ["Loyalty", "Humor", "Honesty", "Support"],
    },

    // Fun & Random
    {
      id: 31,
      question: "What is {name}'s spirit animal?",
      answers: ["Wolf", "Eagle", "Cat", "Bear"],
    },
    {
      id: 32,
      question: "How does {name} eat pizza?",
      answers: ["Fold it", "Knife & fork", "Crust first", "Normal way"],
    },
    {
      id: 33,
      question: "What time does {name} usually go to bed?",
      answers: [
        "Before 10 PM",
        "Around midnight",
        "After 2 AM",
        "It varies a lot",
      ],
    },
    {
      id: 34,
      question: "What is {name}'s phone battery usually at?",
      answers: [
        "Almost dead",
        "Around 50%",
        "Fully charged",
        "Always on charger",
      ],
    },
    {
      id: 35,
      question: "How does {name} handle awkward silences?",
      answers: [
        "Make a joke",
        "Check phone",
        "Start random topic",
        "Enjoy the silence",
      ],
    },
    {
      id: 36,
      question: "What type of student was {name} in school?",
      answers: ["Class clown", "Nerd", "Popular kid", "The quiet one"],
    },
    {
      id: 37,
      question: "If {name} were a pizza topping, what would they be?",
      answers: ["Pepperoni", "Mushrooms", "Pineapple", "Extra cheese"],
    },
    {
      id: 38,
      question: "What does {name} spend too much money on?",
      answers: ["Food", "Clothes", "Tech gadgets", "Entertainment"],
    },
    {
      id: 39,
      question: "How does {name} act at a party?",
      answers: [
        "Life of the party",
        "Wallflower",
        "DJ controller",
        "In the kitchen",
      ],
    },
    {
      id: 40,
      question: "What emoji best represents {name}?",
      answers: ["😂", "😎", "🤔", "❤️"],
    },
  ],

  el: [
    // Αγαπημένα
    {
      id: 1,
      question: "Ποιο είναι το αγαπημένο χρώμα του/της {name};",
      answers: ["Κόκκινο", "Μπλε", "Πράσινο", "Μωβ"],
    },
    {
      id: 2,
      question: "Ποιο είναι το αγαπημένο φαγητό του/της {name};",
      answers: ["Πίτσα", "Σούσι", "Μπέργκερ", "Μακαρονάδα"],
    },
    {
      id: 3,
      question: "Ποια είναι η αγαπημένη εποχή του/της {name};",
      answers: ["Άνοιξη", "Καλοκαίρι", "Φθινόπωρο", "Χειμώνας"],
    },
    {
      id: 4,
      question: "Ποιο είναι το αγαπημένο είδος ταινίας του/της {name};",
      answers: ["Δράση", "Κωμωδία", "Τρόμου", "Ρομαντικό"],
    },
    {
      id: 5,
      question: "Ποιο είναι το αγαπημένο ζώο του/της {name};",
      answers: ["Σκύλος", "Γάτα", "Άλογο", "Δελφίνι"],
    },
    {
      id: 6,
      question: "Ποιο είναι το αγαπημένο μουσικό είδος του/της {name};",
      answers: ["Ποπ", "Ροκ", "Χιπ-Χοπ", "Κλασική"],
    },
    {
      id: 7,
      question: "Ποιο είναι το αγαπημένο ρόφημα του/της {name};",
      answers: ["Καφές", "Τσάι", "Χυμός", "Αναψυκτικό"],
    },
    {
      id: 8,
      question: "Ποια είναι η αγαπημένη μέρα της εβδομάδας του/της {name};",
      answers: ["Δευτέρα", "Παρασκευή", "Σάββατο", "Κυριακή"],
    },
    {
      id: 9,
      question: "Ποιο είναι το αγαπημένο χόμπι του/της {name};",
      answers: ["Διάβασμα", "Gaming", "Αθλητισμός", "Μαγειρική"],
    },
    {
      id: 10,
      question: "Ποια είναι η αγαπημένη γεύση παγωτού του/της {name};",
      answers: ["Σοκολάτα", "Βανίλια", "Φράουλα", "Φιστίκι"],
    },

    // Προσωπικότητα
    {
      id: 11,
      question: "Τι θα έκανε ο/η {name} αν κέρδιζε το λαχείο;",
      answers: [
        "Ταξίδι στον κόσμο",
        "Αγορά σπιτιού",
        "Επένδυση",
        "Τεράστιο πάρτι",
      ],
    },
    {
      id: 12,
      question: "Τι φοβάται περισσότερο ο/η {name};",
      answers: ["Αράχνες", "Ύψη", "Ομιλία σε κοινό", "Το σκοτάδι"],
    },
    {
      id: 13,
      question: "Ποια υπερδύναμη θα διάλεγε ο/η {name};",
      answers: ["Πτήση", "Αορατότητα", "Ταξίδι στο χρόνο", "Υπερδύναμη"],
    },
    {
      id: 14,
      question: "Πώς αντιδρά ο/η {name} όταν αγχώνεται;",
      answers: ["Τρώει σνακ", "Σιωπά", "Μιλάει πολύ", "Γυμνάζεται"],
    },
    {
      id: 15,
      question: "Ποιο είναι το κρυφό ταλέντο του/της {name};",
      answers: ["Τραγούδι", "Χορός", "Ζωγραφική", "Μαγειρική"],
    },
    {
      id: 16,
      question: "Τι κάνει πρώτο ο/η {name} το πρωί;",
      answers: [
        "Τσεκάρει κινητό",
        "Φτιάχνει καφέ",
        "Κάνει ντους",
        "Μένει στο κρεβάτι",
      ],
    },
    {
      id: 17,
      question: "Τι θα έπαιρνε ο/η {name} σε ένα ερημικό νησί;",
      answers: ["Ένα βιβλίο", "Μουσική", "Έναν φίλο", "Κιτ επιβίωσης"],
    },
    {
      id: 18,
      question: "Πώς θα περιέγραφε ο/η {name} τον εαυτό του/της;",
      answers: ["Αστείος/α", "Στοργικός/ή", "Τολμηρός/ή", "Χαλαρός/ή"],
    },
    {
      id: 19,
      question: "Τι θα έκανε ο/η {name} σε μια τέλεια μέρα;",
      answers: [
        "Ύπνο όλη μέρα",
        "Περιπέτεια",
        "Παρέα με φίλους",
        "Μαραθώνιο σειρών",
      ],
    },
    {
      id: 20,
      question: "Ποια είναι η χειρότερη συνήθεια του/της {name};",
      answers: [
        "Αργοπορία",
        "Αναβλητικότητα",
        "Υπερσκέψη",
        "Πολύ τσιμπολόγημα",
      ],
    },

    // Θα προτιμούσες
    {
      id: 21,
      question: "Ο/Η {name} θα προτιμούσε να είναι διάσημος/η ή πλούσιος/α;",
      answers: ["Διάσημος/η", "Πλούσιος/α", "Και τα δύο", "Κανένα"],
    },
    {
      id: 22,
      question: "Ο/Η {name} θα ζούσε στο βουνό ή στην παραλία;",
      answers: ["Βουνό", "Παραλία", "Πόλη", "Εξοχή"],
    },
    {
      id: 23,
      question: "Ο/Η {name} θα έκοβε τα social media ή την τηλεόραση;",
      answers: ["Social media", "Τηλεόραση", "Κανένα", "Και τα δύο OK"],
    },
    {
      id: 24,
      question: "Ο/Η {name} θα ταξίδευε στο παρελθόν ή το μέλλον;",
      answers: ["Παρελθόν", "Μέλλον", "Παρόν", "Και τα δύο!"],
    },
    {
      id: 25,
      question: "Ο/Η {name} θα ήθελε rewind ή pause στη ζωή;",
      answers: ["Rewind", "Pause", "Fast forward", "Τίποτα"],
    },

    // Εμπειρίες & Όνειρα
    {
      id: 26,
      question: "Ποιος είναι ο ονειρεμένος προορισμός του/της {name};",
      answers: ["Ιαπωνία", "Μαλδίβες", "Νέα Υόρκη", "Παρίσι"],
    },
    {
      id: 27,
      question: "Τι καριέρα θα διάλεγε ο/η {name} σε άλλη ζωή;",
      answers: ["Σεφ", "Αστροναύτης", "Καλλιτέχνης", "Αθλητής"],
    },
    {
      id: 28,
      question: "Τι τραγούδι θα τραγουδούσε ο/η {name} στο καραόκε;",
      answers: ["80s κλασικά", "Ποπ επιτυχίες", "Ροκ ύμνους", "Δεν τραγουδάω!"],
    },
    {
      id: 29,
      question: "Αν ο/η {name} μπορούσε να γνωρίσει κάποιον διάσημο;",
      answers: ["Μουσικό", "Ηθοποιό", "Αθλητή", "Ιστορικό πρόσωπο"],
    },
    {
      id: 30,
      question: "Τι εκτιμά περισσότερο ο/η {name} σε μια φιλία;",
      answers: ["Αφοσίωση", "Χιούμορ", "Ειλικρίνεια", "Στήριξη"],
    },

    // Διασκέδαση & Τυχαία
    {
      id: 31,
      question: "Ποιο είναι το spirit animal του/της {name};",
      answers: ["Λύκος", "Αετός", "Γάτα", "Αρκούδα"],
    },
    {
      id: 32,
      question: "Πώς τρώει πίτσα ο/η {name};",
      answers: ["Τη διπλώνει", "Με μαχαιροπίρουνο", "Από την κόρα", "Κανονικά"],
    },
    {
      id: 33,
      question: "Τι ώρα κοιμάται συνήθως ο/η {name};",
      answers: ["Πριν τις 10", "Γύρω στα 12", "Μετά τις 2", "Αλλάζει συνέχεια"],
    },
    {
      id: 34,
      question: "Πόση μπαταρία έχει συνήθως το κινητό του/της {name};",
      answers: ["Σχεδόν νεκρό", "Γύρω στο 50%", "Πλήρες", "Πάντα στη φόρτιση"],
    },
    {
      id: 35,
      question: "Πώς αντιδρά ο/η {name} σε αμήχανη σιωπή;",
      answers: [
        "Κάνει αστείο",
        "Τσεκάρει κινητό",
        "Αλλάζει θέμα",
        "Απολαμβάνει τη σιωπή",
      ],
    },
    {
      id: 36,
      question: "Τι τύπος μαθητή ήταν ο/η {name};",
      answers: ["Ταραξίας", "Σπασίκλας", "Δημοφιλής", "Ο ήσυχος"],
    },
    {
      id: 37,
      question: "Αν ο/η {name} ήταν τοπινγκ πίτσας;",
      answers: ["Πεπερόνι", "Μανιτάρια", "Ανανάς", "Έξτρα τυρί"],
    },
    {
      id: 38,
      question: "Σε τι ξοδεύει πολλά ο/η {name};",
      answers: ["Φαγητό", "Ρούχα", "Τεχνολογία", "Διασκέδαση"],
    },
    {
      id: 39,
      question: "Πώς είναι ο/η {name} σε πάρτι;",
      answers: ["Η ψυχή του πάρτι", "Στη γωνία", "Στα decks", "Στην κουζίνα"],
    },
    {
      id: 40,
      question: "Ποιο emoji αντιπροσωπεύει τον/την {name};",
      answers: ["😂", "😎", "🤔", "❤️"],
    },
  ],

  // ===================== SPANISH =====================
  es: [
    {
      id: 1,
      question: "¿Cuál es el color favorito de {name}?",
      answers: ["Rojo", "Azul", "Verde", "Morado"],
    },
    {
      id: 2,
      question: "¿Cuál es la comida favorita de {name}?",
      answers: ["Pizza", "Sushi", "Hamburguesa", "Pasta"],
    },
    {
      id: 3,
      question: "¿Cuál es la estación favorita de {name}?",
      answers: ["Primavera", "Verano", "Otoño", "Invierno"],
    },
    {
      id: 4,
      question: "¿Cuál es el género de película favorito de {name}?",
      answers: ["Acción", "Comedia", "Terror", "Romance"],
    },
    {
      id: 5,
      question: "¿Cuál es el animal favorito de {name}?",
      answers: ["Perro", "Gato", "Caballo", "Delfín"],
    },
    {
      id: 6,
      question: "¿Cuál es el género musical favorito de {name}?",
      answers: ["Pop", "Rock", "Hip-Hop", "Clásica"],
    },
    {
      id: 7,
      question: "¿Cuál es la bebida favorita de {name}?",
      answers: ["Café", "Té", "Zumo", "Refresco"],
    },
    {
      id: 8,
      question: "¿Cuál es el día favorito de la semana de {name}?",
      answers: ["Lunes", "Viernes", "Sábado", "Domingo"],
    },
    {
      id: 9,
      question: "¿Cuál es el hobby favorito de {name}?",
      answers: ["Leer", "Videojuegos", "Deportes", "Cocinar"],
    },
    {
      id: 10,
      question: "¿Cuál es el sabor de helado favorito de {name}?",
      answers: ["Chocolate", "Vainilla", "Fresa", "Pistacho"],
    },
    {
      id: 11,
      question: "¿Qué haría {name} si ganara la lotería?",
      answers: [
        "Viajar por el mundo",
        "Comprar una casa",
        "Invertirlo todo",
        "Hacer una gran fiesta",
      ],
    },
    {
      id: 12,
      question: "¿Qué es lo que más teme {name}?",
      answers: ["Arañas", "Alturas", "Hablar en público", "La oscuridad"],
    },
    {
      id: 13,
      question: "¿Qué superpoder elegiría {name}?",
      answers: ["Volar", "Invisibilidad", "Viajar en el tiempo", "Superfuerza"],
    },
    {
      id: 14,
      question: "¿Cómo reacciona {name} cuando está estresado/a?",
      answers: [
        "Come snacks",
        "Se queda en silencio",
        "Habla mucho",
        "Hace ejercicio",
      ],
    },
    {
      id: 15,
      question: "¿Cuál es el talento oculto de {name}?",
      answers: ["Cantar", "Bailar", "Dibujar", "Cocinar"],
    },
    {
      id: 16,
      question: "¿Qué hace {name} al despertarse?",
      answers: [
        "Mirar el móvil",
        "Hacer café",
        "Ducharse",
        "Quedarse en la cama",
      ],
    },
    {
      id: 17,
      question: "¿Qué llevaría {name} a una isla desierta?",
      answers: ["Un libro", "Música", "Un amigo", "Kit de supervivencia"],
    },
    {
      id: 18,
      question: "¿Cómo se describiría {name} en una palabra?",
      answers: ["Gracioso/a", "Cariñoso/a", "Aventurero/a", "Tranquilo/a"],
    },
    {
      id: 19,
      question: "¿Qué haría {name} en un día perfecto libre?",
      answers: [
        "Dormir todo el día",
        "Ir de aventura",
        "Salir con amigos",
        "Maratón de series",
      ],
    },
    {
      id: 20,
      question: "¿Cuál es el peor hábito de {name}?",
      answers: [
        "Llegar tarde",
        "Procrastinar",
        "Pensar demasiado",
        "Picar mucho",
      ],
    },
    {
      id: 21,
      question: "¿{name} preferiría ser famoso/a o rico/a?",
      answers: ["Famoso/a", "Rico/a", "Ambos", "Ninguno"],
    },
    {
      id: 22,
      question: "¿{name} viviría en la montaña o en la playa?",
      answers: ["Montaña", "Playa", "Ciudad", "Campo"],
    },
    {
      id: 23,
      question: "¿{name} dejaría las redes sociales o la TV?",
      answers: ["Redes sociales", "TV", "Ninguna", "Ambas está bien"],
    },
    {
      id: 24,
      question: "¿{name} viajaría al pasado o al futuro?",
      answers: ["Pasado", "Futuro", "Quedarse en el presente", "¡Ambos!"],
    },
    {
      id: 25,
      question: "¿{name} preferiría rebobinar o pausar la vida?",
      answers: ["Rebobinar", "Pausar", "Avanzar rápido", "Ninguno"],
    },
    {
      id: 26,
      question: "¿Cuál es el destino soñado de {name}?",
      answers: ["Japón", "Maldivas", "Nueva York", "París"],
    },
    {
      id: 27,
      question: "¿Qué carrera elegiría {name} en otra vida?",
      answers: ["Chef", "Astronauta", "Artista", "Atleta"],
    },
    {
      id: 28,
      question: "¿Qué género cantaría {name} en el karaoke?",
      answers: [
        "Clásicos de los 80",
        "Éxitos pop",
        "Himnos rock",
        "¡No canto!",
      ],
    },
    {
      id: 29,
      question: "¿A qué famoso le gustaría conocer a {name}?",
      answers: [
        "Un músico",
        "Una estrella de cine",
        "Un deportista",
        "Un personaje histórico",
      ],
    },
    {
      id: 30,
      question: "¿Qué valora más {name} en una amistad?",
      answers: ["Lealtad", "Humor", "Honestidad", "Apoyo"],
    },
    {
      id: 31,
      question: "¿Cuál es el animal espiritual de {name}?",
      answers: ["Lobo", "Águila", "Gato", "Oso"],
    },
    {
      id: 32,
      question: "¿Cómo come pizza {name}?",
      answers: ["La dobla", "Con cubiertos", "Por la corteza", "Normal"],
    },
    {
      id: 33,
      question: "¿A qué hora se duerme {name}?",
      answers: [
        "Antes de las 10",
        "Sobre medianoche",
        "Después de las 2",
        "Varía mucho",
      ],
    },
    {
      id: 34,
      question: "¿Cuánta batería suele tener el móvil de {name}?",
      answers: [
        "Casi muerto",
        "Sobre el 50%",
        "Cargado al máximo",
        "Siempre cargando",
      ],
    },
    {
      id: 35,
      question: "¿Cómo maneja {name} los silencios incómodos?",
      answers: [
        "Cuenta un chiste",
        "Mira el móvil",
        "Cambia de tema",
        "Disfruta el silencio",
      ],
    },
    {
      id: 36,
      question: "¿Qué tipo de estudiante era {name}?",
      answers: ["El payaso", "El empollón", "El popular", "El callado"],
    },
    {
      id: 37,
      question: "Si {name} fuera un topping de pizza, ¿cuál sería?",
      answers: ["Pepperoni", "Champiñones", "Piña", "Extra queso"],
    },
    {
      id: 38,
      question: "¿En qué gasta demasiado {name}?",
      answers: ["Comida", "Ropa", "Tecnología", "Entretenimiento"],
    },
    {
      id: 39,
      question: "¿Cómo es {name} en una fiesta?",
      answers: [
        "El alma de la fiesta",
        "En una esquina",
        "En los DJs",
        "En la cocina",
      ],
    },
    {
      id: 40,
      question: "¿Qué emoji representa mejor a {name}?",
      answers: ["😂", "😎", "🤔", "❤️"],
    },
  ],

  // ===================== FRENCH =====================
  fr: [
    {
      id: 1,
      question: "Quelle est la couleur préférée de {name} ?",
      answers: ["Rouge", "Bleu", "Vert", "Violet"],
    },
    {
      id: 2,
      question: "Quel est le plat préféré de {name} ?",
      answers: ["Pizza", "Sushi", "Burger", "Pâtes"],
    },
    {
      id: 3,
      question: "Quelle est la saison préférée de {name} ?",
      answers: ["Printemps", "Été", "Automne", "Hiver"],
    },
    {
      id: 4,
      question: "Quel est le genre de film préféré de {name} ?",
      answers: ["Action", "Comédie", "Horreur", "Romance"],
    },
    {
      id: 5,
      question: "Quel est l'animal préféré de {name} ?",
      answers: ["Chien", "Chat", "Cheval", "Dauphin"],
    },
    {
      id: 6,
      question: "Quel est le genre musical préféré de {name} ?",
      answers: ["Pop", "Rock", "Hip-Hop", "Classique"],
    },
    {
      id: 7,
      question: "Quelle est la boisson préférée de {name} ?",
      answers: ["Café", "Thé", "Jus", "Soda"],
    },
    {
      id: 8,
      question: "Quel est le jour préféré de {name} ?",
      answers: ["Lundi", "Vendredi", "Samedi", "Dimanche"],
    },
    {
      id: 9,
      question: "Quel est le hobby préféré de {name} ?",
      answers: ["Lecture", "Jeux vidéo", "Sport", "Cuisine"],
    },
    {
      id: 10,
      question: "Quel est le parfum de glace préféré de {name} ?",
      answers: ["Chocolat", "Vanille", "Fraise", "Pistache"],
    },
    {
      id: 11,
      question: "Que ferait {name} en gagnant au loto ?",
      answers: [
        "Voyager",
        "Acheter une maison",
        "Tout investir",
        "Grande fête",
      ],
    },
    {
      id: 12,
      question: "De quoi {name} a-t-il/elle le plus peur ?",
      answers: ["Araignées", "Hauteurs", "Parler en public", "Le noir"],
    },
    {
      id: 13,
      question: "Quel super-pouvoir choisirait {name} ?",
      answers: ["Voler", "Invisibilité", "Voyage dans le temps", "Super force"],
    },
    {
      id: 14,
      question: "Comment réagit {name} quand il/elle est stressé(e) ?",
      answers: [
        "Mange des snacks",
        "Se tait",
        "Parle beaucoup",
        "Fait du sport",
      ],
    },
    {
      id: 15,
      question: "Quel est le talent caché de {name} ?",
      answers: ["Chanter", "Danser", "Dessiner", "Cuisiner"],
    },
    {
      id: 16,
      question: "Que fait {name} en premier le matin ?",
      answers: [
        "Regarde son téléphone",
        "Fait du café",
        "Se douche",
        "Reste au lit",
      ],
    },
    {
      id: 17,
      question: "Qu'emporterait {name} sur une île déserte ?",
      answers: ["Un livre", "De la musique", "Un ami", "Kit de survie"],
    },
    {
      id: 18,
      question: "Comment {name} se décrirait en un mot ?",
      answers: ["Drôle", "Attentionné(e)", "Aventurier/ère", "Cool"],
    },
    {
      id: 19,
      question: "Que ferait {name} lors d'un jour de repos parfait ?",
      answers: [
        "Dormir toute la journée",
        "Partir à l'aventure",
        "Voir des amis",
        "Marathon de séries",
      ],
    },
    {
      id: 20,
      question: "Quelle est la pire habitude de {name} ?",
      answers: [
        "Être en retard",
        "Procrastiner",
        "Trop réfléchir",
        "Trop grignoter",
      ],
    },
    {
      id: 21,
      question: "{name} préférerait être célèbre ou riche ?",
      answers: ["Célèbre", "Riche", "Les deux", "Aucun"],
    },
    {
      id: 22,
      question: "{name} vivrait en montagne ou à la plage ?",
      answers: ["Montagne", "Plage", "Ville", "Campagne"],
    },
    {
      id: 23,
      question: "{name} abandonnerait les réseaux sociaux ou la TV ?",
      answers: ["Réseaux sociaux", "TV", "Aucun", "Les deux OK"],
    },
    {
      id: 24,
      question: "{name} voyagerait dans le passé ou le futur ?",
      answers: ["Passé", "Futur", "Rester au présent", "Les deux !"],
    },
    {
      id: 25,
      question: "{name} préférerait rembobiner ou mettre pause ?",
      answers: ["Rembobiner", "Pause", "Avance rapide", "Rien"],
    },
    {
      id: 26,
      question: "Quelle est la destination rêvée de {name} ?",
      answers: ["Japon", "Maldives", "New York", "Paris"],
    },
    {
      id: 27,
      question: "Quelle carrière choisirait {name} dans une autre vie ?",
      answers: ["Chef", "Astronaute", "Artiste", "Athlète"],
    },
    {
      id: 28,
      question: "Quel genre chanterait {name} au karaoké ?",
      answers: [
        "Classiques 80s",
        "Tubes pop",
        "Hymnes rock",
        "Je ne chante pas !",
      ],
    },
    {
      id: 29,
      question: "Quelle célébrité {name} aimerait rencontrer ?",
      answers: [
        "Un musicien",
        "Une star de cinéma",
        "Un sportif",
        "Un personnage historique",
      ],
    },
    {
      id: 30,
      question: "Qu'est-ce que {name} valorise le plus en amitié ?",
      answers: ["Loyauté", "Humour", "Honnêteté", "Soutien"],
    },
    {
      id: 31,
      question: "Quel est l'animal totem de {name} ?",
      answers: ["Loup", "Aigle", "Chat", "Ours"],
    },
    {
      id: 32,
      question: "Comment {name} mange-t-il/elle sa pizza ?",
      answers: ["La plie", "Au couteau", "Par la croûte", "Normalement"],
    },
    {
      id: 33,
      question: "À quelle heure se couche {name} ?",
      answers: ["Avant 22h", "Vers minuit", "Après 2h", "Ça varie"],
    },
    {
      id: 34,
      question: "Combien de batterie a le téléphone de {name} ?",
      answers: ["Presque mort", "Environ 50%", "Plein", "Toujours en charge"],
    },
    {
      id: 35,
      question: "Comment {name} gère les silences gênants ?",
      answers: [
        "Fait une blague",
        "Regarde son tel",
        "Change de sujet",
        "Apprécie le silence",
      ],
    },
    {
      id: 36,
      question: "Quel type d'élève était {name} ?",
      answers: [
        "Le clown",
        "Le premier de classe",
        "Le populaire",
        "Le discret",
      ],
    },
    {
      id: 37,
      question: "Si {name} était un topping de pizza ?",
      answers: ["Pepperoni", "Champignons", "Ananas", "Extra fromage"],
    },
    {
      id: 38,
      question: "Dans quoi {name} dépense trop ?",
      answers: ["Nourriture", "Vêtements", "Gadgets tech", "Divertissement"],
    },
    {
      id: 39,
      question: "Comment est {name} en soirée ?",
      answers: [
        "L'âme de la fête",
        "Dans un coin",
        "Aux platines",
        "En cuisine",
      ],
    },
    {
      id: 40,
      question: "Quel emoji représente {name} ?",
      answers: ["😂", "😎", "🤔", "❤️"],
    },
  ],

  // ===================== GERMAN =====================
  de: [
    {
      id: 1,
      question: "Was ist die Lieblingsfarbe von {name}?",
      answers: ["Rot", "Blau", "Grün", "Lila"],
    },
    {
      id: 2,
      question: "Was ist das Lieblingsessen von {name}?",
      answers: ["Pizza", "Sushi", "Burger", "Pasta"],
    },
    {
      id: 3,
      question: "Was ist die Lieblingsjahreszeit von {name}?",
      answers: ["Frühling", "Sommer", "Herbst", "Winter"],
    },
    {
      id: 4,
      question: "Was ist das Lieblingsfilm-Genre von {name}?",
      answers: ["Action", "Komödie", "Horror", "Romantik"],
    },
    {
      id: 5,
      question: "Was ist das Lieblingstier von {name}?",
      answers: ["Hund", "Katze", "Pferd", "Delfin"],
    },
    {
      id: 6,
      question: "Was ist das Lieblingsmusik-Genre von {name}?",
      answers: ["Pop", "Rock", "Hip-Hop", "Klassik"],
    },
    {
      id: 7,
      question: "Was ist das Lieblingsgetränk von {name}?",
      answers: ["Kaffee", "Tee", "Saft", "Limonade"],
    },
    {
      id: 8,
      question: "Was ist der Lieblingstag von {name}?",
      answers: ["Montag", "Freitag", "Samstag", "Sonntag"],
    },
    {
      id: 9,
      question: "Was ist das Lieblingshobby von {name}?",
      answers: ["Lesen", "Gaming", "Sport", "Kochen"],
    },
    {
      id: 10,
      question: "Was ist die Lieblingseissorte von {name}?",
      answers: ["Schokolade", "Vanille", "Erdbeere", "Pistazie"],
    },
    {
      id: 11,
      question: "Was würde {name} mit einem Lottogewinn machen?",
      answers: [
        "Die Welt bereisen",
        "Ein Haus kaufen",
        "Alles investieren",
        "Riesige Party",
      ],
    },
    {
      id: 12,
      question: "Wovor hat {name} am meisten Angst?",
      answers: ["Spinnen", "Höhe", "Öffentlich reden", "Dunkelheit"],
    },
    {
      id: 13,
      question: "Welche Superkraft würde {name} wählen?",
      answers: ["Fliegen", "Unsichtbarkeit", "Zeitreisen", "Superstärke"],
    },
    {
      id: 14,
      question: "Wie reagiert {name} bei Stress?",
      answers: ["Isst Snacks", "Wird still", "Redet viel", "Macht Sport"],
    },
    {
      id: 15,
      question: "Was ist das versteckte Talent von {name}?",
      answers: ["Singen", "Tanzen", "Zeichnen", "Kochen"],
    },
    {
      id: 16,
      question: "Was macht {name} morgens als erstes?",
      answers: ["Handy checken", "Kaffee machen", "Duschen", "Im Bett bleiben"],
    },
    {
      id: 17,
      question: "Was würde {name} auf eine einsame Insel mitnehmen?",
      answers: ["Ein Buch", "Musik", "Einen Freund", "Survival-Kit"],
    },
    {
      id: 18,
      question: "Wie würde sich {name} in einem Wort beschreiben?",
      answers: ["Lustig", "Fürsorglich", "Abenteuerlich", "Entspannt"],
    },
    {
      id: 19,
      question: "Was würde {name} an einem perfekten freien Tag tun?",
      answers: [
        "Den ganzen Tag schlafen",
        "Abenteuer erleben",
        "Freunde treffen",
        "Serien-Marathon",
      ],
    },
    {
      id: 20,
      question: "Was ist die schlimmste Angewohnheit von {name}?",
      answers: [
        "Zu spät kommen",
        "Prokrastinieren",
        "Überdenken",
        "Zu viel naschen",
      ],
    },
    {
      id: 21,
      question: "Wäre {name} lieber berühmt oder reich?",
      answers: ["Berühmt", "Reich", "Beides", "Keins"],
    },
    {
      id: 22,
      question: "Würde {name} lieber in den Bergen oder am Strand leben?",
      answers: ["Berge", "Strand", "Stadt", "Land"],
    },
    {
      id: 23,
      question: "Würde {name} Social Media oder TV aufgeben?",
      answers: ["Social Media", "TV", "Keins", "Beides OK"],
    },
    {
      id: 24,
      question: "Würde {name} in die Vergangenheit oder Zukunft reisen?",
      answers: ["Vergangenheit", "Zukunft", "Gegenwart", "Beides!"],
    },
    {
      id: 25,
      question: "Hätte {name} lieber einen Zurückspul- oder Pause-Knopf?",
      answers: ["Zurückspulen", "Pause", "Vorspulen", "Keins"],
    },
    {
      id: 26,
      question: "Was ist das Traumreiseziel von {name}?",
      answers: ["Japan", "Malediven", "New York", "Paris"],
    },
    {
      id: 27,
      question: "Welchen Beruf würde {name} in einem anderen Leben wählen?",
      answers: ["Koch", "Astronaut", "Künstler", "Sportler"],
    },
    {
      id: 28,
      question: "Welches Genre würde {name} beim Karaoke singen?",
      answers: [
        "80er Klassiker",
        "Pop-Hits",
        "Rock-Hymnen",
        "Ich singe nicht!",
      ],
    },
    {
      id: 29,
      question: "Welchen Promi würde {name} gerne treffen?",
      answers: [
        "Einen Musiker",
        "Einen Filmstar",
        "Einen Sportler",
        "Eine historische Figur",
      ],
    },
    {
      id: 30,
      question: "Was schätzt {name} am meisten in einer Freundschaft?",
      answers: ["Treue", "Humor", "Ehrlichkeit", "Unterstützung"],
    },
    {
      id: 31,
      question: "Was ist das Krafttier von {name}?",
      answers: ["Wolf", "Adler", "Katze", "Bär"],
    },
    {
      id: 32,
      question: "Wie isst {name} Pizza?",
      answers: ["Falten", "Mit Besteck", "Rand zuerst", "Normal"],
    },
    {
      id: 33,
      question: "Wann geht {name} normalerweise ins Bett?",
      answers: [
        "Vor 22 Uhr",
        "Gegen Mitternacht",
        "Nach 2 Uhr",
        "Unterschiedlich",
      ],
    },
    {
      id: 34,
      question: "Wie viel Akku hat das Handy von {name} normalerweise?",
      answers: ["Fast leer", "Etwa 50%", "Voll geladen", "Immer am Ladegerät"],
    },
    {
      id: 35,
      question: "Wie geht {name} mit peinlicher Stille um?",
      answers: [
        "Macht einen Witz",
        "Schaut aufs Handy",
        "Wechselt das Thema",
        "Genießt die Stille",
      ],
    },
    {
      id: 36,
      question: "Was für ein Schüler war {name}?",
      answers: ["Klassenkasper", "Streber", "Der Beliebte", "Der Stille"],
    },
    {
      id: 37,
      question: "Wenn {name} ein Pizza-Belag wäre?",
      answers: ["Pepperoni", "Pilze", "Ananas", "Extra Käse"],
    },
    {
      id: 38,
      question: "Wofür gibt {name} zu viel Geld aus?",
      answers: ["Essen", "Kleidung", "Technik", "Unterhaltung"],
    },
    {
      id: 39,
      question: "Wie ist {name} auf einer Party?",
      answers: [
        "Die Seele der Party",
        "Mauerblümchen",
        "Am DJ-Pult",
        "In der Küche",
      ],
    },
    {
      id: 40,
      question: "Welches Emoji repräsentiert {name}?",
      answers: ["😂", "😎", "🤔", "❤️"],
    },
  ],

  // ===================== TURKISH =====================
  tr: [
    {
      id: 1,
      question: "{name}'in en sevdiği renk nedir?",
      answers: ["Kırmızı", "Mavi", "Yeşil", "Mor"],
    },
    {
      id: 2,
      question: "{name}'in en sevdiği yemek nedir?",
      answers: ["Pizza", "Suşi", "Hamburger", "Makarna"],
    },
    {
      id: 3,
      question: "{name}'in en sevdiği mevsim hangisi?",
      answers: ["İlkbahar", "Yaz", "Sonbahar", "Kış"],
    },
    {
      id: 4,
      question: "{name}'in en sevdiği film türü nedir?",
      answers: ["Aksiyon", "Komedi", "Korku", "Romantik"],
    },
    {
      id: 5,
      question: "{name}'in en sevdiği hayvan nedir?",
      answers: ["Köpek", "Kedi", "At", "Yunus"],
    },
    {
      id: 6,
      question: "{name}'in en sevdiği müzik türü nedir?",
      answers: ["Pop", "Rock", "Hip-Hop", "Klasik"],
    },
    {
      id: 7,
      question: "{name}'in en sevdiği içecek nedir?",
      answers: ["Kahve", "Çay", "Meyve suyu", "Gazlı içecek"],
    },
    {
      id: 8,
      question: "{name}'in en sevdiği gün hangisi?",
      answers: ["Pazartesi", "Cuma", "Cumartesi", "Pazar"],
    },
    {
      id: 9,
      question: "{name}'in en sevdiği hobi nedir?",
      answers: ["Okumak", "Oyun oynamak", "Spor", "Yemek yapmak"],
    },
    {
      id: 10,
      question: "{name}'in en sevdiği dondurma çeşidi nedir?",
      answers: ["Çikolata", "Vanilya", "Çilek", "Antep fıstığı"],
    },
    {
      id: 11,
      question: "{name} piyango kazansa ne yapardı?",
      answers: [
        "Dünyayı gezer",
        "Ev alır",
        "Yatırım yapar",
        "Büyük parti verir",
      ],
    },
    {
      id: 12,
      question: "{name} en çok neden korkar?",
      answers: [
        "Örümcekler",
        "Yükseklik",
        "Topluluk önünde konuşma",
        "Karanlık",
      ],
    },
    {
      id: 13,
      question: "{name} hangi süper gücü seçerdi?",
      answers: ["Uçmak", "Görünmezlik", "Zamanda yolculuk", "Süper güç"],
    },
    {
      id: 14,
      question: "{name} stresli olduğunda ne yapar?",
      answers: ["Atıştırır", "Sessizleşir", "Çok konuşur", "Spor yapar"],
    },
    {
      id: 15,
      question: "{name}'in gizli yeteneği nedir?",
      answers: ["Şarkı söylemek", "Dans", "Çizim", "Yemek yapmak"],
    },
    {
      id: 16,
      question: "{name} sabah ilk ne yapar?",
      answers: ["Telefona bakar", "Kahve yapar", "Duş alır", "Yatakta kalır"],
    },
    {
      id: 17,
      question: "{name} ıssız bir adaya ne götürürdü?",
      answers: ["Bir kitap", "Müzik", "Bir arkadaş", "Hayatta kalma kiti"],
    },
    {
      id: 18,
      question: "{name} kendini bir kelimeyle nasıl tanımlar?",
      answers: ["Komik", "Şefkatli", "Maceracı", "Rahat"],
    },
    {
      id: 19,
      question: "{name} mükemmel bir tatil gününde ne yapar?",
      answers: [
        "Bütün gün uyur",
        "Maceraya atılır",
        "Arkadaşlarla takılır",
        "Dizi maratonu",
      ],
    },
    {
      id: 20,
      question: "{name}'in en kötü alışkanlığı nedir?",
      answers: ["Geç kalmak", "Ertelemek", "Fazla düşünmek", "Çok atıştırmak"],
    },
    {
      id: 21,
      question: "{name} ünlü mü yoksa zengin mi olmayı tercih eder?",
      answers: ["Ünlü", "Zengin", "İkisi de", "Hiçbiri"],
    },
    {
      id: 22,
      question: "{name} dağda mı yoksa sahilde mi yaşardı?",
      answers: ["Dağ", "Sahil", "Şehir", "Kırsal"],
    },
    {
      id: 23,
      question: "{name} sosyal medyayı mı yoksa TV'yi mi bırakırdı?",
      answers: ["Sosyal medya", "TV", "Hiçbiri", "İkisi de olur"],
    },
    {
      id: 24,
      question: "{name} geçmişe mi yoksa geleceğe mi giderdi?",
      answers: ["Geçmiş", "Gelecek", "Şimdiki zaman", "İkisi de!"],
    },
    {
      id: 25,
      question: "{name} hayatta geri sarma mı yoksa duraklatma mı ister?",
      answers: ["Geri sarma", "Duraklatma", "İleri sarma", "Hiçbiri"],
    },
    {
      id: 26,
      question: "{name}'in hayalindeki tatil yeri neresi?",
      answers: ["Japonya", "Maldivler", "New York", "Paris"],
    },
    {
      id: 27,
      question: "{name} başka bir hayatta hangi kariyeri seçerdi?",
      answers: ["Şef", "Astronot", "Sanatçı", "Sporcu"],
    },
    {
      id: 28,
      question: "{name} karaokede ne tür şarkı söylerdi?",
      answers: [
        "80'ler klasikleri",
        "Pop hitler",
        "Rock marşları",
        "Şarkı söylemem!",
      ],
    },
    {
      id: 29,
      question: "{name} hangi ünlüyle tanışmak isterdi?",
      answers: [
        "Bir müzisyen",
        "Bir film yıldızı",
        "Bir sporcu",
        "Tarihi bir kişilik",
      ],
    },
    {
      id: 30,
      question: "{name} arkadaşlıkta neye en çok değer verir?",
      answers: ["Sadakat", "Mizah", "Dürüstlük", "Destek"],
    },
    {
      id: 31,
      question: "{name}'in ruh hayvanı nedir?",
      answers: ["Kurt", "Kartal", "Kedi", "Ayı"],
    },
    {
      id: 32,
      question: "{name} pizzayı nasıl yer?",
      answers: ["Katlayarak", "Çatal bıçakla", "Kenarından", "Normal"],
    },
    {
      id: 33,
      question: "{name} genellikle saat kaçta yatar?",
      answers: [
        "10'dan önce",
        "Gece yarısı civarı",
        "2'den sonra",
        "Hep değişir",
      ],
    },
    {
      id: 34,
      question: "{name}'in telefon şarjı genelde kaçta olur?",
      answers: ["Neredeyse ölü", "Yaklaşık %50", "Tam dolu", "Hep şarjda"],
    },
    {
      id: 35,
      question: "{name} garip sessizliklerde ne yapar?",
      answers: [
        "Espri yapar",
        "Telefona bakar",
        "Konu değiştirir",
        "Sessizliğin tadını çıkarır",
      ],
    },
    {
      id: 36,
      question: "{name} okulda nasıl bir öğrenciydi?",
      answers: ["Sınıf palyaçosu", "İnek", "Popüler", "Sessiz olan"],
    },
    {
      id: 37,
      question: "{name} bir pizza malzemesi olsa ne olurdu?",
      answers: ["Sucuk", "Mantar", "Ananas", "Ekstra peynir"],
    },
    {
      id: 38,
      question: "{name} neye çok para harcar?",
      answers: ["Yemek", "Kıyafet", "Teknoloji", "Eğlence"],
    },
    {
      id: 39,
      question: "{name} bir partide nasıl davranır?",
      answers: ["Partinin ruhu", "Köşede durur", "DJ'lik yapar", "Mutfakta"],
    },
    {
      id: 40,
      question: "{name}'i en iyi temsil eden emoji hangisi?",
      answers: ["😂", "😎", "🤔", "❤️"],
    },
  ],

  // ===================== ARABIC =====================
  ar: [
    {
      id: 1,
      question: "ما هو اللون المفضل لـ {name}؟",
      answers: ["أحمر", "أزرق", "أخضر", "بنفسجي"],
    },
    {
      id: 2,
      question: "ما هو الطعام المفضل لـ {name}؟",
      answers: ["بيتزا", "سوشي", "برجر", "باستا"],
    },
    {
      id: 3,
      question: "ما هو الفصل المفضل لـ {name}؟",
      answers: ["الربيع", "الصيف", "الخريف", "الشتاء"],
    },
    {
      id: 4,
      question: "ما هو نوع الأفلام المفضل لـ {name}؟",
      answers: ["أكشن", "كوميديا", "رعب", "رومانسي"],
    },
    {
      id: 5,
      question: "ما هو الحيوان المفضل لـ {name}؟",
      answers: ["كلب", "قطة", "حصان", "دولفين"],
    },
    {
      id: 6,
      question: "ما هو نوع الموسيقى المفضل لـ {name}؟",
      answers: ["بوب", "روك", "هيب هوب", "كلاسيكي"],
    },
    {
      id: 7,
      question: "ما هو المشروب المفضل لـ {name}؟",
      answers: ["قهوة", "شاي", "عصير", "مشروب غازي"],
    },
    {
      id: 8,
      question: "ما هو اليوم المفضل لـ {name}؟",
      answers: ["الإثنين", "الجمعة", "السبت", "الأحد"],
    },
    {
      id: 9,
      question: "ما هي هواية {name} المفضلة؟",
      answers: ["القراءة", "الألعاب", "الرياضة", "الطبخ"],
    },
    {
      id: 10,
      question: "ما هي نكهة الآيس كريم المفضلة لـ {name}؟",
      answers: ["شوكولاتة", "فانيليا", "فراولة", "فستق"],
    },
    {
      id: 11,
      question: "ماذا سيفعل {name} لو ربح اليانصيب؟",
      answers: [
        "يسافر حول العالم",
        "يشتري بيت",
        "يستثمر كل شيء",
        "يقيم حفلة كبيرة",
      ],
    },
    {
      id: 12,
      question: "ما أكثر شيء يخاف منه {name}؟",
      answers: ["العناكب", "المرتفعات", "التحدث أمام الناس", "الظلام"],
    },
    {
      id: 13,
      question: "أي قوة خارقة سيختار {name}؟",
      answers: ["الطيران", "الاختفاء", "السفر عبر الزمن", "القوة الخارقة"],
    },
    {
      id: 14,
      question: "كيف يتصرف {name} عند التوتر؟",
      answers: ["يأكل سناكس", "يصمت", "يتكلم كثيراً", "يمارس الرياضة"],
    },
    {
      id: 15,
      question: "ما هي الموهبة الخفية لـ {name}؟",
      answers: ["الغناء", "الرقص", "الرسم", "الطبخ"],
    },
    {
      id: 16,
      question: "ما أول شيء يفعله {name} في الصباح؟",
      answers: ["يتفقد الهاتف", "يحضر القهوة", "يستحم", "يبقى في السرير"],
    },
    {
      id: 17,
      question: "ماذا سيأخذ {name} إلى جزيرة نائية؟",
      answers: ["كتاب", "موسيقى", "صديق", "عدة نجاة"],
    },
    {
      id: 18,
      question: "كيف يصف {name} نفسه بكلمة واحدة؟",
      answers: ["مضحك", "حنون", "مغامر", "هادئ"],
    },
    {
      id: 19,
      question: "ماذا سيفعل {name} في يوم إجازة مثالي؟",
      answers: [
        "ينام طول اليوم",
        "يذهب في مغامرة",
        "يقضي وقت مع الأصدقاء",
        "ماراثون مسلسلات",
      ],
    },
    {
      id: 20,
      question: "ما أسوأ عادة عند {name}؟",
      answers: ["التأخر", "التسويف", "التفكير الزائد", "الأكل الكثير"],
    },
    {
      id: 21,
      question: "هل يفضل {name} أن يكون مشهوراً أم غنياً؟",
      answers: ["مشهور", "غني", "الاثنين", "لا شيء"],
    },
    {
      id: 22,
      question: "هل يفضل {name} العيش في الجبل أم الشاطئ؟",
      answers: ["الجبل", "الشاطئ", "المدينة", "الريف"],
    },
    {
      id: 23,
      question: "هل يتخلى {name} عن السوشيال ميديا أم التلفزيون؟",
      answers: ["السوشيال ميديا", "التلفزيون", "لا شيء", "كلاهما ممكن"],
    },
    {
      id: 24,
      question: "هل يسافر {name} للماضي أم المستقبل؟",
      answers: ["الماضي", "المستقبل", "الحاضر", "كلاهما!"],
    },
    {
      id: 25,
      question: "هل يفضل {name} زر الإعادة أم الإيقاف المؤقت في الحياة؟",
      answers: ["إعادة", "إيقاف مؤقت", "تقديم سريع", "لا شيء"],
    },
    {
      id: 26,
      question: "ما هي وجهة أحلام {name}؟",
      answers: ["اليابان", "المالديف", "نيويورك", "باريس"],
    },
    {
      id: 27,
      question: "أي مهنة سيختار {name} في حياة أخرى؟",
      answers: ["شيف", "رائد فضاء", "فنان", "رياضي"],
    },
    {
      id: 28,
      question: "أي نوع أغاني سيغني {name} في الكاريوكي؟",
      answers: ["كلاسيكيات الثمانينات", "أغاني بوب", "روك", "لا أغني!"],
    },
    {
      id: 29,
      question: "أي مشهور يريد {name} مقابلته؟",
      answers: ["موسيقي", "نجم سينما", "رياضي", "شخصية تاريخية"],
    },
    {
      id: 30,
      question: "ما أكثر شيء يقدره {name} في الصداقة؟",
      answers: ["الوفاء", "الفكاهة", "الصدق", "الدعم"],
    },
    {
      id: 31,
      question: "ما هو الحيوان الروحي لـ {name}؟",
      answers: ["ذئب", "نسر", "قطة", "دب"],
    },
    {
      id: 32,
      question: "كيف يأكل {name} البيتزا؟",
      answers: ["يطويها", "بالسكين والشوكة", "من الحافة", "عادي"],
    },
    {
      id: 33,
      question: "متى ينام {name} عادة؟",
      answers: [
        "قبل العاشرة",
        "حوالي منتصف الليل",
        "بعد الثانية",
        "يختلف كثيراً",
      ],
    },
    {
      id: 34,
      question: "كم تكون بطارية هاتف {name} عادة؟",
      answers: ["شبه ميتة", "حوالي 50%", "مشحون بالكامل", "دائماً بالشاحن"],
    },
    {
      id: 35,
      question: "كيف يتعامل {name} مع الصمت المحرج؟",
      answers: ["يلقي نكتة", "يتفقد هاتفه", "يغير الموضوع", "يستمتع بالصمت"],
    },
    {
      id: 36,
      question: "أي نوع طالب كان {name}؟",
      answers: ["مهرج الصف", "المجتهد", "الشعبي", "الهادئ"],
    },
    {
      id: 37,
      question: "لو كان {name} إضافة بيتزا، ماذا سيكون؟",
      answers: ["بيبروني", "فطر", "أناناس", "جبنة إضافية"],
    },
    {
      id: 38,
      question: "على ماذا ينفق {name} كثيراً؟",
      answers: ["الطعام", "الملابس", "التكنولوجيا", "الترفيه"],
    },
    {
      id: 39,
      question: "كيف يتصرف {name} في حفلة؟",
      answers: ["روح الحفلة", "في الزاوية", "عند الـDJ", "في المطبخ"],
    },
    {
      id: 40,
      question: "أي إيموجي يمثل {name}؟",
      answers: ["😂", "😎", "🤔", "❤️"],
    },
  ],
};
