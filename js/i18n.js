/* =========================================================================
   THEMAJORD'HOME — i18n (PT / EN / FR)
   Single source of truth for every translated string on the site.
   - UI: static interface text (nav, buttons, section titles, form labels...)
   - AMENITY_CATEGORIES / AMENITY_ITEMS: shared vocabulary reused across
     every apartment's amenities list
   - NEARBY_LABELS: translations for the generic part of "nearby" points of
     interest (proper nouns like street/square names are left untranslated)
   - PROPERTY_TRANSLATIONS: per-apartment overlay (subtitle / description /
     neighborhood) for pt and fr. English is the base language already
     written in js/properties-data.js, so there is no "en" entry here.
   ========================================================================= */

(function () {

  var STORAGE_KEY = 'majordhome_lang';
  var SUPPORTED = ['pt', 'en', 'fr'];
  var DEFAULT_LANG = 'pt';
  var listeners = [];

  /* ---------------------------------------------------------------------
     Static interface strings
     --------------------------------------------------------------------- */
  var UI = {
    'nav.stay': { pt: 'Alojamento', en: 'Accommodation', fr: 'Hébergement' },
    'nav.concierge': { pt: 'Concierge', en: 'Concierge', fr: 'Conciergerie' },
    'nav.cleaning': { pt: 'Limpeza & Manutenção', en: 'Cleaning & Maintenance', fr: 'Ménage & Entretien' },
    'nav.about': { pt: 'Sobre', en: 'About', fr: 'À propos' },
    'nav.owners': { pt: 'Área de Proprietários', en: "Owners' Area", fr: 'Espace Propriétaires' },
    'aria.openMenu': { pt: 'Abrir menu', en: 'Open menu', fr: 'Ouvrir le menu' },
    'aria.prevSlide': { pt: 'Anterior', en: 'Previous', fr: 'Précédent' },
    'aria.nextSlide': { pt: 'Seguinte', en: 'Next', fr: 'Suivant' },
    'aria.close': { pt: 'Fechar', en: 'Close', fr: 'Fermer' },
    'aria.pauseSlideshow': { pt: 'Pausar apresentação', en: 'Pause slideshow', fr: 'Mettre en pause' },
    'aria.playSlideshow': { pt: 'Retomar apresentação', en: 'Play slideshow', fr: 'Reprendre' },
    'aria.goToSlide': { pt: 'Ir para o slide', en: 'Go to slide', fr: 'Aller à la diapositive' },

    'unit.bedroom.singular': { pt: 'quarto', en: 'bedroom', fr: 'chambre' },
    'unit.bedroom.plural': { pt: 'quartos', en: 'bedrooms', fr: 'chambres' },
    'unit.guest.singular': { pt: 'hóspede', en: 'guest', fr: 'voyageur' },
    'unit.guest.plural': { pt: 'hóspedes', en: 'guests', fr: 'voyageurs' },
    'unit.bed.singular': { pt: 'cama', en: 'bed', fr: 'lit' },
    'unit.bed.plural': { pt: 'camas', en: 'beds', fr: 'lits' },
    'unit.bathroom.singular': { pt: 'casa de banho', en: 'bathroom', fr: 'salle de bain' },
    'unit.bathroom.plural': { pt: 'casas de banho', en: 'bathrooms', fr: 'salles de bain' },
    'unit.studio': { pt: 'Estúdio', en: 'Studio', fr: 'Studio' },

    'hero.cta': { pt: 'Ver apartamento →', en: 'View apartment →', fr: "Voir l'appartement →" },
    'hero.s0.tail': { pt: '167 m² · Pátio & jardim privado', en: '167 m² · Patio & private garden', fr: '167 m² · Patio & jardin privé' },
    'hero.s1.tail': { pt: 'Casa junto à Foz Velha · Terraço com vista mar', en: 'Seaside house in Foz Velha · Ocean-view terrace', fr: 'Maison en bord de mer à Foz Velha · Terrasse vue mer' },
    'hero.s2.tail': { pt: 'Moradia inteira · ★4,79 (19)', en: 'Whole house · ★4.79 (19)', fr: 'Maison entière · ★4,79 (19)' },
    'hero.s3.tail': { pt: '35 m² · Perto da Praça dos Poveiros', en: '35 m² · Near Praça dos Poveiros', fr: '35 m² · Près de la Praça dos Poveiros' },
    'hero.s4.tail': { pt: '106 m² · Duplex renovado', en: '106 m² · Renovated duplex', fr: '106 m² · Duplex rénové' },
    'hero.s5.tail': { pt: '53 m² · Teto pintado de época', en: '53 m² · Hand-painted period ceiling', fr: "53 m² · Plafond peint d'époque" },
    'hero.s6.tail': { pt: '40 m² · A 2 min do Metro Trindade', en: '40 m² · 2 min from Trindade metro', fr: '40 m² · À 2 min du métro Trindade' },
    'hero.s7.tail': { pt: 'Pátio privado · ★5,0 (4)', en: 'Private patio · ★5.0 (4)', fr: 'Patio privé · ★5,0 (4)' },
    'hero.s8.tail': { pt: 'Duplex loft · Perto do Metro Heroísmo', en: 'Duplex loft · Near Heroísmo metro', fr: 'Duplex loft · Près du métro Heroísmo' },

    'booking.checkin': { pt: 'Check-in', en: 'Check-in', fr: 'Arrivée' },
    'booking.checkout': { pt: 'Check-out', en: 'Check-out', fr: 'Départ' },
    'booking.guestsLabel': { pt: 'Hóspedes', en: 'Guests', fr: 'Voyageurs' },
    'booking.guests.1': { pt: '1 hóspede', en: '1 guest', fr: '1 voyageur' },
    'booking.guests.2': { pt: '2 hóspedes', en: '2 guests', fr: '2 voyageurs' },
    'booking.guests.3': { pt: '3 hóspedes', en: '3 guests', fr: '3 voyageurs' },
    'booking.guests.4': { pt: '4 hóspedes', en: '4 guests', fr: '4 voyageurs' },
    'booking.guests.5plus': { pt: '5+ hóspedes', en: '5+ guests', fr: '5+ voyageurs' },
    'booking.cta': { pt: 'Verificar disponibilidade', en: 'Check availability', fr: 'Vérifier la disponibilité' },
    'booking.note': { pt: 'Disponibilidade em tempo real chega em breve, ligada diretamente ao nosso sistema de gestão.', en: 'Real-time availability is coming soon, connected directly to our management system.', fr: 'La disponibilité en temps réel arrive bientôt, connectée directement à notre système de gestion.' },
    'booking.alert': { pt: 'A pesquisa de disponibilidade em tempo real será ligada ao Beds24 na próxima fase do projeto.', en: 'Real-time availability search will be connected to Beds24 in the next phase of the project.', fr: 'La recherche de disponibilité en temps réel sera connectée à Beds24 lors de la prochaine phase du projet.' },

    'booking.adultsLabel': { pt: 'Adultos', en: 'Adults', fr: 'Adultes' },
    'booking.childrenLabel': { pt: 'Crianças', en: 'Children', fr: 'Enfants' },
    'booking.adultsWord.singular': { pt: 'adulto', en: 'adult', fr: 'adulte' },
    'booking.adultsWord.plural': { pt: 'adultos', en: 'adults', fr: 'adultes' },
    'booking.childrenWord.singular': { pt: 'criança', en: 'child', fr: 'enfant' },
    'booking.childrenWord.plural': { pt: 'crianças', en: 'children', fr: 'enfants' },
    'booking.guests.total': { pt: '{n} hóspedes no total · capacidade máxima do alojamento: {max}', en: '{n} guests in total · maximum capacity: {max}', fr: '{n} voyageurs au total · capacité maximale : {max}' },
    'booking.guests.over': { pt: '{n} hóspedes excede a capacidade máxima deste alojamento ({max}).', en: '{n} guests exceeds this property\'s maximum capacity ({max}).', fr: '{n} voyageurs dépasse la capacité maximale de ce logement ({max}).' },
    'booking.guests.overAlert': { pt: 'Este alojamento tem capacidade para {max} hóspedes — reduz o número de adultos/crianças antes de continuar.', en: 'This property has a maximum capacity of {max} guests — reduce the number of adults/children before continuing.', fr: 'Ce logement a une capacité maximale de {max} voyageurs — réduisez le nombre d\'adultes/enfants avant de continuer.' },
    'booking.babyKit.need': { pt: 'Preciso de kit de bebé — 25€', en: 'I need a baby kit — €25', fr: "J'ai besoin d'un kit bébé — 25 €" },
    'booking.babyKit.contents': { pt: 'Inclui: cadeira alta, banheira, roupa de cama, cama de bebé e toalhas.', en: 'Includes: high chair, bathtub, linen, crib and towels.', fr: 'Comprend : chaise haute, baignoire, linge de lit, lit bébé et serviettes.' },
    'booking.phone': { pt: 'Telefone', en: 'Phone', fr: 'Téléphone' },
    'booking.transfer.need': { pt: 'Preciso de transfer (aeroporto)', en: 'I need an airport transfer', fr: 'J\'ai besoin d\'un transfert (aéroport)' },
    'booking.transfer.vehicle': { pt: 'Veículo', en: 'Vehicle', fr: 'Véhicule' },
    'booking.transfer.carOption': { pt: 'Carro — 25€', en: 'Car — €25', fr: 'Voiture — 25 €' },
    'booking.transfer.vanOption': { pt: 'Van (grupos) — 50€', en: 'Van (groups) — €50', fr: 'Van (groupes) — 50 €' },
    'booking.flight.number': { pt: 'Nº do voo', en: 'Flight number', fr: 'N° de vol' },
    'booking.flight.arrival': { pt: 'Chegada', en: 'Arrival', fr: 'Arrivée' },

    'services.heading': { pt: 'Mais do que<br>uma estadia.', en: 'More than<br>a stay.', fr: "Plus qu'<br>un séjour." },
    'services.sub': { pt: "A TheMajord'Home cuida de cada detalhe — do check-in à última toalha dobrada — para hóspedes e para proprietários.", en: "TheMajord'Home takes care of every detail — from check-in to the last folded towel — for guests and for owners.", fr: "TheMajord'Home s'occupe de chaque détail — du check-in à la dernière serviette pliée — pour les voyageurs et les propriétaires." },
    'services.1.title': { pt: 'Gestão de Alojamento', en: 'Property Management', fr: 'Gestion Locative' },
    'services.1.desc': { pt: 'Do anúncio à faturação: gerimos o seu imóvel em todas as plataformas.', en: 'From the listing to the invoice: we manage your property across every platform.', fr: "De l'annonce à la facturation : nous gérons votre bien sur toutes les plateformes." },
    'services.2.title': { pt: 'Concierge', en: 'Concierge', fr: 'Conciergerie' },
    'services.2.desc': { pt: 'Check-in pessoal, recomendações locais e assistência para os hóspedes, das 9h às 23h.', en: 'Personal check-in, local recommendations and guest assistance, from 9am to 11pm.', fr: 'Accueil personnalisé, recommandations locales et assistance aux voyageurs, de 9h à 23h.' },
    'services.3.title': { pt: 'Limpeza & Lavandaria', en: 'Cleaning & Laundry', fr: 'Ménage & Blanchisserie' },
    'services.3.desc': { pt: 'Equipa própria, protocolos de hotelaria entre cada estadia.', en: 'In-house team, hotel-grade protocols between every stay.', fr: 'Équipe interne, protocoles hôteliers entre chaque séjour.' },
    'services.4.title': { pt: 'Manutenção', en: 'Maintenance', fr: 'Entretien' },
    'services.4.desc': { pt: 'Rede de profissionais de confiança para qualquer imprevisto, a qualquer hora.', en: 'A trusted network of professionals for any issue, at any hour.', fr: 'Un réseau de professionnels de confiance pour tout imprévu, à toute heure.' },
    'services.more': { pt: 'Saber mais →', en: 'Learn more →', fr: 'En savoir plus →' },

    'collection.heading': { pt: 'A coleção', en: 'The Collection', fr: 'La Collection' },
    'collection.viewAll': { pt: 'Ver todos os apartamentos →', en: 'View all apartments →', fr: 'Voir tous les appartements →' },
    'collection.badgeFeatured': { pt: 'Destaque', en: 'Featured', fr: 'Coup de cœur' },
    'collection.fullHeading': { pt: 'A coleção completa', en: 'The full collection', fr: 'La collection complète' },
    'collection.countSuffix': { pt: 'moradas no Porto', en: 'addresses in Porto', fr: 'adresses à Porto' },
    'collection.page': { pt: 'Página', en: 'Page', fr: 'Page' },
    'common.from': { pt: 'desde', en: 'from', fr: 'dès' },

    'trust.eyebrow': { pt: "Porquê a TheMajord'Home", en: "Why TheMajord'Home", fr: "Pourquoi TheMajord'Home" },
    'trust.heading': { pt: 'Cada imóvel é visitado, cada estadia é acompanhada.', en: 'Every property is visited, every stay is looked after.', fr: 'Chaque bien est visité, chaque séjour est accompagné.' },
    'trust.1.title': { pt: 'Curadoria pessoal', en: 'Personal curation', fr: 'Curation personnelle' },
    'trust.1.desc': { pt: 'Nenhum imóvel entra na coleção sem uma visita da nossa equipa. Design, localização e conforto, sempre verificados.', en: 'No property joins the collection without a visit from our team. Design, location and comfort, always verified.', fr: 'Aucun bien ne rejoint la collection sans une visite de notre équipe. Design, emplacement et confort, toujours vérifiés.' },
    'trust.2.title': { pt: 'Presença local, das 9h às 23h', en: 'Local presence, 9am–11pm', fr: 'Présence locale, de 9h à 23h' },
    'trust.2.desc': { pt: 'Estamos no Porto — não numa central de apoio distante. Qualquer questão tem resposta humana e rápida.', en: "We're based in Porto — not in a distant call centre. Any question gets a fast, human answer.", fr: "Nous sommes à Porto — pas dans un centre d'appel lointain. Chaque question obtient une réponse humaine et rapide." },
    'trust.3.title': { pt: 'Gestão sem esforço', en: 'Effortless management', fr: 'Une gestion sans effort' },
    'trust.3.desc': { pt: 'Para proprietários: um único ponto de contacto para reservas, hóspedes, limpeza e manutenção — em todas as plataformas.', en: 'For owners: a single point of contact for bookings, guests, cleaning and maintenance — across every platform.', fr: 'Pour les propriétaires : un seul interlocuteur pour les réservations, les voyageurs, le ménage et l\'entretien — sur toutes les plateformes.' },
    'testimonials.eyebrow': { pt: 'O que dizem os hóspedes', en: 'What guests say', fr: 'Ce que disent les voyageurs' },
    'testimonials.heading': { pt: 'Estadias que ficam na memória.', en: 'Stays worth remembering.', fr: 'Des séjours dont on se souvient.' },

    'owner.eyebrow': { pt: 'Para proprietários', en: 'For owners', fr: 'Pour les propriétaires' },
    'owner.heading': { pt: 'O seu imóvel, geríamos como se fosse nosso.', en: "Your property, managed like it's our own.", fr: "Votre bien, géré comme s'il était le nôtre." },
    'owner.desc': { pt: 'Booking, Airbnb, Abritel — um só painel, uma só equipa a tratar de tudo, do anúncio à última toalha dobrada.', en: 'Booking, Airbnb, Abritel — one dashboard, one team handling everything, from the listing to the last folded towel.', fr: "Booking, Airbnb, Abritel — un seul tableau de bord, une seule équipe qui s'occupe de tout, de l'annonce à la dernière serviette pliée." },
    'owner.cta': { pt: 'Pedir avaliação', en: 'Request assessment', fr: 'Demander une évaluation' },

    'owner.breadcrumb': { pt: 'Proprietários', en: 'Owners', fr: 'Propriétaires' },
    'owner.page.heading': { pt: 'Junte-se à TheMajord\'Home', en: 'Join TheMajord\'Home', fr: 'Rejoignez TheMajord\'Home' },
    'owner.page.intro': { pt: 'Se tem um apartamento ou casa no Porto e quer que seja gerido com o mesmo cuidado que teria você mesmo, é para isso que existimos. Da publicação à limpeza, das reservas ao check-in, tratamos de tudo — para que o seu imóvel gere rendimento sem lhe ocupar tempo.', en: 'If you have an apartment or house in Porto and want it managed with the same care you\'d give it yourself, that\'s exactly what we do. From listing to cleaning, from bookings to check-in, we take care of everything — so your property earns without taking up your time.', fr: 'Si vous avez un appartement ou une maison à Porto et souhaitez qu\'il soit géré avec le même soin que vous y apporteriez vous-même, c\'est exactement notre métier. De l\'annonce au ménage, des réservations au check-in, nous nous occupons de tout — pour que votre bien génère des revenus sans vous prendre de temps.' },

    'owner.gallery.heading': { pt: 'O padrão da nossa coleção', en: 'The standard of our collection', fr: 'Le niveau de notre collection' },
    'owner.gallery.sub': { pt: 'Uma amostra dos alojamentos que já gerimos no Porto — é este o cuidado que também damos ao seu.', en: 'A sample of the properties we already manage in Porto — this is the same care we bring to yours.', fr: 'Un aperçu des logements que nous gérons déjà à Porto — le même soin que nous apporterons au vôtre.' },
    'owner.why.heading': { pt: 'Cuidamos do seu imóvel como se fosse nosso.', en: 'We look after your property like it\'s our own.', fr: 'Nous prenons soin de votre bien comme s\'il était le nôtre.' },
    'owner.why.sub': { pt: 'Sem letras miúdas, sem surpresas — só um processo claro, pensado para quem confia a sua casa a uma equipa de confiança.', en: 'No small print, no surprises — just a clear process, built for owners who trust their home to a team they can rely on.', fr: 'Pas de petites lignes, pas de surprises — juste un processus clair, pensé pour les propriétaires qui confient leur maison à une équipe de confiance.' },

    'owner.benefit1.title': { pt: 'Um só painel, todas as plataformas', en: 'One dashboard, every platform', fr: 'Un seul tableau de bord, toutes les plateformes' },
    'owner.benefit1.desc': { pt: 'Gerimos o seu anúncio em simultâneo no Booking, Airbnb e Abritel — um único calendário, sem overbooking, um único ponto de contacto para si.', en: 'We manage your listing on Booking, Airbnb and Abritel at the same time — one calendar, no overbooking, a single point of contact for you.', fr: 'Nous gérons votre annonce simultanément sur Booking, Airbnb et Abritel — un seul calendrier, sans surréservation, un seul interlocuteur pour vous.' },
    'owner.benefit2.title': { pt: 'Hóspedes verificados', en: 'Verified guests', fr: 'Voyageurs vérifiés' },
    'owner.benefit2.desc': { pt: 'Cada reserva passa pelo nosso processo de verificação, para que saiba sempre quem fica em sua casa.', en: 'Every booking goes through our verification process, so you always know who is staying in your home.', fr: 'Chaque réservation passe par notre processus de vérification, pour que vous sachiez toujours qui séjourne chez vous.' },
    'owner.benefit3.title': { pt: 'Imóvel protegido', en: 'A protected property', fr: 'Un bien protégé' },
    'owner.benefit3.desc': { pt: 'O seu imóvel fica coberto por um seguro de danos durante as estadias que gerimos, para que possa descansar tranquilo.', en: 'Your property is covered by damage insurance during the stays we manage, so you can rest easy.', fr: 'Votre bien est couvert par une assurance dommages pendant les séjours que nous gérons, pour que vous puissiez rester tranquille.' },
    'owner.benefit4.title': { pt: 'Sempre por perto', en: 'Always close by', fr: 'Toujours disponibles' },
    'owner.benefit4.desc': { pt: 'A nossa equipa está disponível das 9h às 23h, todos os dias, para si e para os seus hóspedes.', en: 'Our team is available from 9am to 11pm, every day, for you and for your guests.', fr: 'Notre équipe est disponible de 9h à 23h, tous les jours, pour vous et pour vos voyageurs.' },

    'owner.how.heading': { pt: 'Como funciona', en: 'How it works', fr: 'Comment ça marche' },
    'owner.how.sub': { pt: 'Do primeiro contacto à primeira reserva, sem complicações.', en: 'From first contact to first booking, without the hassle.', fr: 'Du premier contact à la première réservation, sans complications.' },
    'owner.step1.title': { pt: 'Avaliação gratuita', en: 'Free assessment', fr: 'Évaluation gratuite' },
    'owner.step1.desc': { pt: 'Visitamos o imóvel (ou analisamos à distância) e damos-lhe uma estimativa realista do potencial de rendimento.', en: 'We visit the property (or assess it remotely) and give you a realistic estimate of its earning potential.', fr: 'Nous visitons le bien (ou l\'évaluons à distance) et vous donnons une estimation réaliste de son potentiel de revenus.' },
    'owner.step2.title': { pt: 'Preparação e publicação', en: 'Preparation and listing', fr: 'Préparation et publication' },
    'owner.step2.desc': { pt: 'Tratamos das fotografias, do texto do anúncio e da publicação nas plataformas certas para o seu imóvel.', en: 'We take care of the photography, the listing copy, and publishing on the right platforms for your property.', fr: 'Nous nous occupons des photos, du texte de l\'annonce et de la publication sur les plateformes adaptées à votre bien.' },
    'owner.step3.title': { pt: 'Gestão contínua', en: 'Ongoing management', fr: 'Gestion continue' },
    'owner.step3.desc': { pt: 'Reservas, check-in, limpeza, manutenção e comunicação com os hóspedes — nós tratamos de tudo, dia a dia.', en: 'Bookings, check-in, cleaning, maintenance and guest communication — we take care of it all, day to day.', fr: 'Réservations, check-in, ménage, entretien et communication avec les voyageurs — nous nous occupons de tout, au quotidien.' },

    'owner.finalCta.heading': { pt: 'Vamos falar sobre o seu imóvel?', en: 'Let\'s talk about your property?', fr: 'Parlons de votre bien ?' },
    'owner.finalCta.desc': { pt: 'Sem compromisso — só uma conversa sobre o potencial da sua casa no Porto.', en: 'No commitment — just a conversation about your Porto home\'s potential.', fr: 'Sans engagement — juste une conversation sur le potentiel de votre bien à Porto.' },
    'owner.learnMore': { pt: 'Saiba como funciona', en: 'See how it works', fr: 'Découvrez comment ça marche' },

    'footer.tag': { pt: 'Gestão de alojamento local e concierge no Porto — para hóspedes que procuram carácter, e proprietários que procuram tranquilidade.', en: 'Local accommodation management and concierge in Porto — for guests seeking character, and owners seeking peace of mind.', fr: 'Gestion locative et conciergerie à Porto — pour les voyageurs en quête de caractère, et les propriétaires en quête de tranquillité.' },
    'footer.explore': { pt: 'Explorar', en: 'Explore', fr: 'Explorer' },
    'footer.services': { pt: 'Serviços', en: 'Services', fr: 'Services' },
    'footer.aboutUs': { pt: 'Sobre nós', en: 'About us', fr: 'À propos' },
    'footer.owners': { pt: 'Proprietários', en: 'Owners', fr: 'Propriétaires' },
    'footer.becomePartner': { pt: 'Torne-se parceiro', en: 'Become a partner', fr: 'Devenir partenaire' },
    'footer.membersArea': { pt: 'Área reservada', en: 'Members area', fr: 'Espace réservé' },
    'footer.faq': { pt: 'Perguntas frequentes', en: 'FAQ', fr: 'Questions fréquentes' },
    'footer.contact': { pt: 'Contacto', en: 'Contact', fr: 'Contact' },
    'footer.copyright': { pt: "© 2026 TheMajord'Home. Todos os direitos reservados.", en: "© 2026 TheMajord'Home. All rights reserved.", fr: "© 2026 TheMajord'Home. Tous droits réservés." },
    'footer.legal': { pt: 'Aviso legal', en: 'Legal Notice', fr: 'Mentions légales' },

    'breadcrumb.collection': { pt: 'A coleção', en: 'The Collection', fr: 'La Collection' },
    'notFound.title': { pt: 'Apartamento não encontrado', en: 'Apartment not found', fr: 'Appartement introuvable' },
    'notFound.desc': { pt: 'O link pode estar incompleto. Volta à coleção para escolher um apartamento.', en: 'The link may be incomplete. Go back to the collection to choose an apartment.', fr: 'Le lien est peut-être incomplet. Retournez à la collection pour choisir un appartement.' },
    'notFound.cta': { pt: 'Ver a coleção', en: 'View the collection', fr: 'Voir la collection' },

    'property.about': { pt: 'Sobre este alojamento', en: 'About this place', fr: 'À propos de ce logement' },
    'property.location': { pt: 'Localização', en: 'Location', fr: 'Emplacement' },
    'property.amenities': { pt: 'Comodidades', en: 'Amenities', fr: 'Équipements' },
    'property.reviews': { pt: 'avaliações', en: 'reviews', fr: 'avis' },
    'property.readMore': { pt: 'Ler mais +', en: 'Read more +', fr: 'Lire plus +' },
    'property.showLess': { pt: 'Mostrar menos −', en: 'Show less −', fr: 'Afficher moins −' },
    'property.priceOnRequest': { pt: 'Preço sob consulta', en: 'Price on request', fr: 'Prix sur demande' },
    'property.perNightFrom': { pt: '/ noite, desde', en: '/ night, from', fr: '/ nuit, à partir de' },
    'property.finePrint': { pt: 'Não será cobrado nada já. Preços e disponibilidade em tempo real, atualizados diretamente pelo Beds24, chegam em breve.', en: "You won't be charged yet. Real-time prices and availability, updated directly from Beds24, are coming soon.", fr: 'Vous ne serez pas débité maintenant. Prix et disponibilité en temps réel, mis à jour directement par Beds24, arrivent bientôt.' },

    'property.houseRules': { pt: 'Regras da casa', en: 'House rules', fr: 'Règlement intérieur' },
    'property.reviewsHeading': { pt: 'Avaliações de hóspedes', en: 'Guest reviews', fr: 'Avis des voyageurs' },
    'houseRules.checkIn': { pt: 'Check-in', en: 'Check-in', fr: 'Arrivée' },
    'houseRules.checkOut': { pt: 'Check-out', en: 'Check-out', fr: 'Départ' },
    'houseRules.maxGuests': { pt: 'Máx. de hóspedes', en: 'Max guests', fr: 'Voyageurs max.' },
    'houseRules.safety': { pt: 'Segurança', en: 'Safety', fr: 'Sécurité' },
    'houseRules.noSmokeAlarm': { pt: 'Sem alarme de fumo', en: 'No smoke alarm', fr: "Pas de détecteur de fumée" },
    'houseRules.noCoAlarm': { pt: 'Sem alarme de monóxido de carbono', en: 'No carbon monoxide alarm', fr: 'Pas de détecteur de monoxyde de carbone' },
    'houseRules.babyKit': { pt: 'Kit de bebé', en: 'Baby kit', fr: 'Kit bébé' },
    'houseRules.onRequest': { pt: 'Disponível sob pedido', en: 'Available on request', fr: 'Disponible sur demande' }
  };

  /* ---------------------------------------------------------------------
     Shared amenity vocabulary (category names + individual items)
     --------------------------------------------------------------------- */
  var AMENITY_CATEGORIES = {
    'Essentials': { pt: 'Essenciais', fr: 'Essentiels' },
    'Outdoor': { pt: 'Exterior', fr: 'Extérieur' },
    'Kitchen': { pt: 'Cozinha', fr: 'Cuisine' },
    'Entertainment': { pt: 'Entretenimento', fr: 'Divertissement' },
    'Laundry': { pt: 'Lavandaria', fr: 'Buanderie' },
    'Safety': { pt: 'Segurança', fr: 'Sécurité' },
    'Accessibility': { pt: 'Acessibilidade', fr: 'Accessibilité' },
    'Work': { pt: 'Trabalho', fr: 'Travail' }
  };

  var AMENITY_ITEMS = {
    'Wi-Fi': { pt: 'Wi-Fi', fr: 'Wi-Fi' },
    'Air conditioning': { pt: 'Ar condicionado', fr: 'Climatisation' },
    'Fan': { pt: 'Ventoinha', fr: 'Ventilateur' },
    'Heating': { pt: 'Aquecimento', fr: 'Chauffage' },
    'Fresh linens': { pt: 'Roupa de cama lavada', fr: 'Linge de maison' },
    'Hairdryer': { pt: 'Secador de cabelo', fr: 'Sèche-cheveux' },
    'Private terrace': { pt: 'Terraço privado', fr: 'Terrasse privée' },
    'Garden view': { pt: 'Vista para o jardim', fr: 'Vue sur le jardin' },
    'Outdoor seating': { pt: 'Zona de estar exterior', fr: 'Coin salon extérieur' },
    'Shared pool': { pt: 'Piscina partilhada', fr: 'Piscine partagée' },
    'Coffee maker': { pt: 'Máquina de café', fr: 'Machine à café' },
    'Refrigerator': { pt: 'Frigorífico', fr: 'Réfrigérateur' },
    'Oven': { pt: 'Forno', fr: 'Four' },
    'Stove': { pt: 'Fogão', fr: 'Plaques de cuisson' },
    'Stovetop': { pt: 'Placa', fr: 'Plaque de cuisson' },
    'Private garden': { pt: 'Jardim privado', fr: 'Jardin privé' },
    'Dishwasher': { pt: 'Máquina de lavar loiça', fr: 'Lave-vaisselle' },
    'TV': { pt: 'TV', fr: 'TV' },
    'Washing machine': { pt: 'Máquina de lavar roupa', fr: 'Lave-linge' },
    'Ironing board': { pt: 'Tábua de engomar', fr: 'Table à repasser' },
    'Fire extinguisher': { pt: 'Extintor', fr: 'Extincteur' },
    'First aid kit': { pt: 'Kit de primeiros socorros', fr: 'Trousse de premiers secours' },
    'Private patio': { pt: 'Pátio privado', fr: 'Patio privé' },
    'Microwave': { pt: 'Micro-ondas', fr: 'Micro-ondes' },
    'Balcony': { pt: 'Varanda', fr: 'Balcon' },
    'Terrace': { pt: 'Terraço', fr: 'Terrasse' },
    'Collective garden': { pt: 'Jardim comum', fr: 'Jardin commun' },
    'Garden': { pt: 'Jardim', fr: 'Jardin' },
    'Kettle': { pt: 'Chaleira', fr: 'Bouilloire' },
    'Toaster': { pt: 'Torradeira', fr: 'Grille-pain' },
    'Private balcony': { pt: 'Varanda privada', fr: 'Balcon privé' },
    'Elevator': { pt: 'Elevador', fr: 'Ascenseur' },
    'Ocean-facing terrace': { pt: 'Terraço virado para o oceano', fr: "Terrasse face à l'océan" },
    'Private courtyard': { pt: 'Pátio privativo', fr: 'Cour privée' },
    'Exterior space': { pt: 'Espaço exterior', fr: 'Espace extérieur' },
    'Fireplace': { pt: 'Lareira', fr: 'Cheminée' },
    'Drying machine': { pt: 'Máquina de secar roupa', fr: 'Sèche-linge' },
    'Iron': { pt: 'Ferro de engomar', fr: 'Fer à repasser' },
    'Parking': { pt: 'Estacionamento', fr: 'Parking' },
    'Dedicated workspace': { pt: 'Espaço de trabalho dedicado', fr: 'Espace de travail dédié' },
    'Small terrace': { pt: 'Pequeno terraço', fr: 'Petite terrasse' },
    'Patio': { pt: 'Pátio', fr: 'Patio' },
    'Shared garden': { pt: 'Jardim partilhado', fr: 'Jardin partagé' }
  };

  /* ---------------------------------------------------------------------
     "Nearby" points of interest — only the generic part is translated;
     proper nouns (street/square/market names) are left as-is.
     --------------------------------------------------------------------- */
  var NEARBY_LABELS = {
    'São Bento train station': { pt: 'Estação de São Bento', fr: 'Gare de São Bento' },
    'Ribeira riverfront': { pt: 'Ribeira, junto ao rio', fr: 'Ribeira, au bord du fleuve' },
    'Trindade metro station': { pt: 'Estação de metro da Trindade', fr: 'Station de métro Trindade' },
    'Lapa metro station': { pt: 'Estação de metro da Lapa', fr: 'Station de métro Lapa' },
    'Porto airport': { pt: 'Aeroporto do Porto', fr: 'Aéroport de Porto' },
    'Trindade metro': { pt: 'Metro da Trindade', fr: 'Métro Trindade' },
    'Bolhão metro station': { pt: 'Estação de metro do Bolhão', fr: 'Station de métro Bolhão' },
    'Bolhão metro': { pt: 'Metro do Bolhão', fr: 'Métro Bolhão' },
    'Douro riverfront': { pt: 'Margem do Douro', fr: 'Bords du Douro' },
    '24 de Agosto metro': { pt: 'Metro do 24 de Agosto', fr: 'Métro 24 de Agosto' },
    'Galeria de Paris': { pt: 'Galeria de Paris', fr: 'Galeria de Paris' },
    'Câmara Municipal & Aliados': { pt: 'Câmara Municipal e Aliados', fr: 'Câmara Municipal et Aliados' },
    'Supermarket': { pt: 'Supermercado', fr: 'Supermarché' },
    'Jardim de São Lázaro': { pt: 'Jardim de São Lázaro', fr: 'Jardin de São Lázaro' },
    'Rua de Santa Catarina': { pt: 'Rua de Santa Catarina', fr: 'Rua de Santa Catarina' },
    'Fontaínhas': { pt: 'Fontaínhas', fr: 'Fontaínhas' },
    'Rotunda da Boavista': { pt: 'Rotunda da Boavista', fr: 'Rond-point de Boavista' },
    'Casa da Música metro station': { pt: 'Estação de metro Casa da Música', fr: 'Station de métro Casa da Música' },
    'Avenida da Boavista': { pt: 'Avenida da Boavista', fr: 'Avenida da Boavista' },
    'Praia do Homem do Leme': { pt: 'Praia do Homem do Leme', fr: 'Plage du Homem do Leme' },
    'Foz do Douro riverside': { pt: 'Marginal da Foz do Douro', fr: 'Bord de mer de Foz do Douro' },
    'Passeio Alegre gardens': { pt: 'Jardins do Passeio Alegre', fr: 'Jardins du Passeio Alegre' },
    'Douro river mouth': { pt: 'Foz do rio Douro', fr: "Embouchure du Douro" },
    'Mercado do Bolhão': { pt: 'Mercado do Bolhão', fr: 'Marché du Bolhão' },
    'Avenida dos Aliados': { pt: 'Avenida dos Aliados', fr: 'Avenida dos Aliados' },
    'Rua do Almada': { pt: 'Rua do Almada', fr: 'Rua do Almada' },
    'Bonfim metro station': { pt: 'Estação de metro do Bonfim', fr: 'Station de métro Bonfim' },
    'Museu Nacional Soares dos Reis': { pt: 'Museu Nacional Soares dos Reis', fr: 'Musée National Soares dos Reis' },
    'São Lázaro garden': { pt: 'Jardim de São Lázaro', fr: 'Jardin de São Lázaro' },
    'Douro riverbank': { pt: 'Margem do Douro', fr: 'Rives du Douro' },
    'Ribeira': { pt: 'Ribeira', fr: 'Ribeira' },
    'Clérigos Tower': { pt: 'Torre dos Clérigos', fr: 'Tour des Clérigos' },
    'Livraria Lello': { pt: 'Livraria Lello', fr: 'Livraria Lello' }
  };

  /* ---------------------------------------------------------------------
     Per-apartment content overlay (subtitle / description / neighborhood)
     --------------------------------------------------------------------- */
  var PROPERTY_TRANSLATIONS = {
    "fabrica-no-jardim": {
        "pt": {
            "subtitle": "Um duplex luminoso, envolto em granito e vegetação",
            "description": "Escondido atrás de um muro de jardim em pedra, no coração da Baixa, o Fábrica no Jardim combina uma fachada em chapa ondulada com um terraço tranquilo e cheio de plantas — uma sala exterior privada emoldurada por uma oliveira antiga e um muro de contenção em granito. Lá dentro, o duplex conjuga peças vintage e contemporâneas lado a lado: um sofá boucle curvo, candeeiros industriais suspensos, vigas à vista. É uma casa para manhãs tranquilas no terraço e serões descontraídos sob a árvore iluminada, a poucos minutos a pé dos Aliados e do Douro.",
            "neighborhood": "Rua do Almada 556, 4000-059 Porto. A Baixa é o centro histórico do Porto — ruas de calçada, fachadas de azulejo, e a maior concentração de cafés, lojas e miradouros da cidade."
        },
        "fr": {
            "subtitle": "Un duplex lumineux, enveloppé de granit et de verdure",
            "description": "Niché derrière un mur de jardin en pierre, au cœur de la Baixa, le Fábrica no Jardim marie une façade en tôle ondulée à une terrasse paisible et verdoyante — un salon extérieur privé, encadré par un vieil olivier et un mur de soutènement en granit. À l'intérieur, le duplex mêle pièces vintage et contemporaines : un canapé bouclé incurvé, des suspensions industrielles, des poutres apparentes. Une maison pour des matins tranquilles sur la terrasse et des soirées douces sous l'arbre illuminé, à quelques minutes à pied des Aliados et du Douro.",
            "neighborhood": "Rua do Almada 556, 4000-059 Porto. La Baixa est le centre historique de Porto — rues pavées, façades d'azulejos, et la plus grande concentration de cafés, boutiques et miradouros de la ville."
        }
    },
    "sweety-porto": {
        "pt": {
            "subtitle": "Um encantador apartamento com terraço numa das ruas mais bonitas da Baixa",
            "description": "Na Rua do Almada, uma das ruas com mais carácter da baixa portuense, o Sweety Porto é um apartamento compacto e luminoso, com terraço próprio — ideal para duas pessoas. Perto da estação da Trindade e a poucos minutos dos principais pontos turísticos da cidade, é uma base bem localizada para uma estadia curta.",
            "neighborhood": "A Rua do Almada fica na Baixa, a minutos dos Aliados e do metro da Trindade, numa das zonas mais fáceis de percorrer a pé no centro do Porto."
        },
        "fr": {
            "subtitle": "Un charmant appartement avec terrasse dans l'une des plus belles rues de la Baixa",
            "description": "Sur la Rua do Almada, l'une des rues les plus typiques du centre de Porto, le Sweety Porto est un appartement compact et lumineux, avec sa propre terrasse — idéal pour deux personnes. Proche de la station Trindade et à quelques minutes des principaux sites touristiques de la ville, c'est une base bien située pour un court séjour.",
            "neighborhood": "La Rua do Almada se trouve dans la Baixa, à quelques minutes des Aliados et du métro Trindade, dans l'un des quartiers les plus agréables à parcourir à pied du centre de Porto."
        }
    },
    "casa-bonfim": {
        "pt": {
            "subtitle": "Uma casa inteira para família e amigos, num recanto residencial do Porto",
            "description": "Uma casa inteira em Bonfim, só para o seu grupo. A Casa B distribui-se por três quartos, num recanto residencial e tranquilo do Porto — mais espaço e privacidade do que um apartamento típico, com lugar para reuniões de família ou um grupo de amigos a viajar juntos.",
            "neighborhood": "Bonfim é um bairro maioritariamente residencial a leste do centro, conhecido pelas ruas calmas e pelos jardins do Cemitério do Bonfim."
        },
        "fr": {
            "subtitle": "Une maison entière pour la famille et les amis, dans un coin résidentiel de Porto",
            "description": "Une maison entière à Bonfim, rien que pour votre groupe. Casa B s'étend sur trois chambres, dans un coin résidentiel et tranquille de Porto — plus d'espace et d'intimité qu'un appartement classique, avec de la place pour des retrouvailles en famille ou entre amis.",
            "neighborhood": "Bonfim est un quartier essentiellement résidentiel à l'est du centre, connu pour ses rues calmes et les jardins du Cemitério do Bonfim."
        }
    },
    "so-trendy-porto": {
        "pt": {
            "subtitle": "Um duplex com pátio, a cinco minutos a pé da Praça dos Poveiros",
            "description": "Um duplex muito apreciado pelos hóspedes em Bonfim, com pátio privado e dois quartos com casa de banho privativa. O So Trendy Porto fica a cinco minutos a pé da animada Praça dos Poveiros, bem posicionado para explorar o centro do Porto a pé.",
            "neighborhood": "Esta parte de Bonfim fica mesmo junto à Baixa, perto dos Poveiros e do Mercado do Bolhão — central sem a confusão do centro."
        },
        "fr": {
            "subtitle": "Un duplex avec patio, à cinq minutes à pied de la Praça dos Poveiros",
            "description": "Un duplex très apprécié des voyageurs à Bonfim, avec patio privé et deux chambres en suite. So Trendy Porto se trouve à cinq minutes à pied de l'animée Praça dos Poveiros, idéalement placé pour explorer le centre de Porto à pied.",
            "neighborhood": "Cette partie de Bonfim touche presque la Baixa, tout près des Poveiros et du marché do Bolhão — central, sans l'agitation du centre-ville."
        }
    },
    "vintage-porto": {
        "pt": {
            "subtitle": "Um apartamento tranquilo numa rua transversal à Avenida dos Aliados",
            "description": "Numa rua perpendicular à Avenida dos Aliados, a 50m da Universidade e a 10 minutos a pé do Douro. Tranquilo, por estar nas traseiras do prédio, mas perto do metro, autocarro e comboio. Uma cozinha verde-menta, uma mesa de jantar redonda e uma sala confortável com sofá estampado dão ao apartamento o seu carácter vintage.",
            "neighborhood": "Baixa, o centro histórico do Porto."
        },
        "fr": {
            "subtitle": "Un appartement calme dans une rue perpendiculaire à l'Avenida dos Aliados",
            "description": "Dans une rue perpendiculaire à l'Avenida dos Aliados, à 50m de l'Université et à 10 minutes à pied du Douro. Calme, car situé à l'arrière de l'immeuble, mais proche du métro, du bus et du train. Une cuisine vert menthe, une table à manger ronde et un salon confortable au canapé imprimé donnent à l'appartement son caractère vintage.",
            "neighborhood": "Baixa, le centre historique de Porto."
        }
    },
    "artury-porto": {
        "pt": {
            "subtitle": "Um duplex com varanda, perto da Câmara Municipal",
            "description": "Um encantador apartamento duplex com varanda no centro do Porto, perto da Câmara Municipal, a 10 minutos a pé da estação de metro da Trindade. Janelas francesas em vermelho vivo, uma sala decorada com estampas Matisse e uma escada de madeira que leva a um segundo quarto sob o telhado.",
            "neighborhood": "Baixa, perto do metro da Trindade."
        },
        "fr": {
            "subtitle": "Un duplex avec balcon, près de l'hôtel de ville",
            "description": "Un charmant appartement en duplex avec balcon, au centre de Porto, près de la mairie, à 10 minutes à pied de la station de métro Trindade. Des fenêtres à la française rouge vif, un salon orné d'estampes Matisse et un escalier en bois menant à une seconde chambre sous les combles.",
            "neighborhood": "Baixa, près du métro Trindade."
        }
    },
    "arty-porto": {
        "pt": {
            "subtitle": "Um duplex loft marcante num condomínio ajardinado privado, perto do metro Heroísmo",
            "description": "Um duplex loft com arquitetura marcante, num condomínio ajardinado e tranquilo no Bonfim, a poucos minutos a pé da Rua de Santa Catarina e do Coliseu do Porto, e perto da estação de metro Heroísmo. Paredes revestidas a madeira, pormenores em aço preto e um mural botânico despojado emolduram a sala de estar de pé-direito duplo, com uma cozinha em nogueira escura que abre para um terraço privado com parede em pedra. Três quartos e duas casas de banho completas distribuem-se pelos dois pisos, ligados por uma escadaria com guarda em vidro.",
            "neighborhood": "Bonfim, perto da Rua de Santa Catarina e do metro Heroísmo."
        },
        "fr": {
            "subtitle": "Un duplex loft marquant dans une copropriété avec jardin privé, près du métro Heroísmo",
            "description": "Un duplex loft à l'architecture marquante, au sein d'une copropriété calme avec jardin dans le Bonfim, à quelques minutes à pied de la Rua de Santa Catarina et du Coliseu do Porto, et proche de la station de métro Heroísmo. Murs habillés de bois, détails en acier noir et une fresque végétale audacieuse encadrent le salon à double hauteur, avec une cuisine en noyer foncé ouvrant sur une terrasse privée aux murs en pierre. Trois chambres et deux salles de bains complètes se répartissent sur les deux niveaux, reliés par un escalier à garde-corps vitré.",
            "neighborhood": "Bonfim, près de la Rua de Santa Catarina et du métro Heroísmo."
        }
    },
    "belleville-porto": {
        "pt": {
            "subtitle": "Um duplex luminoso de dois pisos com sala em amarelo-mostarda, perto do metro Heroísmo",
            "description": "Um duplex luminoso e elegantemente decorado perto da estação de metro Heroísmo, com um sofá amarelo-mostarda e detalhes em verde-azulado na sala de estar, uma cozinha branca com backsplash em mármore e uma sala de jantar independente. Uma escadaria original em madeira liga os dois pisos, conduzindo a dois quartos — um em tons suaves de bege, o outro com um papel de parede em ondas azul e creme — cada um com casa de banho completa própria, acabada em clássico mosaico xadrez preto e branco.",
            "neighborhood": "Bonfim, perto da estação de metro Heroísmo."
        },
        "fr": {
            "subtitle": "Un duplex lumineux sur deux niveaux avec un salon jaune moutarde, près du métro Heroísmo",
            "description": "Un duplex lumineux et élégamment meublé près de la station de métro Heroísmo, avec un canapé jaune moutarde et des touches vert canard dans le salon, une cuisine blanche à crédence en marbre et une salle à manger indépendante. Un escalier en bois d'origine relie les deux niveaux, menant à deux chambres — l'une aux tons beiges doux, l'autre habillée d'un papier peint à motifs bleu et crème — chacune avec sa propre salle de bains complète, au classique carrelage à damier noir et blanc.",
            "neighborhood": "Bonfim, près de la station de métro Heroísmo."
        }
    },
    "oliveirinhas-flat-i": {
        "pt": {
            "subtitle": "Um apartamento moderno no rés do chão, com terraço privado na Rua das Oliveirinhas",
            "description": "Um apartamento elegantemente renovado na Rua das Oliveirinhas, com um sofá em veludo verde e armários em madeira quente que abrem diretamente para um terraço privado mobilado com cadeiras amarelas em corda — um recanto soalheiro escondido atrás de um troço de muro em granito antigo. Uma cozinha revestida a madeira, um quarto com cabeceira estofada e duas casas de banho completas, acabadas em mosaico efeito mármore com torneiras em dourado escovado, completam o apartamento, integrado num pequeno edifício discretamente renovado perto do metro Heroísmo.",
            "neighborhood": "Bonfim, na Rua das Oliveirinhas, perto do metro Heroísmo."
        },
        "fr": {
            "subtitle": "Un appartement moderne au rez-de-chaussée avec terrasse privée, Rua das Oliveirinhas",
            "description": "Un appartement élégamment rénové sur la Rua das Oliveirinhas, avec un canapé en velours vert et des meubles en bois chaleureux ouvrant directement sur une terrasse privée meublée de chaises jaunes en corde tressée — un coin ensoleillé blotti derrière un pan de mur en granit ancien. Une cuisine habillée de bois, une chambre à la tête de lit capitonnée et deux salles de bains complètes, au carrelage effet marbre et à la robinetterie laiton brossé, complètent l'appartement, intégré dans un petit immeuble discrètement rénové près du métro Heroísmo.",
            "neighborhood": "Bonfim, sur la Rua das Oliveirinhas, près du métro Heroísmo."
        }
    },
    "oliveirinhas-flat-ii": {
        "pt": {
            "subtitle": "Um estúdio luminoso e aberto, com toques em veludo azul-petróleo, na Rua das Oliveirinhas",
            "description": "Um estúdio luminoso e de planta aberta na Rua das Oliveirinhas, onde uma cama de casal confortável, uma mesa de jantar em madeira e uma cozinha compacta equipada com forno Siemens partilham uma única divisão iluminada por uma fileira de altas janelas com portadas. Poltronas em veludo azul-petróleo, mobiliário vintage escolhido a dedo e detalhes cerâmicos divertidos dão carácter ao espaço, e uma casa de banho em mosaico efeito mármore com chuveiro em dourado escovado completa este estúdio calmo e bem localizado, perto do metro Heroísmo.",
            "neighborhood": "Bonfim, na Rua das Oliveirinhas, perto do metro Heroísmo."
        },
        "fr": {
            "subtitle": "Un studio lumineux et ouvert, aux touches de velours bleu pétrole, Rua das Oliveirinhas",
            "description": "Un studio lumineux à plan ouvert sur la Rua das Oliveirinhas, où un lit double confortable, une table à manger en bois et une cuisine compacte équipée d'un four Siemens partagent une seule pièce baignée de lumière derrière une rangée de hautes fenêtres à volets. Des fauteuils en velours bleu pétrole, du mobilier vintage soigneusement choisi et des touches en céramique ludiques donnent du caractère à l'espace, et une salle de bains au carrelage effet marbre avec douche pluie en laiton brossé complète ce studio calme et bien situé, près du métro Heroísmo.",
            "neighborhood": "Bonfim, sur la Rua das Oliveirinhas, près du métro Heroísmo."
        }
    },
    "oliveirinhas-flat-iii": {
        "pt": {
            "subtitle": "Um apartamento com um quarto, poltronas em rattan e varanda francesa, na Rua das Oliveirinhas",
            "description": "Um apartamento de um quarto, calorosamente decorado, na Rua das Oliveirinhas, onde um par de poltronas em rattan verde-musgo e um aparador de meados do século ancoram o canto de estar junto às portas da varanda francesa com vista para a rua. Uma cozinha com frentes em madeira, um quarto suavizado por almofadas em tricot de lã e poltronas de rattan a condizer, e uma casa de banho em mosaico efeito mármore com torneiras em dourado escovado completam este apartamento calmo e bem localizado, perto do metro Heroísmo.",
            "neighborhood": "Bonfim, na Rua das Oliveirinhas, perto do metro Heroísmo."
        },
        "fr": {
            "subtitle": "Un appartement d'une chambre avec fauteuils en rotin et balcon à la française, Rua das Oliveirinhas",
            "description": "Un appartement d'une chambre chaleureusement meublé sur la Rua das Oliveirinhas, où une paire de fauteuils en rotin vert mousse et un buffet vintage ancrent le coin salon près des portes du balcon à la française donnant sur la rue. Une cuisine aux façades en bois, une chambre adoucie par des coussins en tricot de laine et des fauteuils en rotin assortis, et une salle de bains au carrelage effet marbre à la robinetterie laiton brossé complètent cet appartement calme et bien situé, près du métro Heroísmo.",
            "neighborhood": "Bonfim, sur la Rua das Oliveirinhas, près du métro Heroísmo."
        }
    },
    "oliveirinhas-flat-iv": {
        "pt": {
            "subtitle": "Um duplex no último piso com terraço na cobertura sobre os telhados de telha do Porto, na Rua das Oliveirinhas",
            "description": "Um duplex no último piso da Rua das Oliveirinhas, com um terraço na cobertura mobilado para refeições e momentos de lazer, sobre um mosaico de telhados de telha e chaminés. Uma escadaria com guarda em vidro e madeira liga os dois pisos, com um sofá curvo azul-petróleo e cadeiras de jantar em veludo no piso de cima, e dois quartos — cada um com casa de banho completa própria, em mosaico efeito mármore com torneiras em dourado escovado — no piso de baixo. Uma cozinha totalmente equipada completa este duplex luminoso e bem localizado, perto do metro Heroísmo.",
            "neighborhood": "Bonfim, na Rua das Oliveirinhas, perto do metro Heroísmo."
        },
        "fr": {
            "subtitle": "Un duplex au dernier étage avec terrasse sur le toit dominant les toits de tuiles de Porto, Rua das Oliveirinhas",
            "description": "Un duplex au dernier étage sur la Rua das Oliveirinhas, avec une terrasse sur le toit meublée pour dîner et se détendre, au-dessus d'une mosaïque de toits de tuiles et de cheminées. Un escalier à garde-corps en verre et bois relie les deux niveaux, avec un canapé courbe bleu pétrole et des chaises de salle à manger en velours à l'étage, et deux chambres — chacune avec sa propre salle de bains complète, au carrelage effet marbre et à la robinetterie laiton brossé — au niveau inférieur. Une cuisine entièrement équipée complète ce duplex lumineux et bien situé, près du métro Heroísmo.",
            "neighborhood": "Bonfim, sur la Rua das Oliveirinhas, près du métro Heroísmo."
        }
    },
    "camilo-apartment": {
        "pt": {
            "subtitle": "Um apartamento encantador com varanda na Avenida Camilo",
            "description": "Apartamento encantador com varanda na bela Avenida Camilo, a 5 minutos a pé da estação de metro do 24 de Agosto. Dois quartos com decoração cuidada — um em azul e dourado, o outro em cinza quente e turquesa — junto a uma sala de estar e jantar luminosa.",
            "neighborhood": "Bonfim, perto do Campo 24 de Agosto."
        },
        "fr": {
            "subtitle": "Un appartement charmant avec balcon sur l'Avenida Camilo",
            "description": "Appartement charmant avec balcon sur la belle Avenida Camilo, à 5 minutes à pied de la station de métro 24 de Agosto. Deux chambres à la décoration soignée — l'une en bleu et or, l'autre en gris chaud et turquoise — de part et d'autre d'un salon-salle à manger lumineux.",
            "neighborhood": "Bonfim, près du Campo 24 de Agosto."
        }
    },
    "comfy-porto": {
        "pt": {
            "subtitle": "Um duplex com terraço privado perto da Praça dos Poveiros",
            "description": "Duplex luminoso com terraço privado no centro do Porto, perto da animada Praça dos Poveiros e a 5 minutos a pé da estação de metro do Bolhão. Sala de estar, jantar e cozinha em open-space no piso de baixo, com três quartos e vista sobre a cidade no piso de cima.",
            "neighborhood": "Bonfim, junto à Praça dos Poveiros."
        },
        "fr": {
            "subtitle": "Un duplex avec terrasse privée près de la Praça dos Poveiros",
            "description": "Duplex lumineux avec terrasse privée au centre de Porto, près de l'animée Praça dos Poveiros et à 5 minutes à pied de la station de métro Bolhão. Salon, salle à manger et cuisine ouverts au rez-de-chaussée, trois chambres et vue sur la ville à l'étage.",
            "neighborhood": "Bonfim, à côté de la Praça dos Poveiros."
        }
    },
    "balcony-porto-view": {
        "pt": {
            "subtitle": "Um apartamento compacto com varanda perto dos Poveiros",
            "description": "Apartamento encantador com varanda no centro do Porto, perto da animada Praça dos Poveiros, a 5 minutos a pé da estação de metro do 24 de Agosto.",
            "neighborhood": "Bonfim, junto à Praça dos Poveiros."
        },
        "fr": {
            "subtitle": "Un appartement compact avec balcon près des Poveiros",
            "description": "Appartement charmant avec balcon au centre de Porto, près de l'animée Praça dos Poveiros, à 5 minutes à pied de la station de métro 24 de Agosto.",
            "neighborhood": "Bonfim, à côté de la Praça dos Poveiros."
        }
    },
    "so-truly-porto": {
        "pt": {
            "subtitle": "Um apartamento de três quartos com carácter perto da Praça dos Poveiros",
            "description": "Apartamento com carácter no centro do Porto, perto da animada Praça dos Poveiros, a 5 minutos a pé da estação de metro do 24 de Agosto. Uma sala verde com detalhes em madeira entalhada abre para uma zona de jantar e cozinha, com três quartos discretamente decorados ao longo do corredor.",
            "neighborhood": "Bonfim, junto à Praça dos Poveiros."
        },
        "fr": {
            "subtitle": "Un appartement de trois chambres avec caractère près de la Praça dos Poveiros",
            "description": "Appartement plein de caractère au centre de Porto, près de l'animée Praça dos Poveiros, à 5 minutes à pied de la station de métro 24 de Agosto. Un salon vert aux détails en bois sculpté s'ouvre sur un coin repas et une cuisine, avec trois chambres sobrement décorées le long du couloir.",
            "neighborhood": "Bonfim, à côté de la Praça dos Poveiros."
        }
    },
    "boho-vintage-bonfim": {
        "pt": {
            "subtitle": "Um apartamento de 125 m² com três quartos, cada um com decoração própria",
            "description": "Um apartamento cheio de personalidade, que mistura estilos boho e vintage: uma sala de estar e jantar verde de inspiração midcentury, uma cozinha com azulejo xadrez em bordô e três quartos, cada um com o seu carácter — um em papel de parede botânico verde com um daybed, outro com cabeceira em cabedal e um cantinho de leitura, e outro em tom verde-água com cabeceira em rattan, além de um cantinho aconchegante com sofá-cama para hóspedes extra. Uma única casa de banho de estilo vintage tem torneiras em latão e um espelho redondo. A 100m da estação de metro da Trindade, a 50m da Câmara Municipal e da Avenida dos Aliados.",
            "neighborhood": "Bonfim, junto à Trindade e aos Aliados."
        },
        "fr": {
            "subtitle": "Un appartement de 125 m² avec trois chambres, chacune décorée à sa façon",
            "description": "Un appartement plein de caractère, qui mélange les styles boho et vintage : un salon-salle à manger vert d'inspiration midcentury, une cuisine au carrelage à damier bordeaux, et trois chambres ayant chacune son identité propre — l'une en papier peint botanique vert avec un daybed, une autre avec une tête de lit en cuir et un coin lecture, et une dernière en vert d'eau avec tête de lit en rotin, ainsi qu'un coin cosy avec canapé-lit pour les invités supplémentaires. Une salle de bain unique de style vintage possède une robinetterie en laiton et un miroir rond. À 100m de la station de métro Trindade, à 50m de l'hôtel de ville et de l'Avenida dos Aliados.",
            "neighborhood": "Bonfim, près de Trindade et des Aliados."
        }
    },
    "joy-porto": {
        "pt": {
            "subtitle": "Um duplex alegre e colorido, com terraço na cobertura e jardim privado",
            "description": "Um duplex moderno e alegre, com cozinha revestida a mosaico, poltronas coloridas e dois quartos confortáveis. No piso térreo, um jardim privado murado com espreguiçadeiras e relvado sintético; na cobertura, um terraço com mesa de refeições e vista sobre os telhados das Fontaínhas. Numa das zonas mais típicas das Fontaínhas, a 10 minutos a pé do Campo 24 de Agosto.",
            "neighborhood": "Fontaínhas, no centro do Porto."
        },
        "fr": {
            "subtitle": "Un duplex lumineux et coloré, avec terrasse sur le toit et jardin privé",
            "description": "Un duplex moderne et joyeux, avec une cuisine habillée de mosaïque, des fauteuils colorés et deux chambres confortables. Au rez-de-chaussée, un jardin privé clos avec transats et pelouse synthétique ; sur le toit, une terrasse avec table à manger et vue sur les toits des Fontaínhas. Dans l'un des quartiers les plus typiques des Fontaínhas, à 10 minutes à pied du Campo 24 de Agosto.",
            "neighborhood": "Fontaínhas, au centre de Porto."
        }
    },
    "mercadory-ribeira": {
        "pt": {
            "subtitle": "Um apartamento aconchegante e renovado, atrás de paredes de granito originais",
            "description": "Um apartamento encantador de um quarto, onde as paredes de granito originais à vista se encontram com um interior moderno e cuidado — uma cozinha compacta com mesa de refeições, uma sala confortável, um quarto com cabeceira acolchoada e uma casa de banho revestida a mármore. Numa das zonas mais emblemáticas e bonitas do Porto, a Ribeira, mesmo no centro histórico da cidade.",
            "neighborhood": "Ribeira, o bairro histórico ribeirinho do Porto."
        },
        "fr": {
            "subtitle": "Un appartement chaleureux et rénové, derrière des murs en granit d'origine",
            "description": "Un appartement charmant d'une chambre, où les murs en granit apparent d'origine rencontrent un intérieur moderne et soigné — une cuisine compacte avec table à manger, un salon confortable, une chambre à tête de lit capitonnée et une salle de bain habillée de marbre. Dans l'un des quartiers les plus emblématiques et les plus beaux de Porto, la Ribeira, en plein cœur historique de la ville.",
            "neighborhood": "Ribeira, le quartier historique au bord du fleuve à Porto."
        }
    },
    "ribeira-loft": {
        "pt": {
            "subtitle": "Um loft de sótão, com tetos inclinados e vista sobre os telhados",
            "description": "Um loft cheio de carácter, instalado sob o telhado, com um balcão de cozinha em mármore, uma zona de estar sob vigas de madeira originais, duas camas em ferro forjado e uma casa de banho marcante em mosaico preto. Janelas amplas com vista sobre os telhados da Ribeira. Numa das zonas mais emblemáticas e bonitas do Porto, perto de todas as principais atrações turísticas.",
            "neighborhood": "Ribeira, o bairro histórico ribeirinho do Porto."
        },
        "fr": {
            "subtitle": "Un loft mansardé, avec plafonds en pente et vue sur les toits",
            "description": "Un loft plein de caractère, niché sous les combles, avec un plan de travail de cuisine en marbre, un coin salon sous des poutres en bois d'origine, deux lits en fer forgé et une salle de bain marquante en mosaïque noire. De larges fenêtres offrent une vue sur les toits de la Ribeira. Dans l'un des quartiers les plus emblématiques et les plus beaux de Porto, à deux pas des principales attractions touristiques.",
            "neighborhood": "Ribeira, le quartier historique au bord du fleuve à Porto."
        }
    },
    "lovely-porto": {
        "pt": {
            "subtitle": "Um acolhedor estúdio T0 com varanda e jardim numa rua emblemática da Baixa",
            "description": "Um acolhedor estúdio T0 numa das ruas mais emblemáticas da Baixa, com varanda privada, um pequeno recanto ajardinado e uma cama de casal confortável para duas pessoas. Totalmente renovado em 2018, é uma base compacta e luminosa mesmo no centro do Porto.",
            "neighborhood": "Rua do Almada 419, 4050-093 Porto. A Baixa é o centro histórico do Porto — ruas de calçada, fachadas de azulejo, e a maior concentração de cafés, lojas e miradouros da cidade."
        },
        "fr": {
            "subtitle": "Un studio T0 cosy avec balcon et jardin dans une rue emblématique de la Baixa",
            "description": "Un studio T0 chaleureux dans l'une des rues les plus emblématiques de la Baixa, avec balcon privé, un petit coin jardin et un confortable lit double pour deux personnes. Entièrement rénové en 2018, c'est une base compacte et lumineuse en plein cœur de Porto.",
            "neighborhood": "Rua do Almada 419, 4050-093 Porto. La Baixa est le centre historique de Porto — rues pavées, façades d'azulejos, et la plus grande concentration de cafés, boutiques et miradouros de la ville."
        }
    },
    "loft-porto": {
        "pt": {
            "subtitle": "Um charmoso loft duplex com traves de madeira no coração da Baixa",
            "description": "Um charmoso loft duplex com traves de madeira à vista e uma bela escadaria interior, com capacidade para quatro pessoas. Numa rua emblemática da Baixa, a poucos passos do metro da Trindade e dos Aliados.",
            "neighborhood": "Rua do Almada 419, 3º frt, 4050-093 Porto. Em torno da Avenida dos Aliados desenvolve-se a Baixa do Porto, o ponto de encontro da cidade — a Câmara Municipal num extremo, a Praça da Liberdade com a estátua de D. Pedro IV no outro, e a Estação de São Bento com o seu átrio de azulejos e a Rua das Flores logo ali perto."
        },
        "fr": {
            "subtitle": "Un charmant loft duplex aux poutres apparentes, au cœur de la Baixa",
            "description": "Un charmant loft duplex avec poutres de bois apparentes et un bel escalier intérieur, pouvant accueillir jusqu'à quatre personnes. Situé dans une rue emblématique de la Baixa, à quelques pas du métro Trindade et des Aliados.",
            "neighborhood": "Rua do Almada 419, 3º frt, 4050-093 Porto. Autour de l'Avenida dos Aliados s'étend la Baixa de Porto, le point de rencontre de la ville — la Câmara Municipal à une extrémité, la Praça da Liberdade et sa statue de Pedro IV à l'autre, avec le hall d'azulejos de la gare de São Bento et la Rua das Flores tout proche."
        }
    },
    "simply-porto": {
        "pt": {
            "subtitle": "Um encantador apartamento de 2 assoalhadas a dois passos dos Aliados e do Bolhão",
            "description": "Um apartamento bonito e encantador, com duas zonas de estar e um quarto separado, com capacidade confortável para quatro pessoas. Muito bem localizado entre a Avenida dos Aliados e o Mercado do Bolhão.",
            "neighborhood": "Rua de Santo Ildefonso 306, 4000-465 Porto. A Avenida dos Aliados foi construída para impressionar — edifícios neoclássicos e de estilo Beaux-Arts coroados pela torre de 70 metros da Câmara Municipal, cujo nome recorda a antiga aliança entre Portugal e o Reino Unido. Perto fica o Mercado do Bolhão, um dos mais animados da cidade."
        },
        "fr": {
            "subtitle": "Un charmant appartement de 2 pièces à deux pas des Aliados et du Bolhão",
            "description": "Un bel appartement charmant, avec deux espaces de vie et une chambre séparée, pouvant accueillir confortablement quatre personnes. Très bien situé entre l'avenue des Aliados et le marché do Bolhão.",
            "neighborhood": "Rua de Santo Ildefonso 306, 4000-465 Porto. L'Avenida dos Aliados a été construite pour impressionner — bâtiments néoclassiques et Beaux-Arts couronnés par la tour de 70 mètres de la Câmara Municipal, dont le nom rappelle l'ancienne alliance entre le Portugal et le Royaume-Uni. Tout près se trouve le Mercado do Bolhão, l'un des marchés les plus animés de la ville."
        }
    },
    "trendy-porto": {
        "pt": {
            "subtitle": "Um duplex marcante de 104m², que junta granito à vista, traves de madeira e estilo midcentury, perto dos Aliados e do Bolhão",
            "description": "Um duplex de assinatura, onde as paredes originais em granito à vista se encontram com um interior fresco e cuidado ao pormenor — uma sala de estar e jantar ancorada por uma parede de pedra e poltronas de veludo em estilo midcentury, uma cozinha com um piso em azulejo padronizado marcante, e um corredor com traves de madeira à vista que conduz a duas suites completas. Uma base moderna para quatro pessoas perto dos Aliados e do Mercado do Bolhão.",
            "neighborhood": "Rua das Oliveirinhas 9, R/C, 4000-367 Porto. A Avenida dos Aliados foi construída para impressionar — edifícios neoclássicos e de estilo Beaux-Arts coroados pela torre de 70 metros da Câmara Municipal, cujo nome recorda a antiga aliança entre Portugal e o Reino Unido. Perto fica o Mercado do Bolhão, um dos mais animados da cidade."
        },
        "fr": {
            "subtitle": "Un duplex marquant de 104m², entre granit apparent, poutres en bois et style midcentury, près des Aliados et du Bolhão",
            "description": "Un duplex signature, où les murs en granit apparent d'origine rencontrent un intérieur frais et soigné dans les moindres détails — un salon-salle à manger ancré par un mur de pierre et des fauteuils en velours de style midcentury, une cuisine au sol carrelé à motifs marquant, et un couloir aux poutres de bois apparentes menant à deux suites complètes. Une base moderne pour quatre personnes, près des Aliados et du marché do Bolhão.",
            "neighborhood": "Rua das Oliveirinhas 9, R/C, 4000-367 Porto. L'Avenida dos Aliados a été construite pour impressionner — bâtiments néoclassiques et Beaux-Arts couronnés par la tour de 70 mètres de la Câmara Municipal, dont le nom rappelle l'ancienne alliance entre le Portugal et le Royaume-Uni. Tout près se trouve le Mercado do Bolhão, l'un des marchés les plus animés de la ville."
        }
    },
    "eiffel-porto": {
        "pt": {
            "subtitle": "Um apartamento luminoso e tranquilo perto da Casa da Música e da Boavista",
            "description": "Um apartamento bonito, muito luminoso e tranquilo, no 3º andar com elevador, cuja sala de estar se abre para uma zona de jantar e um sofá-cama muito confortável — dois quartos em 78m², com capacidade para quatro pessoas.",
            "neighborhood": "Rua da Constituição 2105, 4250-170 Porto. A Boavista é a zona mais ocidental do Porto, centrada numa grande rotunda ajardinada com um monumento aos heróis da Guerra Peninsular que derrotaram as tropas de Napoleão. Aqui fica a Casa da Música, popular pelos seus concertos, e a Avenida da Boavista, uma larga avenida de casarões e lojas que desce até à orla atlântica."
        },
        "fr": {
            "subtitle": "Un appartement lumineux et calme, près de la Casa da Música et de Boavista",
            "description": "Un bel appartement, très lumineux et calme, au 3ème étage avec ascenseur, dont le salon s'ouvre sur un coin repas et un canapé-lit très confortable — deux chambres sur 78m², pouvant accueillir quatre personnes.",
            "neighborhood": "Rua da Constituição 2105, 4250-170 Porto. Boavista est le quartier le plus à l'ouest de Porto, centré sur un grand rond-point arboré avec un monument aux héros de la guerre péninsulaire qui vainquirent les troupes de Napoléon. On y trouve la Casa da Música, réputée pour ses concerts, et l'Avenida da Boavista, une large avenue de demeures et de boutiques descendant jusqu'au littoral atlantique."
        }
    },
    "casa-senhorinha": {
        "pt": {
            "subtitle": "Uma casa à beira-mar assinada por um arquiteto, na Foz Velha, a poucos passos do Atlântico",
            "description": "Concebida em colaboração com o arquiteto portuense Álvaro Siza Vieira, a Casa Senhorinha combina um piso térreo em betão polido com um nível superior mais suave, em madeira de pinho, sob tetos altos e arqueados. Instalada no antigo bairro piscatório da Foz Velha, o seu quarto no telhado e o terraço virado para o oceano captam o pôr do sol atlântico em cores sempre diferentes.",
            "neighborhood": "A Foz Velha é o antigo bairro piscatório do Porto, ainda marcado pelo ritmo do mar — percorra os seus becos estreitos até à Capela-Farol de São Miguel-o-Anjo e ao ponto de pesca local, junto à foz do rio."
        },
        "fr": {
            "subtitle": "Une maison de bord de mer signée par un architecte, à Foz Velha, à deux pas de l'Atlantique",
            "description": "Conçue en collaboration avec l'architecte portuense Álvaro Siza Vieira, Casa Senhorinha marie un rez-de-chaussée en béton poli à un niveau supérieur plus doux, en bois de pin, sous de hauts plafonds cintrés. Installée dans l'ancien quartier de pêcheurs de Foz Velha, sa chambre en toiture et sa terrasse face à l'océan captent le coucher de soleil atlantique dans des couleurs toujours changeantes.",
            "neighborhood": "Foz Velha est l'ancien quartier de pêcheurs de Porto, encore rythmé par la mer — parcourez ses ruelles étroites jusqu'à la Capela-Farol de São Miguel-o-Anjo et au point de pêche local, à l'embouchure du fleuve."
        }
    },
    "softly-porto": {
        "pt": {
            "subtitle": "Um T1 tranquilo e luminoso junto ao Bolhão, a poucos passos dos Aliados",
            "description": "O Softly Porto é um T1 calmo e delicadamente decorado, no 3º andar de um prédio clássico na Rua Fernandes Tomás, com elevador e ar condicionado. Tons neutros, luz quente e um mobiliário simples e confortável fazem dele uma base fácil para explorar o centro histórico.",
            "neighborhood": "Rua Fernandes Tomás 845, 4000-219 Porto. Mesmo ao lado da Praça de Almeida Garrett e do Mercado do Bolhão, esta zona da Baixa coloca a Avenida dos Aliados, a Estação de São Bento e a Rua de Santa Catarina a poucos minutos a pé."
        },
        "fr": {
            "subtitle": "Un T1 calme et lumineux près du Bolhão, à deux pas des Aliados",
            "description": "Softly Porto est un T1 calme et délicatement meublé, au 3ème étage d'un immeuble classique de la Rua Fernandes Tomás, avec ascenseur et climatisation. Des tons neutres, une lumière chaude et un mobilier simple et confortable en font une base facile pour explorer le centre historique.",
            "neighborhood": "Rua Fernandes Tomás 845, 4000-219 Porto. Juste à côté de la Praça de Almeida Garrett et du marché du Bolhão, ce coin de Baixa met l'Avenida dos Aliados, la gare de São Bento et la Rua de Santa Catarina à quelques minutes à pied."
        }
    },
    "warmly-porto": {
        "pt": {
            "subtitle": "Um T1 acolhedor com varanda privativa no coração da Baixa",
            "description": "O Warmly Porto acolhe até quatro hóspedes num apartamento compacto e soalheiro na Rua de Santo Ildefonso, com varanda privativa sobre a rua e ar condicionado para os dias mais quentes. Um sofá-cama na sala acrescenta espaço de dormida flexível junto ao quarto.",
            "neighborhood": "Rua de Santo Ildefonso 231, 4000-470 Porto. Santo Ildefonso fica mesmo entre o Mercado do Bolhão e a Avenida dos Aliados, uma zona central e animada da Baixa com cafés, pastelarias e lojas a cada esquina."
        },
        "fr": {
            "subtitle": "Un T1 chaleureux avec balcon privé au cœur de Baixa",
            "description": "Warmly Porto accueille jusqu'à quatre personnes dans un appartement compact et ensoleillé de la Rua de Santo Ildefonso, avec un balcon privé donnant sur la rue et la climatisation pour les jours chauds. Un canapé-lit dans le salon ajoute un couchage flexible en plus de la chambre.",
            "neighborhood": "Rua de Santo Ildefonso 231, 4000-470 Porto. Santo Ildefonso se trouve juste entre le marché du Bolhão et l'Avenida dos Aliados, un coin central et animé de Baixa avec des cafés, pâtisseries et boutiques à chaque coin de rue."
        }
    },
    "amy-almada": {
        "pt": {
            "subtitle": "Um T1 luminoso e minimalista com pátio, perto da Rua do Almada",
            "description": "O Amy Almada é um T1 luminoso e minimalista com um pátio privativo em pedra para tomar café de manhã ou uma bebida ao final do dia ao ar livre — uma raridade tão perto do centro. Armários de linhas limpas, uma bancada de cozinha em mármore e um pequeno recanto com secretária tornam-no igualmente adequado para uma escapadinha ou para alguns dias de trabalho no Porto.",
            "neighborhood": "Situado junto à Rua do Almada, uma das ruas comerciais clássicas da Baixa, este recanto residencial tranquilo fica a poucos minutos a pé dos Aliados, da Estação de São Bento e da zona ribeirinha."
        },
        "fr": {
            "subtitle": "Un T1 lumineux et minimaliste avec patio, près de la Rua do Almada",
            "description": "Amy Almada est un T1 lumineux et minimaliste doté d'un patio privé en pierre, parfait pour un café le matin ou un verre en plein air le soir — une rareté aussi proche du centre. Des placards aux lignes épurées, une crédence de cuisine en marbre et un petit coin bureau en font un lieu adapté aussi bien à une courte escapade qu'à quelques jours de télétravail à Porto.",
            "neighborhood": "Situé juste à côté de la Rua do Almada, l'une des rues commerçantes classiques de Baixa, ce coin résidentiel tranquille se trouve à quelques minutes à pied des Aliados, de la gare de São Bento et des quais du fleuve."
        }
    },
    "history-porto": {
        "pt": {
            "subtitle": "Um duplex com pé-direito duplo, perto da Rua de Santa Catarina",
            "description": "O History Porto é um duplex com tetos duplos, um quarto em mezanino sobre a sala de estar, e uma mistura de painéis de azulejo tradicionais e peças de traje popular que remetem para a herança artesanal da cidade. Pavimento em madeira, uma escada com guarda em vidro e grandes janelas de portadas dão ao espaço uma sensação arejada e luminosa em ambos os pisos.",
            "neighborhood": "O bairro do Bonfim, em torno da Rua de Santa Catarina, mistura o dia a dia portuense com fácil acesso ao centro — a rua comercial, cafés e o Mercado do Bolhão ficam perto, com o núcleo histórico a poucos minutos a mais."
        },
        "fr": {
            "subtitle": "Un duplex à double hauteur sous plafond, près de la Rua de Santa Catarina",
            "description": "History Porto est un duplex aux plafonds à double hauteur, avec une chambre en mezzanine surplombant le salon, et un mélange de panneaux d'azulejos traditionnels et de pièces de costume folklorique qui évoquent l'artisanat de la ville. Le parquet, un escalier à garde-corps vitré et de grandes fenêtres à volets donnent à l'espace une sensation aérée et lumineuse sur les deux niveaux.",
            "neighborhood": "Le quartier de Bonfim, autour de la Rua de Santa Catarina, mêle la vie quotidienne portuense à un accès facile au centre — la rue commerçante, les cafés et le marché du Bolhão sont tout proches, avec le centre historique à quelques minutes de plus."
        }
    },
    "casa-nina-porto": {
        "pt": {
            "subtitle": "Um T1 num condomínio fechado com piscina e jardim comuns, perto da Trindade",
            "description": "O Casa Nina Porto é um T1 luminoso na Rua dos Mártires da Liberdade, dentro de um condomínio fechado com piscina e jardim comuns — uma raridade tão perto do centro. Uma varanda privativa, uma cozinha moderna e um quarto tranquilo fazem dele uma base confortável a poucos minutos da estação de metro da Trindade.",
            "neighborhood": "Rua Mártires da Liberdade 122, 4050-361 Porto. Situado na fronteira da Baixa, este troço fica a poucos passos da Praça Coronel Pacheco, da Galeria de Paris e das lojas e cafés em torno da Trindade, com um supermercado aberto todos os dias mesmo ao lado."
        },
        "fr": {
            "subtitle": "Un T1 dans une résidence fermée avec piscine et jardin communs, près de Trindade",
            "description": "Casa Nina Porto est un T1 lumineux sur la Rua dos Mártires da Liberdade, au sein d'une résidence fermée avec piscine et jardin communs — une rareté aussi proche du centre. Un balcon privé, une cuisine moderne et une chambre paisible en font une base confortable à quelques minutes de la station de métro Trindade.",
            "neighborhood": "Rua Mártires da Liberdade 122, 4050-361 Porto. Situé à la lisière de Baixa, ce tronçon se trouve à quelques pas de la Praça Coronel Pacheco, de la Galeria de Paris et des boutiques et cafés autour de Trindade, avec un supermarché ouvert tous les jours juste à côté."
        }
    },
    "jenny-porto": {
        "pt": {
            "subtitle": "Um T1 renovado com varanda, perto do bairro artístico de Miguel Bombarda",
            "description": "O Jenny Porto é um T1 elegante e luminoso num prédio novo na Rua de Clemente Meneres, com varanda privativa, ar condicionado e elevador. Fica no bairro artístico de Miguel Bombarda, conhecido pelas suas galerias e lojas de design, a poucos passos do centro histórico.",
            "neighborhood": "Rua Clemente Menéres 64, 4050-201 Porto. Miguel Bombarda é o bairro das galerias do Porto, um recanto arborizado e criativo perto do Museu Soares dos Reis e do Jardim do Carregal, com a Baixa e o metro da Trindade a uma curta distância a pé."
        },
        "fr": {
            "subtitle": "Un T1 rénové avec balcon, près du quartier artistique de Miguel Bombarda",
            "description": "Jenny Porto est un T1 élégant et lumineux dans un immeuble neuf de la Rua de Clemente Meneres, avec balcon privé, climatisation et ascenseur. Il se trouve dans le quartier artistique de Miguel Bombarda, réputé pour ses galeries et ses boutiques de design, à deux pas du centre historique.",
            "neighborhood": "Rua Clemente Menéres 64, 4050-201 Porto. Miguel Bombarda est le quartier des galeries de Porto, un coin verdoyant et créatif près du musée Soares dos Reis et du jardin du Carregal, avec Baixa et le métro Trindade à quelques minutes à pied."
        }
    },
    "shiny-porto": {
        "pt": {
            "subtitle": "Um duplex elegante e renovado, com dois quartos para seis pessoas, na Rua do Almada",
            "description": "O Shiny Porto é um duplex elegante, totalmente renovado, de 106m² na Rua do Almada, uma das ruas clássicas da Baixa. Casas de banho revestidas a mármore, uma sala de estar de design e uma varanda privativa dão a este apartamento de dois quartos espaço confortável para até seis hóspedes, com elevador e ar condicionado.",
            "neighborhood": "Rua do Almada 382, 4050-033 Porto. A Rua do Almada atravessa o coração da Baixa, a 100 metros da estação de metro da Trindade e a poucos minutos a pé da Avenida dos Aliados, da Câmara Municipal e da Galeria de Paris — com um supermercado aberto todos os dias mesmo na rua."
        },
        "fr": {
            "subtitle": "Un duplex élégant et rénové, avec deux chambres pour six personnes, sur la Rua do Almada",
            "description": "Shiny Porto est un duplex élégant et entièrement rénové de 106m² sur la Rua do Almada, l'une des rues classiques de Baixa. Des salles de bains habillées de marbre, un salon design et un balcon privé offrent à cet appartement de deux chambres un espace confortable pour six personnes, avec ascenseur et climatisation.",
            "neighborhood": "Rua do Almada 382, 4050-033 Porto. La Rua do Almada traverse le cœur de Baixa, à 100 mètres de la station de métro Trindade et à quelques minutes à pied de l'Avenida dos Aliados, de la mairie et de la Galeria de Paris — avec un supermarché ouvert tous les jours juste dans la rue."
        }
    },
    "so-shiny-porto": {
        "pt": {
            "subtitle": "Um T2 luminoso na Rua do Duque de Saldanha, junto ao Jardim de São Lázaro",
            "description": "O So Shiny Porto é um apartamento luminoso de 90m², com dois quartos e três casas de banho, na Rua do Duque de Saldanha, na tranquila zona das Fontaínhas. Azulejos azuis, um terraço privativo com zona de estar e ar condicionado em todas as divisões fazem deste um espaço confortável para até quatro hóspedes, a poucos minutos da margem do Douro.",
            "neighborhood": "Rua Duque de Saldanha 535, 4300-466 Porto. A Rua do Duque de Saldanha situa-se entre o Jardim de São Lázaro e a Escola Superior Artística do Porto, numa zona residencial tranquila que desce em direção ao Douro. O centro histórico e a Ribeira ficam ambos a uma curta caminhada."
        },
        "fr": {
            "subtitle": "Un T2 lumineux sur la Rua do Duque de Saldanha, à côté du Jardin de São Lázaro",
            "description": "So Shiny Porto est un appartement lumineux de 90m², avec deux chambres et trois salles de bains, sur la Rua do Duque de Saldanha, dans le quartier calme des Fontaínhas. Des azulejos bleus, une terrasse privée avec coin salon et la climatisation dans toutes les pièces en font un espace confortable pour quatre personnes, à quelques minutes des rives du Douro.",
            "neighborhood": "Rua Duque de Saldanha 535, 4300-466 Porto. La Rua do Duque de Saldanha se situe entre le Jardin de São Lázaro et l'École Supérieure Artistique de Porto, un quartier résidentiel calme qui descend vers le Douro. Le centre historique et la Ribeira sont tous deux accessibles à pied en quelques minutes."
        }
    },
    "beauty-porto": {
        "pt": {
            "subtitle": "Um estúdio acolhedor no Largo dos Lóios, a dois passos da Torre dos Clérigos",
            "description": "O Beauty é um estúdio acolhedor de 38m² no Largo dos Lóios, com uma varanda francesa sobre a praça, um cantinho de refeições e uma casa de banho com iluminação quente. Com elevador para os pisos superiores do prédio, é um pied-à-terre confortável e central para duas pessoas.",
            "neighborhood": "Largo dos Lóios 15, 2D, 4000-030 Porto. O Largo dos Lóios fica mesmo no centro histórico, à sombra da Torre dos Clérigos — a torre sineira de granito construída por Nicolau Nasoni, com os seus 225 degraus e vista sobre toda a cidade. A Estação de São Bento e as ruas comerciais da Baixa ficam todas a uma curta distância."
        },
        "fr": {
            "subtitle": "Un studio cosy sur le Largo dos Lóios, à deux pas de la Tour des Clérigos",
            "description": "Beauty est un studio cosy de 38m² sur le Largo dos Lóios, avec un balcon français donnant sur la place, un coin repas compact et une salle de bains à l'éclairage chaleureux. Avec un ascenseur vers les étages supérieurs de l'immeuble, c'est un pied-à-terre confortable et central pour deux personnes.",
            "neighborhood": "Largo dos Lóios 15, 2D, 4000-030 Porto. Le Largo dos Lóios se trouve en plein centre historique, à l'ombre de la Tour des Clérigos — le clocher en granit construit par Nicolau Nasoni, avec ses 225 marches et sa vue sur toute la ville. La gare de São Bento et les rues commerçantes de Baixa sont toutes à quelques minutes."
        }
    },
    "sky-de-loios-porto": {
        "pt": {
            "subtitle": "Um estúdio luminoso com tetos pintados no Largo dos Lóios",
            "description": "O Sky de Loios é um estúdio de 53m² com tetos altos, três grandes janelas de varanda francesa e um teto de época pintado à mão sobre a cama. Uma zona de vestir, uma casa de banho compacta e um pequeno espaço de estar com TV completam esta estadia luminosa e de pé-direito alto para duas pessoas no Largo dos Lóios.",
            "neighborhood": "Largo dos Lóios 78/79, 4º frt, 4000-189 Porto. O Largo dos Lóios fica no coração do centro histórico, perto da Torre e da Igreja dos Clérigos, com vistas de telhado sobre as torres sineiras emblemáticas da cidade. A Estação de São Bento e as ruas comerciais da Baixa ficam todas a uma curta distância."
        },
        "fr": {
            "subtitle": "Un studio lumineux aux plafonds peints sur le Largo dos Lóios",
            "description": "Sky de Loios est un studio de 53m² aux plafonds hauts, avec trois grandes fenêtres à la française et un plafond d'époque peint à la main au-dessus du lit. Un coin dressing, une salle de bains compacte et un petit coin salon avec TV complètent ce séjour lumineux et haut de plafond pour deux personnes sur le Largo dos Lóios.",
            "neighborhood": "Largo dos Lóios 78/79, 4º frt, 4000-189 Porto. Le Largo dos Lóios se trouve au cœur du centre historique, près de la Tour et de l'Église des Clérigos, avec des vues sur les toits vers les clochers emblématiques de la ville. La gare de São Bento et les rues commerçantes de Baixa sont toutes à quelques minutes."
        }
    },
    "truly-porto": {
        "pt": {
            "subtitle": "Um T1 luminoso com terraço no bairro artístico de Miguel Bombarda",
            "description": "O Truly Porto é um elegante apartamento de 75m² com varanda privativa e acesso a jardim, num prédio totalmente renovado no bairro artístico de Miguel Bombarda. Wi-Fi, ar condicionado, máquina de lavar roupa e máquina de lavar loiça fazem deste um espaço confortável para duas pessoas, com elevador no prédio.",
            "neighborhood": "Rua Clemente Menéres 61, 4050-202 Porto. Miguel Bombarda é o bairro das galerias do Porto, uma zona verde e criativa perto do museu Soares dos Reis e do jardim do Carregal, com a Baixa e a estação de metro da Trindade a poucos minutos."
        },
        "fr": {
            "subtitle": "Un T1 lumineux avec terrasse dans le quartier artistique de Miguel Bombarda",
            "description": "Truly Porto est un appartement élégant de 75m² avec balcon privé et accès à un jardin, dans un immeuble entièrement rénové du quartier artistique de Miguel Bombarda. Wi-Fi, climatisation, lave-linge et lave-vaisselle en font un espace confortable pour deux personnes, avec ascenseur dans l'immeuble.",
            "neighborhood": "Rua Clemente Menéres 61, 4050-202 Porto. Miguel Bombarda est le quartier des galeries de Porto, un coin verdoyant et créatif près du musée Soares dos Reis et du jardin du Carregal, avec Baixa et le métro Trindade à quelques minutes à pied."
        }
    },
    "loungy-porto": {
        "pt": {
            "subtitle": "Um T2 com lareira na histórica Rua Dom João IV",
            "description": "O Loungy é um espaçoso apartamento de dois quartos na Rua Dom João IV, com lareira a lenha na sala de estar, uma zona de jantar para quatro pessoas e um espaço exterior. Duas casas de banho completas, máquina de lavar roupa e máquina de lavar loiça, e ar condicionado em todas as divisões fazem dele uma estadia confortável para dois casais ou uma família.",
            "neighborhood": "A Rua Dom João IV é uma rua histórica no Bonfim, com o nome do rei da Restauração que libertou Portugal do domínio espanhol em 1640. É uma zona residencial próxima do dia a dia do bairro, com o centro do Porto a uma curta distância."
        },
        "fr": {
            "subtitle": "Un T2 avec cheminée sur la historique Rua Dom João IV",
            "description": "Loungy est un spacieux appartement de deux chambres sur la Rua Dom João IV, avec une cheminée à bois dans le salon, un coin repas pour quatre personnes et un espace extérieur. Deux salles de bains complètes, lave-linge et lave-vaisselle, et la climatisation dans toutes les pièces en font un séjour confortable pour deux couples ou une famille.",
            "neighborhood": "La Rua Dom João IV est une rue historique du Bonfim, nommée d'après le roi de la Restauration qui libéra le Portugal de la domination espagnole en 1640. C'est un quartier résidentiel proche de la vie de tous les jours, avec le centre de Porto à une courte distance."
        }
    },
    "volta-do-patio-porto": {
        "pt": {
            "subtitle": "Um apartamento sofisticado de dois quartos, com pátio, no trendy Bonfim",
            "description": "Volta do Pátio é um apartamento sofisticado de dois quartos no bairro trendy do Bonfim, com acesso direto a um pátio privado. O segundo quarto tem um sofá-cama. A sala tem TV de ecrã plano, a cozinha está totalmente equipada, e Wi-Fi de alta velocidade e um espaço de trabalho dedicado tornam-no uma base confortável para até quatro hóspedes.",
            "neighborhood": "Bonfim é um dos bairros residenciais em ascensão do Porto, que junta ruas tradicionais a uma oferta crescente de cafés e restaurantes."
        },
        "fr": {
            "subtitle": "Un appartement sophistiqué de deux chambres avec patio, dans le quartier branché de Bonfim",
            "description": "Volta do Pátio est un appartement sophistiqué de deux chambres dans le quartier branché de Bonfim, avec accès direct à un patio privé. La deuxième chambre dispose d'un canapé-lit. Le salon dispose d'une TV à écran plat, la cuisine est entièrement équipée, et le Wi-Fi haut débit ainsi qu'un espace de travail dédié en font une base confortable pour quatre voyageurs.",
            "neighborhood": "Bonfim est l'un des quartiers résidentiels montants de Porto, mêlant rues traditionnelles et offre croissante de cafés et restaurants."
        }
    },
    "cocoon-almada-porto": {
        "pt": {
            "subtitle": "Um T1 acolhedor a poucos passos do metro da Trindade",
            "description": "O Cocoon Almada é um apartamento compacto e confortável de um quarto perto da Rua do Dr. Ricardo Jorge, ideal para um casal a explorar o Porto a pé. O quarto tem TV de parede, o cantinho de pequeno-almoço é um espaço luminoso para um café matinal, e o prédio tem elevador. Ar condicionado e aquecimento mantêm tudo confortável ao longo do ano.",
            "neighborhood": "Rua Dr. Ricardo Jorge 96, 4050-039 Porto. Esta zona da Baixa fica entre a Trindade e os Aliados, a poucos minutos a pé da Câmara Municipal e da principal praça cívica da cidade. É uma base bem localizada, com o metro, cafés e comércio do dia a dia todos por perto."
        },
        "fr": {
            "subtitle": "Un T1 chaleureux à deux pas du métro Trindade",
            "description": "Cocoon Almada est un appartement compact et confortable d'une chambre près de la Rua do Dr. Ricardo Jorge, idéal pour un couple explorant Porto à pied. La chambre dispose d'une TV murale, le coin petit-déjeuner est un espace lumineux pour un café matinal, et l'immeuble dispose d'un ascenseur. Climatisation et chauffage garantissent le confort toute l'année.",
            "neighborhood": "Rua Dr. Ricardo Jorge 96, 4050-039 Porto. Ce coin de la Baixa se situe entre Trindade et Aliados, à quelques minutes à pied de la Câmara Municipal et de la principale place civique de la ville. C'est une base bien située, avec le métro, les cafés et les commerces du quotidien tout proches."
        }
    },
    "tomas-loft-porto": {
        "pt": {
            "subtitle": "Um T2 espaçoso com varanda na Rua de Fernandes Tomás",
            "description": "O Tomas Loft é um impressionante apartamento de 194m² em sótão, com vigas de madeira à vista sobre uma sala de estar e jantar de conceito aberto, uma varanda privativa e um cantinho de estar acolhedor. Dois quartos completos e duas casas de banho tornam-no confortável para dois casais ou uma família, com cozinha totalmente equipada, máquina de lavar loiça e máquina de lavar roupa para estadias mais longas.",
            "neighborhood": "Rua Fernandes Tomás 235, 4000-215 Porto. A Rua de Fernandes Tomás fica mesmo no coração dos Aliados e do Bolhão, a curta distância do histórico Mercado do Bolhão e da grande avenida central do Porto. É uma das bases mais centrais da cidade, com o metro da Trindade e a Câmara Municipal ambos por perto."
        },
        "fr": {
            "subtitle": "Un T2 spacieux avec balcon sur la Rua de Fernandes Tomás",
            "description": "Tomas Loft est un appartement impressionnant de 194m² sous les combles, avec des poutres en bois apparentes surplombant un séjour et une salle à manger à aire ouverte, un balcon privé et un coin salon chaleureux. Deux chambres complètes et deux salles de bains en font un séjour confortable pour deux couples ou une famille, avec une cuisine entièrement équipée, lave-vaisselle et lave-linge pour les séjours plus longs.",
            "neighborhood": "Rua Fernandes Tomás 235, 4000-215 Porto. La Rua de Fernandes Tomás se trouve en plein cœur d'Aliados et du Bolhão, à quelques pas du historique Mercado do Bolhão et de la grande avenue centrale de Porto. C'est l'une des bases les plus centrales de la ville, avec le métro Trindade et la Câmara Municipal tous deux à proximité."
        }
    },
    "family-porto": {
        "pt": {
            "subtitle": "Um T4 num piso inteiro na Rua Duque de Loulé",
            "description": "O Family Porto é um espaçoso apartamento de quatro quartos que ocupa o primeiro andar de um prédio clássico do Porto, com uma sala de estar e jantar luminosa, cozinha aberta e duas casas de banho completas. Cada um dos quatro quartos tem decoração própria, tornando esta uma base confortável para um grupo grande ou família em visita à cidade.",
            "neighborhood": "Rua Duque de Loulé 22. A Rua Duque de Loulé atravessa o coração da Baixa, perto da Estação de São Bento e do Largo 1º de Dezembro (Batalha), com a Ribeira e a Avenida dos Aliados a uma curta distância a pé."
        },
        "fr": {
            "subtitle": "Un T4 sur un étage entier de la Rua Duque de Loulé",
            "description": "Family Porto est un spacieux appartement de quatre chambres occupant le premier étage d'un immeuble classique de Porto, avec un séjour et une salle à manger lumineux, une cuisine ouverte et deux salles de bains complètes. Chacune des quatre chambres a sa propre décoration, ce qui en fait une base confortable pour un grand groupe ou une famille en visite dans la ville.",
            "neighborhood": "Rua Duque de Loulé 22. La Rua Duque de Loulé traverse le cœur de la Baixa, près de la gare de São Bento et de la place Batalha, avec la Ribeira et l'Avenida dos Aliados toutes deux à quelques minutes à pied."
        }
    },
    "so-family-porto": {
        "pt": {
            "subtitle": "Um T4 com escritório na Rua Duque de Loulé",
            "description": "O So Family Porto é um amplo apartamento de quatro quartos no mesmo prédio histórico do Family Porto, com três casas de banho completas, um pequeno escritório e uma lavandaria própria. Camas individuais e de casal distribuídas pelos quatro quartos tornam-no adequado para grupos de amigos ou família alargada a viajar juntos.",
            "neighborhood": "Rua Duque de Loulé 22. A Rua Duque de Loulé atravessa o coração da Baixa, perto da Estação de São Bento e do Largo 1º de Dezembro (Batalha), com a Ribeira e a Avenida dos Aliados a uma curta distância a pé."
        },
        "fr": {
            "subtitle": "Un T4 avec bureau sur la Rua Duque de Loulé",
            "description": "So Family Porto est un vaste appartement de quatre chambres situé dans le même immeuble historique que Family Porto, avec trois salles de bains complètes, un petit bureau et une buanderie dédiée. Des lits simples et doubles répartis dans les quatre chambres en font un logement adapté aux groupes d'amis ou aux familles élargies voyageant ensemble.",
            "neighborhood": "Rua Duque de Loulé 22. La Rua Duque de Loulé traverse le cœur de la Baixa, près de la gare de São Bento et de la place Batalha, avec la Ribeira et l'Avenida dos Aliados toutes deux à quelques minutes à pied."
        }
    },
    "purely-porto": {
        "pt": {
            "subtitle": "Um T4 com uma sala de jantar azul-petróleo na Rua Duque de Loulé",
            "description": "O Purely Porto ocupa o último andar do mesmo prédio histórico do Family Porto e do So Family Porto, com uma sala de jantar de parede azul-petróleo para oito pessoas, uma cozinha comprida e quatro quartos com decoração própria. Duas casas de banho completas — uma clássica, outra revestida a mosaico azul — tornam esta uma base confortável para um grupo grande ou família alargada em visita à cidade.",
            "neighborhood": "Rua Duque de Loulé 22. A Rua Duque de Loulé atravessa o coração da Baixa, perto da Estação de São Bento e do Largo 1º de Dezembro (Batalha), com a Ribeira e a Avenida dos Aliados a uma curta distância a pé."
        },
        "fr": {
            "subtitle": "Un T4 avec une salle à manger bleu paon sur la Rua Duque de Loulé",
            "description": "Purely Porto occupe le dernier étage du même immeuble historique que Family Porto et So Family Porto, avec une salle à manger aux murs bleu paon pour huit personnes, une cuisine tout en longueur et quatre chambres à la décoration propre. Deux salles de bains complètes — une classique, l'autre habillée de mosaïque bleue — en font une base confortable pour un grand groupe ou une famille élargie en visite dans la ville.",
            "neighborhood": "Rua Duque de Loulé 22. La Rua Duque de Loulé traverse le cœur de la Baixa, près de la gare de São Bento et de la place Batalha, avec la Ribeira et l'Avenida dos Aliados toutes deux à quelques minutes à pied."
        }
    },
    "so-simply-ribeira": {
        "pt": {
            "subtitle": "Um T2 com varanda e vista sobre a Ribeira",
            "description": "O So Simply Ribeira é um apartamento luminoso de dois quartos na Rua de São Francisco, com portas de varanda que abrem sobre os telhados do centro histórico e uma mesa de jantar para quatro pessoas. Uma cozinha totalmente equipada e um segundo quarto com ventoinha tornam esta uma base confortável e bem localizada para explorar o centro histórico do Porto a pé.",
            "neighborhood": "A Rua de São Francisco é uma das ruas mais emblemáticas da Ribeira, junto à dourada Igreja de São Francisco e a uma curta descida da Ribeira e do rio Douro."
        },
        "fr": {
            "subtitle": "Un T2 avec balcon et vue sur la Ribeira",
            "description": "So Simply Ribeira est un appartement lumineux de deux chambres sur la Rua de São Francisco, avec des portes-fenêtres donnant sur les toits du centre historique et une table à manger pour quatre personnes. Une cuisine entièrement équipée et une deuxième chambre avec ventilateur en font une base confortable et bien située pour explorer le centre historique de Porto à pied.",
            "neighborhood": "La Rua de São Francisco est l'une des rues les plus emblématiques de la Ribeira, à côté de la dorée Église de São Francisco et à quelques pas en descendant vers la Ribeira et le Douro."
        }
    },
    "charming-garden-porto": {
        "pt": {
            "subtitle": "Um duplex luminoso com um jardim privado totalmente fechado, nas Fontaínhas",
            "description": "Um duplex luminoso e tranquilo nas Fontaínhas, construído à volta do seu próprio jardim privado totalmente fechado — uma oliveira, caminhos de gravilha e cadeiras em rattan escondidas atrás dos muros do prédio. No interior, uma sala de estar e jantar de pé-direito duplo tem lugar para quatro pessoas sob vigas de madeira à vista, junto a uma cozinha totalmente equipada com máquina de lavar loiça e máquina de café expresso. No piso de cima, dois quartos de casal — um deles em suite — partilham duas casas de banho completas com chuveiro. A 10 minutos a pé da estação de metro 24 de Agosto.",
            "neighborhood": "Rua de São Vitor 31, Fontaínhas, a 10 minutos a pé da estação de metro 24 de Agosto."
        },
        "fr": {
            "subtitle": "Un duplex lumineux avec un jardin privé entièrement clos, à Fontaínhas",
            "description": "Un duplex lumineux et paisible à Fontaínhas, construit autour de son propre jardin privé entièrement clos — un olivier, des allées de gravier et des fauteuils en rotin cachés derrière les murs de l'immeuble. À l'intérieur, un séjour-salle à manger à double hauteur accueille quatre convives sous des poutres en bois apparentes, à côté d'une cuisine entièrement équipée avec lave-vaisselle et machine à expresso. À l'étage, deux chambres avec lit double — dont une en suite — partagent deux salles de bains complètes avec douche. À 10 minutes à pied de la station de métro 24 de Agosto.",
            "neighborhood": "Rua de São Vitor 31, Fontaínhas, à 10 minutes à pied de la station de métro 24 de Agosto."
        }
    },
    "torrinha-a-porto": {
        "pt": {
            "subtitle": "Um estúdio luminoso no bairro artístico de Miguel Bombarda",
            "description": "O Torrinha A é um estúdio luminoso e bem equipado, num prédio renovado na Rua da Torrinha, no coração do bairro artístico de Miguel Bombarda, no Porto. Uma sala de estar confortável, uma cozinha compacta e uma cama de casal aconchegante fazem deste estúdio uma base calma e bem localizada para explorar a cidade a pé.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda é o bairro das galerias do Porto, um recanto arborizado e criativo perto do Museu Soares dos Reis e do Jardim do Carregal, com a Baixa e o metro da Trindade a uma curta distância a pé."
        },
        "fr": {
            "subtitle": "Un studio lumineux dans le quartier artistique de Miguel Bombarda",
            "description": "Torrinha A est un studio lumineux et bien équipé, dans un immeuble rénové de la Rua da Torrinha, au cœur du quartier artistique de Miguel Bombarda, à Porto. Un salon confortable, une cuisine compacte et un lit double douillet font de ce studio une base calme et bien située pour explorer la ville à pied.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda est le quartier des galeries de Porto, un coin verdoyant et créatif près du musée Soares dos Reis et du jardin du Carregal, avec Baixa et le métro Trindade à quelques minutes à pied."
        }
    },
    "torrinha-b-porto": {
        "pt": {
            "subtitle": "Um estúdio com pequeno terraço em Miguel Bombarda",
            "description": "O Torrinha B é um estúdio luminoso com um pequeno terraço privativo, num prédio renovado na Rua da Torrinha, no coração do bairro artístico de Miguel Bombarda, no Porto. Um cantinho de estar aconchegante, uma cozinha compacta e uma cama de casal confortável fazem deste estúdio calmo e bem localizado, ideal para explorar a cidade a pé.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda é o bairro das galerias do Porto, um recanto arborizado e criativo perto do Museu Soares dos Reis e do Jardim do Carregal, com a Baixa e o metro da Trindade a uma curta distância a pé."
        },
        "fr": {
            "subtitle": "Un studio avec petite terrasse à Miguel Bombarda",
            "description": "Torrinha B est un studio lumineux avec une petite terrasse privée, dans un immeuble rénové de la Rua da Torrinha, au cœur du quartier artistique de Miguel Bombarda, à Porto. Un coin salon douillet, une cuisine compacte et un lit double confortable font de ce studio calme et bien situé un lieu idéal pour explorer la ville à pied.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda est le quartier des galeries de Porto, un coin verdoyant et créatif près du musée Soares dos Reis et du jardin du Carregal, avec Baixa et le métro Trindade à quelques minutes à pied."
        }
    },
    "torrinha-c-porto": {
        "pt": {
            "subtitle": "Um duplex no bairro artístico de Miguel Bombarda",
            "description": "O Torrinha C é um duplex luminoso num prédio renovado na Rua da Torrinha, no coração do bairro artístico de Miguel Bombarda, no Porto. Uma zona de jantar com vigas de madeira à vista, uma sala de estar confortável sob a escada e um quarto de casal aconchegante fazem deste apartamento uma base calma e bem localizada para explorar a cidade a pé.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda é o bairro das galerias do Porto, um recanto arborizado e criativo perto do Museu Soares dos Reis e do Jardim do Carregal, com a Baixa e o metro da Trindade a uma curta distância a pé."
        },
        "fr": {
            "subtitle": "Un duplex dans le quartier artistique de Miguel Bombarda",
            "description": "Torrinha C est un duplex lumineux dans un immeuble rénové de la Rua da Torrinha, au cœur du quartier artistique de Miguel Bombarda, à Porto. Un coin repas aux poutres apparentes, un salon confortable sous l'escalier et une chambre double douillette font de cet appartement une base calme et bien située pour explorer la ville à pied.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda est le quartier des galeries de Porto, un coin verdoyant et créatif près du musée Soares dos Reis et du jardin du Carregal, avec Baixa et le métro Trindade à quelques minutes à pied."
        }
    },
    "torrinha-d-porto": {
        "pt": {
            "subtitle": "Um duplex no bairro artístico de Miguel Bombarda",
            "description": "O Torrinha D é um duplex luminoso num prédio renovado na Rua da Torrinha, no coração do bairro artístico de Miguel Bombarda, no Porto. Uma sala de estar confortável sob a escada, uma casa de banho moderna e um quarto de casal aconchegante fazem deste apartamento uma base calma e bem localizada para explorar a cidade a pé.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda é o bairro das galerias do Porto, um recanto arborizado e criativo perto do Museu Soares dos Reis e do Jardim do Carregal, com a Baixa e o metro da Trindade a uma curta distância a pé."
        },
        "fr": {
            "subtitle": "Un duplex dans le quartier artistique de Miguel Bombarda",
            "description": "Torrinha D est un duplex lumineux dans un immeuble rénové de la Rua da Torrinha, au cœur du quartier artistique de Miguel Bombarda, à Porto. Un salon confortable sous l'escalier, une salle de bains moderne et une chambre double douillette font de cet appartement une base calme et bien située pour explorer la ville à pied.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda est le quartier des galeries de Porto, un coin verdoyant et créatif près du musée Soares dos Reis et du jardin du Carregal, avec Baixa et le métro Trindade à quelques minutes à pied."
        }
    },
    "torrinha-e-porto": {
        "pt": {
            "subtitle": "Um duplex com acesso a jardim em Miguel Bombarda",
            "description": "O Torrinha E é um duplex luminoso com acesso a um jardim comum, num prédio renovado na Rua da Torrinha, no coração do bairro artístico de Miguel Bombarda, no Porto. Uma zona de jantar que abre para o jardim, uma sala de estar confortável e um quarto de casal aconchegante fazem deste apartamento calmo e bem localizado, ideal para explorar a cidade a pé.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda é o bairro das galerias do Porto, um recanto arborizado e criativo perto do Museu Soares dos Reis e do Jardim do Carregal, com a Baixa e o metro da Trindade a uma curta distância a pé."
        },
        "fr": {
            "subtitle": "Un duplex avec accès au jardin à Miguel Bombarda",
            "description": "Torrinha E est un duplex lumineux avec accès à un jardin commun, dans un immeuble rénové de la Rua da Torrinha, au cœur du quartier artistique de Miguel Bombarda, à Porto. Un coin repas ouvrant sur le jardin, un salon confortable et une chambre double douillette font de cet appartement calme et bien situé un lieu idéal pour explorer la ville à pied.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda est le quartier des galeries de Porto, un coin verdoyant et créatif près du musée Soares dos Reis et du jardin du Carregal, avec Baixa et le métro Trindade à quelques minutes à pied."
        }
    },
    "torrinha-f-porto": {
        "pt": {
            "subtitle": "Um estúdio com terraço no bairro artístico de Miguel Bombarda",
            "description": "O Torrinha F é um estúdio luminoso com terraço privativo, num prédio renovado na Rua da Torrinha, no coração do bairro artístico de Miguel Bombarda, no Porto. Uma sala de estar e zona de jantar aconchegantes que abrem para o terraço, uma cozinha compacta e uma cama de casal confortável fazem deste estúdio calmo e bem localizado, ideal para explorar a cidade a pé.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda é o bairro das galerias do Porto, um recanto arborizado e criativo perto do Museu Soares dos Reis e do Jardim do Carregal, com a Baixa e o metro da Trindade a uma curta distância a pé."
        },
        "fr": {
            "subtitle": "Un studio avec terrasse dans le quartier artistique de Miguel Bombarda",
            "description": "Torrinha F est un studio lumineux avec terrasse privée, dans un immeuble rénové de la Rua da Torrinha, au cœur du quartier artistique de Miguel Bombarda, à Porto. Un salon et un coin repas douillets ouvrant sur la terrasse, une cuisine compacte et un lit double confortable font de ce studio calme et bien situé un lieu idéal pour explorer la ville à pied.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda est le quartier des galeries de Porto, un coin verdoyant et créatif près du musée Soares dos Reis et du jardin du Carregal, avec Baixa et le métro Trindade à quelques minutes à pied."
        }
    },
    "torrinha-g-porto": {
        "pt": {
            "subtitle": "Um estúdio luminoso no bairro artístico de Miguel Bombarda",
            "description": "O Torrinha G é um estúdio luminoso e bem equipado, num prédio renovado na Rua da Torrinha, no coração do bairro artístico de Miguel Bombarda, no Porto. Uma sala de estar confortável, uma cozinha compacta e uma cama de casal aconchegante fazem deste estúdio uma base calma e bem localizada para explorar a cidade a pé.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda é o bairro das galerias do Porto, um recanto arborizado e criativo perto do Museu Soares dos Reis e do Jardim do Carregal, com a Baixa e o metro da Trindade a uma curta distância a pé."
        },
        "fr": {
            "subtitle": "Un studio lumineux dans le quartier artistique de Miguel Bombarda",
            "description": "Torrinha G est un studio lumineux et bien équipé, dans un immeuble rénové de la Rua da Torrinha, au cœur du quartier artistique de Miguel Bombarda, à Porto. Un salon confortable, une cuisine compacte et un lit double douillet font de ce studio une base calme et bien située pour explorer la ville à pied.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda est le quartier des galeries de Porto, un coin verdoyant et créatif près du musée Soares dos Reis et du jardin du Carregal, avec Baixa et le métro Trindade à quelques minutes à pied."
        }
    },
    "torrinha-h-porto": {
        "pt": {
            "subtitle": "Um estúdio luminoso no bairro artístico de Miguel Bombarda",
            "description": "O Torrinha H é um estúdio luminoso e bem equipado, num prédio renovado na Rua da Torrinha, no coração do bairro artístico de Miguel Bombarda, no Porto. Uma sala de estar confortável com grandes janelas, uma cozinha compacta e uma cama de casal aconchegante fazem deste estúdio uma base calma e bem localizada para explorar a cidade a pé.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda é o bairro das galerias do Porto, um recanto arborizado e criativo perto do Museu Soares dos Reis e do Jardim do Carregal, com a Baixa e o metro da Trindade a uma curta distância a pé."
        },
        "fr": {
            "subtitle": "Un studio lumineux dans le quartier artistique de Miguel Bombarda",
            "description": "Torrinha H est un studio lumineux et bien équipé, dans un immeuble rénové de la Rua da Torrinha, au cœur du quartier artistique de Miguel Bombarda, à Porto. Un salon confortable aux grandes fenêtres, une cuisine compacte et un lit double douillet font de ce studio une base calme et bien située pour explorer la ville à pied.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda est le quartier des galeries de Porto, un coin verdoyant et créatif près du musée Soares dos Reis et du jardin du Carregal, avec Baixa et le métro Trindade à quelques minutes à pied."
        }
    },
    "charmy-studio-porto": {
        "pt": {
            "subtitle": "Um estúdio duplex com escada em caracol e vista de varanda sobre a Baixa — 3º andar, sem elevador",
            "description": "O Charmy Studio é um duplex luminoso no 3º andar de um prédio clássico da Baixa — só com acesso por escadas, sem elevador — onde uma escada em caracol de ferro forjado sobe até uma sala de estar em mezanino com portas francesas viradas para os telhados de azulejo do outro lado da rua. No piso de baixo, um frigorífico retro e uma cozinha em mármore e latão ficam ao lado de uma cama confortável. Há um sofá-cama disponível para um terceiro hóspede, mediante um suplemento de 20€ por estadia.",
            "neighborhood": "Rua de Álvares Cabral 372, Porto. A Baixa é o centro histórico do Porto — ruas de calçada, fachadas de azulejo, e a maior concentração de cafés, lojas e miradouros da cidade, com a Rua do Almada e os Aliados a poucos minutos."
        },
        "fr": {
            "subtitle": "Un studio duplex avec escalier en colimaçon et vue balcon sur la Baixa — 3e étage, sans ascenseur",
            "description": "Charmy Studio est un duplex lumineux au 3e étage d'un immeuble classique de la Baixa — accessible uniquement par les escaliers, sans ascenseur — où un escalier en colimaçon en fer forgé mène à un salon en mezzanine avec portes-fenêtres donnant sur les toits en azulejos de l'autre côté de la rue. Au rez-de-chaussée, un réfrigérateur rétro et une cuisine en marbre et laiton côtoient un lit confortable. Un canapé-lit est disponible pour un troisième voyageur, moyennant un supplément de 20€ par séjour.",
            "neighborhood": "Rua de Álvares Cabral 372, Porto. La Baixa est le centre historique de Porto — rues pavées, façades d'azulejos, et la plus grande concentration de cafés, boutiques et miradouros de la ville, avec la Rua do Almada et les Aliados à quelques minutes."
        }
    },
    "torrinha-i-porto": {
        "pt": {
            "subtitle": "Um estúdio luminoso no bairro artístico de Miguel Bombarda",
            "description": "O Torrinha I é um estúdio luminoso e bem equipado, num prédio renovado na Rua da Torrinha, no coração do bairro artístico de Miguel Bombarda, no Porto. Uma sala de estar confortável, uma cozinha compacta e uma cama de casal aconchegante fazem deste estúdio uma base calma e bem localizada para explorar a cidade a pé.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda é o bairro das galerias do Porto, um recanto arborizado e criativo perto do Museu Soares dos Reis e do Jardim do Carregal, com a Baixa e o metro da Trindade a uma curta distância a pé."
        },
        "fr": {
            "subtitle": "Un studio lumineux dans le quartier artistique de Miguel Bombarda",
            "description": "Torrinha I est un studio lumineux et bien équipé, dans un immeuble rénové de la Rua da Torrinha, au cœur du quartier artistique de Miguel Bombarda, à Porto. Un salon confortable, une cuisine compacte et un lit double douillet font de ce studio une base calme et bien située pour explorer la ville à pied.",
            "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda est le quartier des galeries de Porto, un coin verdoyant et créatif près du musée Soares dos Reis et du jardin du Carregal, avec Baixa et le métro Trindade à quelques minutes à pied."
        }
    },
    "loft-sto-antonio-porto": {
        "pt": {
            "subtitle": "Um loft luminoso em mezanino na Rua de Santo Ildefonso, perto do Bolhão",
            "description": "O Loft Sto António é um loft luminoso e de tecto alto num prédio clássico de granito na Rua de Santo Ildefonso, com janelas altas de portadas viradas para a rua. Uma sala de estar e jantar de conceito aberto no piso principal tem um confortável sofá-cama, enquanto uma escada de madeira sobe até um aconchegante quarto em mezanino, sob as vigas de madeira à vista. Uma kitchenette compacta cobre o essencial — jarro elétrico, máquina de café, torradeira e mini-frigorífico. A poucos minutos a pé do Mercado do Bolhão e da Avenida dos Aliados, é uma base bem localizada para explorar o centro do Porto a pé.",
            "neighborhood": "Rua de Santo Ildefonso 41, Porto. Uma rua central entre a Baixa e o Bonfim, a poucos passos do Mercado do Bolhão, da Rua de Santa Catarina e dos Aliados — um dos recantos mais fáceis de percorrer a pé da cidade."
        },
        "fr": {
            "subtitle": "Un loft lumineux en mezzanine sur la Rua de Santo Ildefonso, à deux pas du Bolhão",
            "description": "Loft Sto António est un loft lumineux au plafond haut, dans un immeuble classique en granit de la Rua de Santo Ildefonso, avec de hautes fenêtres à volets donnant sur la rue. Un séjour et coin repas à aire ouverte au rez-de-chaussée abrite un canapé-lit confortable, tandis qu'un escalier en bois mène à une chambre douillette en mezzanine, sous les poutres apparentes. Une kitchenette compacte couvre l'essentiel — bouilloire, cafetière, grille-pain et mini-réfrigérateur. À quelques minutes à pied du Mercado do Bolhão et de l'Avenida dos Aliados, c'est une base bien située pour explorer le centre de Porto à pied.",
            "neighborhood": "Rua de Santo Ildefonso 41, Porto. Une rue centrale entre la Baixa et le Bonfim, à deux pas du Mercado do Bolhão, de la Rua de Santa Catarina et des Aliados — l'un des coins les plus faciles à parcourir à pied de la ville."
        }
    },
    "gardeny-porto": {
        "pt": {
            "subtitle": "Uma casa triplex com jardim privado numa rua tranquila do Bonfim",
            "description": "O Gardeny é uma casa triplex numa rua tranquila do Bonfim, com jardim privado próprio — uma raridade tão perto do centro. O piso térreo é uma sala de estar e cozinha de conceito aberto que dá para o jardim, onde a relva, um baloiço e uma mesa de jantar ficam à sombra das árvores, fechado por muros para total privacidade. Uma salamandra a lenha e uma poltrona amarela animam a sala de estar. O segundo piso tem um quarto com casa de banho própria, e o terceiro tem um segundo quarto também com casa de banho própria, além de um pequeno quarto com um sofá-cama. É uma base calma e acolhedora com espaço exterior genuíno, a poucos minutos a pé do Campo 24 de Agosto.",
            "neighborhood": "Travessa Monte dos Congregados 55, Porto. Um recanto residencial tranquilo do Bonfim, perto do Campo 24 de Agosto e a poucos passos das lojas e cafés da Rua de Costa Cabral."
        },
        "fr": {
            "subtitle": "Une maison triplex avec jardin privé dans une rue calme de Bonfim",
            "description": "Gardeny est une maison triplex dans une rue calme de Bonfim, avec son propre jardin privé — une rareté aussi près du centre. Le rez-de-chaussée est un séjour et une cuisine à aire ouverte donnant sur le jardin, où une pelouse, une balançoire et une table à manger se trouvent à l'ombre des arbres, entouré de murs pour une intimité totale. Un poêle à bois et un fauteuil jaune animent le salon. Le deuxième étage a une chambre avec salle de bain privée, et le troisième a une seconde chambre également avec salle de bain privée, ainsi qu'une petite pièce avec un canapé-lit. C'est une base calme et chaleureuse avec un véritable espace extérieur, à quelques minutes à pied du Campo 24 de Agosto.",
            "neighborhood": "Travessa Monte dos Congregados 55, Porto. Un coin résidentiel tranquille de Bonfim, près du Campo 24 de Agosto et à quelques pas des boutiques et cafés de la Rua de Costa Cabral."
        }
    },
    "gracy-porto": {
        "pt": {
            "subtitle": "Um estúdio luminoso com terraço e jardim, no coração da Baixa",
            "description": "O Gracy Porto é um estúdio luminoso e espaçoso no mesmo prédio da Baixa que o Charmy Studio, a poucos passos da Rua do Almada e dos Aliados. Uma kitchenette em mármore rosa com acabamentos em latão abre para uma sala de estar e jantar acolhedora, mobilada com peças vintage, com portas de vidro que dão para um pequeno terraço-jardim salpicado de flores silvestres. A cama queen-size fica atrás de uma estante aberta que divide o espaço, e o próprio prédio tem uma marcante escada em caracol de ferro forjado. Uma base confortável e bem equipada para duas pessoas no centro do Porto.",
            "neighborhood": "Rua de Álvares Cabral 372, Porto. A Baixa é o centro histórico do Porto — ruas de calçada, fachadas de azulejo, e a maior concentração de cafés, lojas e miradouros da cidade, com a Rua do Almada e os Aliados a poucos minutos."
        },
        "fr": {
            "subtitle": "Un studio lumineux avec terrasse et jardin, au cœur de la Baixa",
            "description": "Gracy Porto est un studio lumineux et spacieux dans le même immeuble de la Baixa que Charmy Studio, à deux pas de la Rua do Almada et des Aliados. Une kitchenette en marbre rose aux finitions laiton s'ouvre sur un séjour-salle à manger chaleureux, meublé de pièces vintage, avec des portes vitrées donnant sur une petite terrasse-jardin parsemée de fleurs sauvages. Le lit queen size se trouve derrière une étagère ouverte qui divise l'espace, et l'immeuble lui-même possède un escalier en colimaçon en fer forgé remarquable. Une base confortable et bien équipée pour deux personnes au centre de Porto.",
            "neighborhood": "Rua de Álvares Cabral 372, Porto. La Baixa est le centre historique de Porto — rues pavées, façades d'azulejos, et la plus grande concentration de cafés, boutiques et miradouros de la ville, avec la Rua do Almada et les Aliados à quelques minutes."
        }
    }
};

  /* ---------------------------------------------------------------------
     Core helpers
     --------------------------------------------------------------------- */
  function getLang() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    return SUPPORTED.indexOf(stored) !== -1 ? stored : DEFAULT_LANG;
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    listeners.forEach(function (fn) { fn(lang); });
  }

  function onLangChange(fn) { listeners.push(fn); }

  function t(key) {
    var entry = UI[key];
    if (!entry) return key;
    var lang = getLang();
    return entry[lang] || entry.en || entry.pt || key;
  }

  function pick(n, singularKey, pluralKey) {
    return n === 1 ? t(singularKey) : t(pluralKey);
  }
  function nounBedroom(n) { return pick(n, 'unit.bedroom.singular', 'unit.bedroom.plural'); }
  /** Texto completo para o nº de quartos: "Estúdio" quando é 0, "X quartos" caso contrário. */
  function bedroomLabel(n) { return n === 0 ? t('unit.studio') : (n + ' ' + nounBedroom(n)); }
  function nounGuest(n) { return pick(n, 'unit.guest.singular', 'unit.guest.plural'); }
  function nounBed(n) { return pick(n, 'unit.bed.singular', 'unit.bed.plural'); }
  function nounBathroom(n) { return pick(n, 'unit.bathroom.singular', 'unit.bathroom.plural'); }

  function translateAmenityCategory(cat) {
    var lang = getLang();
    if (lang === 'en') return cat;
    var e = AMENITY_CATEGORIES[cat];
    return (e && e[lang]) ? e[lang] : cat;
  }
  function translateAmenityItem(item) {
    var lang = getLang();
    if (lang === 'en') return item;
    var e = AMENITY_ITEMS[item];
    return (e && e[lang]) ? e[lang] : item;
  }

  function translateNearbyLabel(label) {
    var lang = getLang();
    if (lang === 'en') return label;
    var e = NEARBY_LABELS[label];
    return (e && e[lang]) ? e[lang] : label;
  }
  function translateDistance(distance) {
    var m = /^(\d+)\s*min\s*walk$/i.exec((distance || '').trim());
    if (!m) return distance;
    var n = m[1];
    var lang = getLang();
    if (lang === 'pt') return n + ' min a pé';
    if (lang === 'fr') return n + ' min à pied';
    return n + ' min walk';
  }

  function getLocalizedProperty(slug, baseProp) {
    var lang = getLang();
    if (lang === 'en' || !baseProp) return baseProp;
    var overlay = PROPERTY_TRANSLATIONS[slug];
    if (!overlay || !overlay[lang]) return baseProp;
    var merged = {};
    for (var k in baseProp) { if (Object.prototype.hasOwnProperty.call(baseProp, k)) merged[k] = baseProp[k]; }
    var t2 = overlay[lang];
    for (var k2 in t2) { if (Object.prototype.hasOwnProperty.call(t2, k2)) merged[k2] = t2[k2]; }
    return merged;
  }

  function formatDecimal(value) {
    var lang = getLang();
    var str = value.toString();
    return lang === 'en' ? str.replace(',', '.') : str.replace('.', ',');
  }
  function formatRating(rating) { return formatDecimal(rating.toFixed(2)); }
  function formatPrice(price) { return formatDecimal(price); }

  /* ---------------------------------------------------------------------
     DOM application
     --------------------------------------------------------------------- */
  function applyStaticTranslations(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    root.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    root.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
    });
    document.documentElement.setAttribute('lang', getLang());
  }

  function updateLangToggleUI() {
    var lang = getLang();
    document.querySelectorAll('.lang-toggle [data-lang]').forEach(function (span) {
      var isActive = span.getAttribute('data-lang') === lang;
      span.classList.toggle('active', isActive);
      span.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function initLanguageSwitcher(onChange) {
    document.querySelectorAll('.lang-toggle [data-lang]').forEach(function (span) {
      span.addEventListener('click', function () { setLang(span.getAttribute('data-lang')); });
    });
    applyStaticTranslations();
    updateLangToggleUI();
    onLangChange(function () {
      applyStaticTranslations();
      updateLangToggleUI();
      if (onChange) onChange(getLang());
    });
  }

  window.I18N = {
    getLang: getLang,
    setLang: setLang,
    onLangChange: onLangChange,
    t: t,
    nounBedroom: nounBedroom,
    bedroomLabel: bedroomLabel,
    nounGuest: nounGuest,
    nounBed: nounBed,
    nounBathroom: nounBathroom,
    translateAmenityCategory: translateAmenityCategory,
    translateAmenityItem: translateAmenityItem,
    translateNearbyLabel: translateNearbyLabel,
    translateDistance: translateDistance,
    getLocalizedProperty: getLocalizedProperty,
    formatRating: formatRating,
    formatPrice: formatPrice,
    applyStaticTranslations: applyStaticTranslations,
    initLanguageSwitcher: initLanguageSwitcher
  };

})();
