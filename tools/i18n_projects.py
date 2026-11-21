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
