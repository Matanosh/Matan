"""Build English and French versions of the legal pages, and add the language
switcher to all three languages.  Run from the project root:
    python3 tools/build_legal.py
The Hebrew pages remain the binding version; the translations say so.
"""
import re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
NB, NN = ' ', ' '
PAGES = ['privacy', 'accessibility', 'terms']
NAMES = [('he', 'עב', 'עברית'), ('en', 'EN', 'English'), ('fr', 'FR', 'Français')]
LABEL = {'he': 'שפה', 'en': 'Language', 'fr': 'Langue'}

def href(page_lang, target_lang, file):
    if page_lang == 'he':
        return file if target_lang == 'he' else f'{target_lang}/{file}'
    if target_lang == 'he':
        return f'../{file}'
    return file if target_lang == page_lang else f'../{target_lang}/{file}'

def switcher(lang, file):
    links = ''.join(
        f'<a href="{href(lang, c, file)}" hreflang="{c}" lang="{c}"{" aria-current=\"true\"" if c == lang else ""}>'
        f'<span aria-hidden="true">{s}</span><span class="sr">{f}</span></a>' for c, s, f in NAMES)
    return f'<nav class="lang" aria-label="{LABEL[lang]}" style="margin-inline-start:auto">{links}</nav>'

def alternates(lang, file):
    out = [f'<link rel="alternate" hreflang="{c}" href="{href(lang, c, file)}">' for c, _, _ in NAMES]
    out.append(f'<link rel="alternate" hreflang="x-default" href="{href(lang, "he", file)}">')
    return '\n  '.join(out)

UI = {
  'en': dict(skip='Skip to content', home_label='MS Group Global, home page', cta='Book a call', back='Back to the home page',
             legal='Legal information', p='Privacy policy', a='Accessibility statement', t='Terms of use',
             copy='© 2026 MS Group Global, a subsidiary of M.S GROUP. All rights reserved.',
             note='This is a translation for your convenience. The <a href="../{file}" hreflang="he" lang="he">Hebrew version</a> is the binding one.'),
  'fr': dict(skip='Aller au contenu', home_label='MS Group Global, page d’accueil', cta='Rendez-vous', back='Retour à la page d’accueil',
             legal='Informations légales', p='Politique de confidentialité', a='Déclaration d’accessibilité', t='Conditions d’utilisation',
             copy='© 2026 MS Group Global, filiale de M.S GROUP. Tous droits réservés.',
             note='Cette traduction vous est proposée pour faciliter la lecture. Seule la <a href="../{file}" hreflang="he" lang="he">version hébraïque</a> fait foi.'),
}

TEL = {'en': '<a href="tel:+972722133266" dir="ltr">+972 72-213-3266</a>', 'fr': '<a href="tel:+972722133266" dir="ltr">+972 72 213 3266</a>'}
MAIL = '<a href="mailto:office@msgp.co.il">office@msgp.co.il</a>'
ADDR = {'en': 'B.S.R 4 Tower, 7 Metsada St., Bnei Brak, Israel', 'fr': 'Tour B.S.R 4, 7 rue Metsada, Bnei Brak, Israël'}

def contact(lang):
    if lang == 'en':
        return f'by phone on {TEL["en"]}, by email at {MAIL}, or by post to {ADDR["en"]}'
    return f'par téléphone au {TEL["fr"]}, par e-mail à {MAIL}, ou par courrier à l’adresse {ADDR["fr"]}'

BODY = {
 ('en', 'privacy'): ('Privacy policy', lambda: f'''
        <p class="legal__updated">Updated: 14 November 2026</p>
        <p>This policy explains what personal information is collected on the MS Group Global website, what it is used for and what your rights are, in accordance with Israel’s Protection of Privacy Law, 5741-1981, including Amendment 13, and the regulations under it. Publishing this policy is not a legal confirmation of full compliance.</p>
        <h2>1. Who is responsible for the information</h2>
        <p>The website is operated under the MS Group Global brand, a subsidiary of M.S GROUP. For questions about personal information, contact us {contact('en')}.</p>
        <!-- SLOT: legal entity name and company number of the data controller, to be supplied by the company -->
        <p>The full legal name and registration number of the company that controls the information will be added here.</p>
        <h2>2. Providing information is your choice</h2>
        <p>You are under no legal obligation to provide information on the website. You can browse without giving any details, or call us instead. The enquiry form cannot be sent without a name and phone number.</p>
        <h2>3. What information is collected and why</h2>
        <ul>
          <li>In the enquiry form: full name and phone number (required), budget range and countries of interest (optional).</li>
          <li>Purpose: handling your enquiry, contacting you, and tailoring our answer to the budget and destinations you chose.</li>
          <li>You never need to provide an ID number, credit card details, medical information or information about family members on the website.</li>
        </ul>
        <h2>4. How your enquiry is sent</h2>
        <p>At present, clicking send opens a ready-made email in your email program, addressed to office@msgp.co.il. The message is only sent if you send it yourself, and it is kept in the company’s mailbox. If the website is later connected to an enquiry management system, this policy will be updated.</p>
        <h2>5. Marketing messages</h2>
        <p>Contacting us through the website is not consent to receive advertising. Marketing updates by email, SMS or WhatsApp are sent only to people who explicitly ticked the separate box in the form, in accordance with section 30A of Israel’s Communications (Telecommunications and Broadcasting) Law. Every message lets you unsubscribe, and you can ask to be removed at any time by contacting us.</p>
        <h2>6. Who receives the information</h2>
        <p>The information is intended for the MS Group Global and M.S GROUP team in order to handle your enquiry. If details need to be passed to the developer of a specific project abroad to answer your request, we will do so only after telling you who the recipient is and for what purpose, and subject to the law. Information may also be disclosed in response to a valid legal requirement.</p>
        <h2>7. External services and technical data</h2>
        <p>The website loads fonts from Google Fonts, which may pass your IP address and browser details to that provider. The website’s hosting service may process technical data such as IP addresses and access times in order to operate and secure the site. A project film embedded from YouTube loads only after you press play, in YouTube’s privacy-enhanced mode (youtube-nocookie.com); once it plays, Google’s privacy policy applies to it. The website does not currently use tracking tools or advertising pixels. This policy will be updated before any such tools are used.</p>
        <h2>8. Retention and security</h2>
        <p>Information is kept only as long as it is needed to handle your enquiry and stay in touch with you, or as required by law. We take reasonable measures to secure it, including limiting access to the people who need it.</p>
        <h2>9. Your rights</h2>
        <p>Under the Protection of Privacy Law you are entitled to review the information about you, to ask us to correct information that is inaccurate, incomplete, unclear or out of date, and to ask us to delete it or stop using it for marketing, subject to the law. To make a request, contact us {contact('en')}.</p>
        <h2>10. Changes to this policy</h2>
        <p>We may update this policy. The date of the latest update appears at the top of this page.</p>'''),
 ('fr', 'privacy'): ('Politique de confidentialité', lambda: f'''
        <p class="legal__updated">Mise à jour : 14 novembre 2026</p>
        <p>La présente politique explique quelles informations personnelles sont collectées sur le site MS Group Global, à quoi elles servent et quels sont vos droits, conformément à la loi israélienne sur la protection de la vie privée de 1981 (5741-1981), y compris son amendement 13, et à ses règlements d’application. Sa publication ne vaut pas attestation juridique d’une conformité complète.</p>
        <h2>1. Responsable des informations</h2>
        <p>Le site est exploité sous la marque MS Group Global, filiale de M.S GROUP. Pour toute question relative à vos informations personnelles, contactez-nous {contact('fr')}.</p>
        <!-- SLOT: legal entity name and company number of the data controller, to be supplied by the company -->
        <p>La dénomination sociale complète et le numéro d’immatriculation de la société responsable des informations seront indiqués ici.</p>
        <h2>2. La communication d’informations est facultative</h2>
        <p>Aucune obligation légale ne vous impose de fournir des informations sur le site. Vous pouvez le consulter sans rien communiquer, ou nous appeler. Le formulaire de contact ne peut toutefois pas être envoyé sans nom ni numéro de téléphone.</p>
        <h2>3. Informations collectées et finalités</h2>
        <ul>
          <li>Dans le formulaire de contact : nom complet et téléphone (obligatoires), fourchette de budget et pays qui vous intéressent (facultatifs).</li>
          <li>Finalité : traiter votre demande, vous recontacter et adapter notre réponse au budget et aux destinations choisis.</li>
          <li>Il ne vous est jamais demandé sur le site de numéro d’identité, de coordonnées bancaires, d’informations médicales ou d’informations sur vos proches.</li>
        </ul>
        <h2>4. Envoi de votre demande</h2>
        <p>Actuellement, un clic sur « Envoyer » ouvre un e-mail prérempli dans votre messagerie, adressé à office@msgp.co.il. Le message n’est envoyé que si vous l’envoyez vous-même, et il est conservé dans la boîte de réception de la société. Si le site est relié ultérieurement à un outil de gestion des demandes, la présente politique sera mise à jour.</p>
        <h2>5. Prospection commerciale</h2>
        <p>Nous contacter via le site ne vaut pas consentement à recevoir de la publicité. Les actualités commerciales par e-mail, SMS ou WhatsApp ne sont envoyées qu’aux personnes ayant coché expressément la case prévue à cet effet dans le formulaire, conformément à l’article 30A de la loi israélienne sur les communications (télécommunications et radiodiffusion). Chaque message permet de se désinscrire, et vous pouvez demander à tout moment à ne plus en recevoir.</p>
        <h2>6. Destinataires des informations</h2>
        <p>Les informations sont destinées à l’équipe de MS Group Global et de M.S GROUP pour le traitement de votre demande. S’il faut transmettre vos coordonnées au promoteur d’un projet à l’étranger pour répondre à votre demande, nous ne le ferons qu’après vous avoir indiqué le destinataire et la finalité, et dans le respect de la loi. Des informations peuvent aussi être communiquées sur réquisition légale valable.</p>
        <h2>7. Services tiers et données techniques</h2>
        <p>Le site charge des polices depuis Google Fonts, ce qui peut transmettre à ce prestataire votre adresse IP et des informations sur votre navigateur. L’hébergeur du site peut traiter des données techniques, comme l’adresse IP et les heures de connexion, pour faire fonctionner et sécuriser le site. Une vidéo de projet intégrée depuis YouTube ne se charge qu’après un clic sur le bouton de lecture, en mode de confidentialité renforcée (youtube-nocookie.com) ; dès sa lecture, la politique de confidentialité de Google s’applique. Le site n’utilise actuellement aucun outil de suivi ni pixel publicitaire. La présente politique sera mise à jour avant toute utilisation de tels outils.</p>
        <h2>8. Conservation et sécurité</h2>
        <p>Les informations ne sont conservées que le temps nécessaire au traitement de votre demande et à nos échanges, ou selon les exigences légales. Nous prenons des mesures raisonnables pour les sécuriser, notamment en limitant leur accès aux personnes qui en ont besoin.</p>
        <h2>9. Vos droits</h2>
        <p>En vertu de la loi sur la protection de la vie privée, vous pouvez consulter les informations vous concernant, demander la rectification d’informations inexactes, incomplètes, ambiguës ou obsolètes, et demander leur suppression ou l’arrêt de leur utilisation à des fins de prospection, dans les limites de la loi. Pour toute demande, contactez-nous {contact('fr')}.</p>
        <h2>10. Modifications</h2>
        <p>Nous pouvons mettre à jour la présente politique. La date de la dernière mise à jour figure en haut de cette page.</p>'''),
 ('en', 'accessibility'): ('Accessibility statement', lambda: f'''
        <p>MS Group Global believes in providing equal service to all clients, and works to make this website accessible in accordance with Israel’s Equal Rights for Persons with Disabilities Law, 5758-1998, and the Equal Rights for Persons with Disabilities (Service Accessibility Adjustments) Regulations, 5773-2013.</p>
        <p>The website’s accessibility adjustments aim to meet Israeli Standard SI 5568 at level AA. Automated checks against WCAG 2.1 level AA (the axe tool) and display checks on desktop and mobile have been carried out. These checks do not confirm full compliance with the standard, and a comprehensive manual review with screen readers and a professional accessibility audit have not yet been completed.</p>
        <h2>Accessibility adjustments on this website</h2>
        <ul>
          <li>Full keyboard navigation, with a clearly visible focus indicator.</li>
          <li>A “Skip to content” link at the top of every page.</li>
          <li>A hierarchical heading structure and structural landmarks (header, main content, footer).</li>
          <li>Text alternatives for meaningful images.</li>
          <li>Labels for every form field, and clear error messages next to the field.</li>
          <li>Colour contrast between text and background in line with the standard.</li>
          <li>A button to pause the opening animations, and respect for the operating system’s “reduce motion” setting.</li>
          <li>Layouts for desktop, tablet and mobile, and support for browser text zoom.</li>
          <li>Project selection through tabs that also work with the arrow keys.</li>
          <li>The website is available in Hebrew, English and French, with the correct language and reading direction declared on every page.</li>
        </ul>
        <h2>Known limitations</h2>
        <p>Some parts of the website are not yet fully accessible. The project films (Wyndham Garden Gonio, Azure by Lapis, PONTUS Gonio, La Quinta by Wyndham, Blue Sky Tower, SORA Beach Residence, One Central and OMYA Residence) do not currently have captions or a full text description. The press coverage is in Hebrew. Project renderings are images, and their full details are provided in the consultation. We are working to improve accessibility, and you can contact us to receive information in an accessible format.</p>
        <h2>Accessibility enquiries</h2>
        <!-- SLOT: name of the accessibility coordinator, if the company appoints one -->
        <p>Have you come across an accessibility problem, or do you need information in an accessible format? We are happy to help. Contact us {contact('en')}. We will do our best to reply to every enquiry promptly.</p>
        <h2>Office accessibility</h2>
        <p>Our offices are at {ADDR['en']}. To find out about accessibility at the office and arrange adjustments before a visit, call us on {TEL['en']}.</p>
        <p class="legal__updated">This accessibility statement was updated on 14 November 2026.</p>'''),
 ('fr', 'accessibility'): ('Déclaration d’accessibilité', lambda: f'''
        <p>MS Group Global attache une grande importance à l’égalité de service pour tous ses clients et s’attache à rendre ce site accessible, conformément à la loi israélienne sur l’égalité des droits des personnes handicapées de 1998 (5758-1998) et à ses règlements relatifs à l’accessibilité des services de 2013 (5773-2013).</p>
        <p>Les aménagements d’accessibilité du site visent la conformité à la norme israélienne SI 5568 au niveau AA. Des tests automatisés selon les WCAG 2.1 niveau AA (outil axe) et des vérifications d’affichage sur ordinateur et mobile ont été réalisés. Ces tests ne valent pas attestation de conformité totale, et un examen manuel complet avec lecteurs d’écran ainsi qu’un audit professionnel n’ont pas encore été menés.</p>
        <h2>Aménagements réalisés sur le site</h2>
        <ul>
          <li>Navigation complète au clavier, avec un indicateur de focus bien visible.</li>
          <li>Un lien « Aller au contenu » en haut de chaque page.</li>
          <li>Une structure de titres hiérarchisée et des repères de structure (en-tête, contenu principal, pied de page).</li>
          <li>Des alternatives textuelles pour les images porteuses de sens.</li>
          <li>Des étiquettes pour chaque champ du formulaire et des messages d’erreur clairs à côté du champ.</li>
          <li>Un contraste de couleurs entre le texte et le fond conforme à la norme.</li>
          <li>Un bouton pour mettre en pause les animations d’ouverture, et le respect du réglage « réduire les animations » du système.</li>
          <li>Un affichage adapté à l’ordinateur, à la tablette et au téléphone, et la prise en charge du zoom du navigateur.</li>
          <li>Une sélection des projets par onglets, utilisable aussi avec les touches fléchées.</li>
          <li>Le site est disponible en hébreu, en anglais et en français, avec la langue et le sens de lecture déclarés sur chaque page.</li>
        </ul>
        <h2>Limites connues</h2>
        <p>Certaines parties du site ne sont pas encore entièrement accessibles. Les vidéos des projets (Wyndham Garden Gonio, Azure by Lapis, PONTUS Gonio, La Quinta by Wyndham, Blue Sky Tower, SORA Beach Residence, One Central et OMYA Residence) ne disposent pas encore de sous-titres ni d’une description textuelle complète. Les reportages de presse sont en hébreu. Les perspectives des projets sont des images, et leurs détails complets sont présentés lors du rendez-vous. Nous travaillons à améliorer l’accessibilité, et vous pouvez nous contacter pour obtenir les informations dans un format accessible.</p>
        <h2>Contact accessibilité</h2>
        <!-- SLOT: name of the accessibility coordinator, if the company appoints one -->
        <p>Vous avez rencontré un problème d’accessibilité ou avez besoin d’informations dans un format accessible ? Nous serons heureux de vous aider. Contactez-nous {contact('fr')}. Nous nous efforçons de répondre rapidement à chaque demande.</p>
        <h2>Accessibilité des bureaux</h2>
        <p>Nos bureaux se trouvent {ADDR['fr'].replace('Tour', 'dans la tour', 1)}. Pour vous renseigner sur l’accessibilité des locaux et organiser des aménagements avant une visite, appelez-nous au {TEL['fr']}.</p>
        <p class="legal__updated">Déclaration d’accessibilité mise à jour le 14 novembre 2026.</p>'''),
 ('en', 'terms'): ('Terms of use', lambda: f'''
        <p class="legal__updated">Updated: 14 November 2026</p>
        <h2>1. General</h2>
        <p>This website is operated by MS Group Global, a subsidiary of M.S GROUP, and presents information about support services for real-estate investment abroad and about selected projects. Use of the website is subject to these terms and to the privacy policy.</p>
        <h2>2. The information on this website is not investment advice</h2>
        <p>The information on this website, including market data, yields and prices, is general information gathered from public sources. It is not investment, legal or tax advice, nor a recommendation to buy any particular property. Yields shown are gross, before costs and taxes, and are not guaranteed. Past performance is no indication of future results. Investing in real estate abroad involves risks, including changes in exchange rates, regulation, market conditions and security in the destination country. We recommend consulting qualified professionals before making any decision.</p>
        <h2>3. Renderings and project details</h2>
        <p>Renderings on the website are for illustration only and are not binding. The descriptions, specifications, prices and delivery dates of each project are set solely in the developer’s documents and the purchase agreement, and may change.</p>
        <h2>4. Intellectual property</h2>
        <p>All rights in the website’s content, including its design, texts, logos and code, belong to MS Group Global and M.S GROUP, except for project renderings and films, the rights to which belong to the developers of those projects. The content may not be copied, distributed or used commercially without written permission.</p>
        <h2>5. Liability</h2>
        <p>We work to keep the information on this website accurate and up to date, but it may contain errors or change. The company accepts no liability for damage caused by relying on information on the website without further verification with a company representative and the project documents.</p>
        <h2>6. Links to other websites</h2>
        <p>The website may contain links to third-party websites. We are not responsible for their content or privacy policies.</p>
        <h2>7. Governing law and jurisdiction</h2>
        <p>Use of the website is governed by the laws of the State of Israel, and the competent courts of Tel Aviv-Jaffa have exclusive jurisdiction.</p>
        <h2>8. Contact</h2>
        <p>For questions about these terms, contact us {contact('en')}.</p>'''),
 ('fr', 'terms'): ('Conditions d’utilisation', lambda: f'''
        <p class="legal__updated">Mise à jour : 14 novembre 2026</p>
        <h2>1. Généralités</h2>
        <p>Ce site est exploité par MS Group Global, filiale de M.S GROUP, et présente des informations sur ses services d’accompagnement à l’investissement immobilier à l’étranger et sur des projets sélectionnés. Son utilisation est soumise aux présentes conditions et à la politique de confidentialité.</p>
        <h2>2. Les informations du site ne constituent pas un conseil en investissement</h2>
        <p>Les informations publiées sur le site, y compris les données de marché, les rendements et les prix, sont des informations générales issues de sources publiques. Elles ne constituent ni un conseil en investissement, ni un conseil juridique ou fiscal, ni une recommandation d’acheter un bien donné. Les rendements indiqués sont bruts, avant charges et impôts, et ne sont pas garantis. Les performances passées ne préjugent pas des performances futures. Investir dans l’immobilier à l’étranger comporte des risques, notamment liés aux taux de change, à la réglementation, à la conjoncture et à la situation sécuritaire du pays de destination. Il est recommandé de consulter des professionnels qualifiés avant toute décision.</p>
        <h2>3. Perspectives et détails des projets</h2>
        <p>Les perspectives présentées sur le site sont fournies à titre d’illustration et ne sont pas contractuelles. Les descriptions, spécifications, prix et dates de livraison de chaque projet sont fixés exclusivement par les documents du promoteur et le contrat d’acquisition, et peuvent évoluer.</p>
        <h2>4. Propriété intellectuelle</h2>
        <p>Tous les droits sur le contenu du site, y compris le design, les textes, les logos et le code, appartiennent à MS Group Global et à M.S GROUP, à l’exception des perspectives et vidéos des projets, dont les droits appartiennent à leurs promoteurs respectifs. Toute copie, diffusion ou utilisation commerciale sans autorisation écrite est interdite.</p>
        <h2>5. Responsabilité</h2>
        <p>Nous veillons à l’exactitude et à l’actualité des informations du site, mais celles-ci peuvent contenir des erreurs ou évoluer. La société décline toute responsabilité pour un dommage résultant de l’utilisation d’informations du site sans vérification complémentaire auprès d’un représentant de la société et des documents du projet.</p>
        <h2>6. Liens vers d’autres sites</h2>
        <p>Le site peut contenir des liens vers des sites tiers. Nous ne sommes pas responsables de leur contenu ni de leur politique de confidentialité.</p>
        <h2>7. Droit applicable et juridiction</h2>
        <p>L’utilisation du site est régie par le droit de l’État d’Israël, et les tribunaux compétents de Tel-Aviv-Jaffa ont compétence exclusive.</p>
        <h2>8. Contact</h2>
        <p>Pour toute question sur les présentes conditions, contactez-nous {contact('fr')}.</p>'''),
}

def french_typography(t):
    parts = re.split(r'(<[^>]+>)', t)
    for i, p in enumerate(parts):
        if p.startswith('<'):
            continue
        p = re.sub(r' ([:])', NB + r'\1', p)
        p = re.sub(r' ([;!?])', NN + r'\1', p)
        p = p.replace('« ', '«' + NB).replace(' »', NB + '»')
        parts[i] = p
    return ''.join(parts)

def page(lang, name):
    title, body = BODY[(lang, name)]
    u = UI[lang]
    file = f'{name}.html'
    html = f'''<!doctype html>
<html lang="{lang}" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{title} | MS Group Global</title>
  <meta name="theme-color" content="#0c1d40">
  {alternates(lang, file)}
  <link rel="icon" href="../assets/img/favicon.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&family=Frank+Ruhl+Libre:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/site.css">
</head>
<body>
  <a class="skip" href="#main">{u['skip']}</a>
  <header class="nav is-solid">
    <div class="nav__inner">
      <a class="brand" href="index.html" aria-label="{u['home_label']}">
        <img class="brand__logo" src="../assets/img/msgroup-logo.png" alt="" width="494" height="191">
        <span class="brand__global">GLOBAL</span>
      </a>
      {switcher(lang, file)}
      <a class="btn btn--small" href="index.html#contact">{u['cta']}</a>
    </div>
  </header>
  <main id="main" class="legal">
    <div class="wrap">
      <h1 class="h2">{title}</h1>
      <div class="legal__body">
        <p class="legal__note">{u['note'].format(file=file)}</p>{body()}
      </div>
      <a class="link legal__back" href="index.html">{u['back']}</a>
    </div>
  </main>
  <footer class="footer">
    <div class="wrap footer__inner">
      <nav class="footer__legal" aria-label="{u['legal']}">
        <a href="privacy.html">{u['p']}</a>
        <a href="accessibility.html">{u['a']}</a>
        <a href="terms.html">{u['t']}</a>
      </nav>
      <p class="footer__small">{u['copy']}</p>
    </div>
  </footer>
</body>
</html>
'''
    if lang == 'fr':
        html = french_typography(html)
    (ROOT / lang / file).write_text(html, encoding='utf-8')
    print(f'{lang}/{file}')

for lang in ('en', 'fr'):
    (ROOT / lang).mkdir(exist_ok=True)
    for name in PAGES:
        page(lang, name)

# Hebrew legal pages: switcher in the header, alternates in the head
for name in PAGES:
    p = ROOT / f'{name}.html'
    s = p.read_text(encoding='utf-8')
    s = re.sub(r'\s*<nav class="lang".*?</nav>', '', s, flags=re.S)
    s = re.sub(r'\s*<link rel="alternate" hreflang="[^"]+" href="[^"]*">', '', s)
    s = s.replace('<a class="btn btn--small" href="index.html#contact" style="margin-inline-start:auto">',
                  '<a class="btn btn--small" href="index.html#contact">')
    s = s.replace('      <a class="btn btn--small" href="index.html#contact">',
                  '      ' + switcher('he', f'{name}.html') + '\n      <a class="btn btn--small" href="index.html#contact">', 1)
    s = s.replace('  <link rel="icon"', '  ' + alternates('he', f'{name}.html') + '\n  <link rel="icon"', 1)
    p.write_text(s, encoding='utf-8')
    print(f'{name}.html (he) updated')
