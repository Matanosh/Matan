# Translation tables for project landing pages: (Hebrew source, English, French).
# Only the strings that are new on a project page live here. Everything the page shares
# with the home page (status, price, gallery alts, film, "One home", contact form, footer)
# is translated by the home table in tools/i18n_home.py, so the wording never drifts.
# Longer / more specific strings come first so they win over shorter ones.
NB = ' '   # no-break space (French: before : and inside « »)
NN = ' '   # narrow no-break space (French: in numbers)

COMMON = [
('<html lang="he" dir="rtl">', '<html lang="en" dir="ltr">', '<html lang="fr" dir="ltr">'),
('content="he_IL"', 'content="en_US"', 'content="fr_FR"'),
('MS Group Global, לעמוד הבית', 'MS Group Global, home page', 'MS Group Global, page d’accueil'),
('>כל הפרויקטים</a>', '>All projects</a>', '>Tous les projets</a>'),
('>פרטי הפרויקט</h2>', '>Project details</h2>', '>Détails du projet</h2>'),
('<dt>סטטוס</dt><dd>בבנייה</dd>', '<dt>Status</dt><dd>Under construction</dd>', '<dt>Statut</dt><dd>En construction</dd>'),
('<dt>סוגי דירות וגדלים</dt>', '<dt>Unit types and sizes</dt>', '<dt>Types et surfaces des logements</dt>'),
('<dt>מועד מסירה</dt>', '<dt>Handover</dt>', '<dt>Livraison</dt>'),
('<dt>תנאי תשלום</dt>', '<dt>Payment plan</dt>', '<dt>Modalités de paiement</dt>'),
('<dt>היזם</dt>', '<dt>Developer</dt>', '<dt>Promoteur</dt>'),
('>יעודכן בהמשך</dd>', '>To be added</dd>', '>À compléter</dd>'),
('(פרטים יעודכנו בהמשך)', '(details to be added)', '(détails à compléter)'),
]

PROJECTS = {
'azure': [
('Azure by Lapis, ראס אל חיימה | MS Group Global', 'Azure by Lapis, Ras Al Khaimah | MS Group Global', 'Azure by Lapis, Ras al-Khaïmah | MS Group Global'),
('content="Azure by Lapis: מגדל מגורים עגול בראס אל חיימה, איחוד האמירויות, עם בריכת אינסוף וגן על הגג. החל מ־700,000 דירהם, בליווי מלא של MS Group Global."',
 'content="Azure by Lapis: a round residential tower in Ras Al Khaimah, UAE, with a rooftop infinity pool and garden. From AED 700,000, with full support from MS Group Global."',
 f'content="Azure by Lapis{NB}: une tour résidentielle ronde à Ras al-Khaïmah, aux Émirats, avec piscine à débordement et jardin sur le toit. À partir de 700{NN}000{NB}AED, avec l’accompagnement complet de MS Group Global."'),
('content="מגדל מגורים עגול בראס אל חיימה, עם בריכת אינסוף וגן על הגג. החל מ־700,000 דירהם."',
 'content="A round residential tower in Ras Al Khaimah, with a rooftop infinity pool and garden. From AED 700,000."',
 f'content="Une tour résidentielle ronde à Ras al-Khaïmah, avec piscine à débordement et jardin sur le toit. À partir de 700{NN}000{NB}AED."'),
('<span class="gold">ראס אל חיימה, <span class="nowrap">איחוד האמירויות</span></span>', '<span class="gold">Ras Al Khaimah, UAE</span>', '<span class="gold">Ras al-Khaïmah, Émirats</span>'),
('המחיר נכון ל־14.11.2026', 'Price correct as of 14 November 2026', 'Prix valable au 14 novembre 2026'),
('לשיחת ייעוץ על <bdi>Azure</bdi>', 'Book a call about <bdi>Azure</bdi>', 'Parler d’<bdi>Azure</bdi> avec un conseiller'),
('<dt>מיקום</dt><dd>ראס אל חיימה, איחוד האמירויות</dd>', '<dt>Location</dt><dd>Ras Al Khaimah, UAE</dd>', '<dt>Emplacement</dt><dd>Ras al-Khaïmah, Émirats</dd>'),
('<dt>מחיר התחלתי</dt><dd>700,000 דירהם</dd>', '<dt>Starting price</dt><dd>AED 700,000</dd>', f'<dt>Prix de départ</dt><dd>700{NN}000{NB}AED</dd>'),
],
}

# Project presentation app (present/azure/index.html). Screen names, the app chrome and the new copy.
NAV = [  # (Hebrew, English, French) screen names, used in the menu, the phone bar, the titles and the "next" links
('פתיחה', 'Welcome', 'Accueil'),
('הסביבה', 'Surroundings', 'Environnement'),
('הפרויקט', 'The project', 'Le projet'),
('מה מיוחד', 'Highlights', 'Points forts'),
('סוגי דירות', 'Unit types', 'Types de logements'),
('תנאי תשלום', 'Payment plan', 'Modalités de paiement'),
('הסרטון', 'The film', 'Le film'),
('מי איתכם', 'Who’s with you', 'À vos côtés'),
('הצעד הבא', 'Next step', 'Prochaine étape'),
]
PRESENT_AZURE = [
('Azure by Lapis · מצגת הפרויקט | MS Group Global', 'Azure by Lapis · Project presentation | MS Group Global', 'Azure by Lapis · Présentation du projet | MS Group Global'),
('content="מצגת הפרויקט Azure by Lapis בראס אל חיימה: הסביבה, ההדמיות, מה מיוחד, הסרטון והצעד הבא, בליווי MS Group Global."',
 'content="The Azure by Lapis presentation, Ras Al Khaimah: the surroundings, the renders, the highlights, the film and the next step, with MS Group Global."',
 f'content="La présentation d’Azure by Lapis à Ras al-Khaïmah{NB}: l’environnement, les visuels, les points forts, le film et la prochaine étape, avec MS Group Global."'),
('content="מגדל מגורים עגול בראס אל חיימה, עם בריכת אינסוף וגן על הגג. החל מ־700,000 דירהם."',
 'content="A round residential tower in Ras Al Khaimah, with a rooftop infinity pool and garden. From AED 700,000."',
 f'content="Une tour résidentielle ronde à Ras al-Khaïmah, avec piscine à débordement et jardin sur le toit. À partir de 700{NN}000{NB}AED."'),
('aria-label="מסכי המצגת"', 'aria-label="Presentation screens"', 'aria-label="Écrans de la présentation"'),
('<small>ראס אל חיימה, איחוד האמירויות</small>', '<small>Ras Al Khaimah, UAE</small>', '<small>Ras al-Khaïmah, Émirats</small>'),
('<span class="pnav__soon">בקרוב</span>', '<span class="pnav__soon">Soon</span>', '<span class="pnav__soon">Bientôt</span>'),
('data-pcount="{i} מתוך {n}">1 מתוך 9</span>', 'data-pcount="{i} of {n}">1 of 9</span>', 'data-pcount="{i} sur {n}">1 sur 9</span>'),
('<span>חצי המקלדת</span>', '<span>Arrow keys</span>', '<span>Flèches du clavier</span>'),
('aria-pressed="false">מצב מצגת</button>', 'aria-pressed="false">Present</button>', 'aria-pressed="false">Présenter</button>'),
('<span class="gold">ראס אל חיימה, <span class="nowrap">איחוד האמירויות</span></span>', '<span class="gold">Ras Al Khaimah, UAE</span>', '<span class="gold"><span class="nowrap">Ras al-Khaïmah</span>, Émirats</span>'),
('המחיר נכון ל־14.11.2026', 'Price correct as of 14 November 2026', 'Prix valable au 14 novembre 2026'),
('>התחילו את המצגת</a>', '>Start the presentation</a>', '>Commencer la présentation</a>'),
('>לשיחת ייעוץ <svg', '>Book a call <svg', '>Prendre rendez-vous <svg'),
('<p class="pslide__lead">ראס אל חיימה, איחוד האמירויות. טיסה של כשלוש שעות מתל אביב.</p>',
 '<p class="pslide__lead">Ras Al Khaimah, United Arab Emirates. About a three-hour flight from Tel Aviv.</p>',
 '<p class="pslide__lead">Ras al-Khaïmah, Émirats arabes unis. Environ trois heures de vol depuis Tel-Aviv.</p>'),
('<dt>עיר</dt><dd>ראס אל חיימה</dd>', '<dt>City</dt><dd>Ras Al Khaimah</dd>', '<dt>Ville</dt><dd>Ras al-Khaïmah</dd>'),
('<dt>מדינה</dt><dd>איחוד האמירויות</dd>', '<dt>Country</dt><dd>United Arab Emirates</dd>', '<dt>Pays</dt><dd>Émirats arabes unis</dd>'),
('<dt>טיסה מתל אביב</dt><dd>כשלוש שעות</dd>', '<dt>Flight from Tel Aviv</dt><dd>About three hours</dd>', '<dt>Vol depuis Tel-Aviv</dt><dd>Environ trois heures</dd>'),
('<dt>מקומות קרובים וזמני נסיעה</dt>', '<dt>Nearby places and travel times</dt>', '<dt>Lieux proches et temps de trajet</dt>'),
('aria-label="גלובוס עם קו הטיסה מתל אביב לאיחוד האמירויות"', 'aria-label="Globe with the flight path from Tel Aviv to the UAE"', 'aria-label="Globe avec la liaison aérienne de Tel-Aviv aux Émirats"'),
('<li><h3>בריכת אינסוף וגן על הגג</h3><p>על גג המגדל: בריכה, גן, מתקני כושר וגן משחקים, כפי שהם מוצגים בהדמיות ובסרטון.</p></li>',
 '<li><h3>Rooftop infinity pool and garden</h3><p>On the tower roof: a pool, a garden, fitness equipment and a playground, as shown in the renders and the film.</p></li>',
 '<li><h3>Piscine à débordement et jardin sur le toit</h3><p>Sur le toit de la tour : une piscine, un jardin, des équipements de sport et une aire de jeux, tels que présentés dans les visuels et le film.</p></li>'),
('<li><h3>מרפסות עם בריכה פרטית</h3><p>מרפסות עם בריכה פרטית ונוף לעיר, כפי שהן מוצגות בהדמיות.</p></li>',
 '<li><h3>Balconies with private pools</h3><p>Balconies with a private pool and a city view, as shown in the renders.</p></li>',
 '<li><h3>Balcons avec piscine privée</h3><p>Des balcons avec piscine privée et vue sur la ville, tels que présentés dans les visuels.</p></li>'),
('<li><h3>חדר כושר פתוח מול הנוף</h3><p>מתקני הכושר פתוחים לנוף, כפי שהם מוצגים בהדמיות ובסרטון.</p></li>',
 '<li><h3>Open-air gym facing the view</h3><p>Fitness equipment open to the view, as shown in the renders and the film.</p></li>',
 '<li><h3>Salle de sport en plein air face à la vue</h3><p>Des équipements de sport ouverts sur la vue, tels que présentés dans les visuels et le film.</p></li>'),
('<li><h3>יותר מ־25 מתקנים</h3><p>כך מציג היזם בסרטון: בריכה גדולה עם דקלים, לובי עם פינות ישיבה, טרקלין עם שולחן ביליארד וגן משחקים.</p></li>',
 '<li><h3>More than 25 amenities</h3><p>As the developer presents it in the film: a large pool with palm trees, a lobby with seating areas, a lounge with a billiard table and a playground.</p></li>',
 '<li><h3>Plus de 25 équipements</h3><p>Tels que le promoteur les présente dans le film : une grande piscine bordée de palmiers, un hall avec des espaces salon, un lounge avec billard et une aire de jeux.</p></li>'),
('<p class="soon__title">סוגי הדירות בדרך</p>', '<p class="soon__title">Unit types are on the way</p>', '<p class="soon__title">Les types de logements arrivent</p>'),
('<p>המחיר ההתחלתי כבר ידוע. התוכניות והשטחים יעודכנו כשיגיעו מהיזם.</p>', '<p>The starting price is already known. Floor plans and sizes will be added when the developer sends them.</p>', '<p>Le prix de départ est déjà connu. Les plans et les surfaces seront ajoutés dès que le promoteur les aura transmis.</p>'),
('<dt>מחיר התחלתי</dt><dd>700,000 דירהם</dd>', '<dt>Starting price</dt><dd>AED 700,000</dd>', f'<dt>Prix de départ</dt><dd>700{NN}000{NB}AED</dd>'),
('<dt>סוגי דירות וגדלים</dt><dd class="slot" data-slot="units">יעודכן בהמשך</dd>', '<dt>Unit types and sizes</dt><dd class="slot" data-slot="units">To be added</dd>', '<dt>Types et surfaces des logements</dt><dd class="slot" data-slot="units">À compléter</dd>'),
('data-request="תוכניות הדירות">שלחו לי את התוכניות', 'data-request="Floor plans">Send me the floor plans', 'data-request="Plans des logements">Recevoir les plans'),
('<p class="soon__title">תנאי התשלום בדרך</p>', '<p class="soon__title">The payment plan is on the way</p>', '<p class="soon__title">Les modalités de paiement arrivent</p>'),
('<p>היזם עוד לא פרסם את מסלול התשלום של <bdi>Azure</bdi>. נשלח לכם אותו ברגע שיתקבל.</p>', '<p>The developer has not yet published the payment plan for <bdi>Azure</bdi>. We will send it to you as soon as we receive it.</p>', '<p>Le promoteur n’a pas encore publié l’échéancier de paiement d’<bdi>Azure</bdi>. Nous vous l’enverrons dès sa réception.</p>'),
('data-request="תנאי התשלום">שלחו לי את תנאי התשלום', 'data-request="Payment plan">Send me the payment plan', 'data-request="Modalités de paiement">Recevoir les modalités de paiement'),
('<dt>שיווק וליווי בישראל</dt>', '<dt>Marketing and support in Israel</dt>', '<dt>Commercialisation et accompagnement en Israël</dt>'),
('<h2 id="contact-title" class="pslide__title">נתחיל בשיחה</h2>', '<h2 id="contact-title" class="pslide__title">Let’s talk</h2>', '<h2 id="contact-title" class="pslide__title">Parlons-en</h2>'),
('aria-label="המסך הקודם"', 'aria-label="Previous screen"', 'aria-label="Écran précédent"'),
('aria-label="המסך הבא"', 'aria-label="Next screen"', 'aria-label="Écran suivant"'),
('aria-label="רשימת המסכים"', 'aria-label="All screens"', 'aria-label="Tous les écrans"'),
('aria-label="סגירה"', 'aria-label="Close"', 'aria-label="Fermer"'),
]
for he, en, fr in NAV:  # a 4th item marks a row as optional: not every screen name appears in every role
    PRESENT_AZURE += [
        (f'<span>{he}</span><', f'<span>{en}</span><', f'<span>{fr}</span><', 'optional'),
        (f'<span data-plabel>{he}</span>', f'<span data-plabel>{en}</span>', f'<span data-plabel>{fr}</span>', 'optional'),
        (f'>הבא: {he} <svg', f'>Next: {en} <svg', f'>Suivant{NB}: {fr} <svg', 'optional'),
        (f'-title">{he}</h2>', f'-title">{en}</h2>', f'-title">{fr}</h2>', 'optional'),
    ]
PROJECTS['present-azure'] = PRESENT_AZURE
