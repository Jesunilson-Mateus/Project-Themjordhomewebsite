/* =========================================================================
   THEMAJORD'HOME — Properties data
   Single source of truth for every apartment. The homepage cards and the
   property.html template both read from this file. To add a new apartment,
   add a new entry here — no other file needs to change.
   ========================================================================= */

const PROPERTIES = {
    "fabrica-no-jardim": {
        "name": "Fábrica no Jardim",
        "subtitle": "A light-filled duplex wrapped in granite and greenery",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 3,
        "bathrooms": 2,
        "size_m2": 167,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": true,
        "heroImage": "img/fabrica-no-jardim/06-garden-facade.jpg",
        "images": [
            "img/fabrica-no-jardim/06-garden-facade.jpg",
            "img/fabrica-no-jardim/02-terrace-main.jpeg",
            "img/fabrica-no-jardim/05-terrace-night.jpeg",
            "img/fabrica-no-jardim/01-studio.jpg",
            "img/fabrica-no-jardim/04-living.jpg",
            "img/fabrica-no-jardim/03-terrace-day.jpeg"
        ],
        "description": "Tucked behind a stone garden wall in the heart of Baixa, Fábrica no Jardim pairs a corrugated-metal facade with a quiet, plant-filled terrace — a private outdoor room framed by an old olive tree and a granite retaining wall. Inside, the duplex opens onto vintage and contemporary pieces side by side: a curved boucle sofa, industrial pendant lamps, exposed beams. It's a home for slow mornings on the terrace and easy evenings under the fairy-lit tree, a few minutes' walk from the Aliados and the Douro.",
        "neighborhood": "Rua do Almada 556, 4000-059 Porto. Baixa is Porto's historic centre — cobbled streets, azulejo facades, and the widest concentration of cafés, shops, and miradouros in the city.",
        "nearby": [
            {
                "label": "Avenida dos Aliados",
                "distance": "6 min walk"
            },
            {
                "label": "São Bento train station",
                "distance": "9 min walk"
            },
            {
                "label": "Ribeira riverfront",
                "distance": "12 min walk"
            },
            {
                "label": "Mercado do Bolhão",
                "distance": "8 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Air conditioning",
                "Fresh linens",
                "Hairdryer",
                "Heating",
                "Wi-Fi"
            ],
            "Outdoor": [
                "Garden view",
                "Outdoor seating",
                "Private terrace"
            ],
            "Kitchen": [
                "Coffee maker",
                "Dishwasher",
                "Oven",
                "Refrigerator",
                "Stove"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Laundry": [
                "Ironing board",
                "Washing machine"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "sweety-porto": {
        "name": "Sweety Porto",
        "subtitle": "A charming terraced apartment on one of Baixa's prettiest streets",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": 47,
        "rating": 4.85,
        "reviews": 278,
        "price": null,
        "featured": true,
        "heroImage": "https://a0.muscache.com/im/pictures/ddb17492-61db-4f8b-b11e-e9be8da49293.jpg?im_w=1440",
        "images": [
            "https://a0.muscache.com/im/pictures/ddb17492-61db-4f8b-b11e-e9be8da49293.jpg?im_w=1440",
            "https://a0.muscache.com/im/pictures/miso/Hosting-19731883/original/37b87176-6c40-484b-a331-10caf48bf02a.png?im_w=1200",
            "https://a0.muscache.com/im/pictures/miso/Hosting-19731883/original/45e08fba-00b4-42da-af49-3a239c1b50ad.jpeg?im_w=1200",
            "https://a0.muscache.com/im/pictures/miso/Hosting-19731883/original/5be16bda-b510-48dd-a865-84f669878890.jpeg?im_w=1200",
            "https://a0.muscache.com/im/pictures/miso/Hosting-19731883/original/44d5e1e7-7cf3-41a2-a54e-5cbc47ac5b3c.png?im_w=1200"
        ],
        "description": "On Rua do Almada, one of downtown Porto's most characterful streets, Sweety Porto is a compact, sunlit apartment with its own terrace — ideal for two. Close to Trindade station and a handful of minutes from the city's main tourist landmarks, it's a well-placed base for a short stay.",
        "neighborhood": "Rua do Almada sits in the Baixa, minutes from the Aliados and Trindade metro, in one of the most walkable parts of central Porto.",
        "nearby": [
            {
                "label": "Trindade metro station",
                "distance": "5 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "7 min walk"
            },
            {
                "label": "Livraria Lello",
                "distance": "10 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Private terrace"
            ],
            "Kitchen": [
                "Coffee maker",
                "Refrigerator",
                "Microwave"
            ],
            "Entertainment": [
                "TV"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "casa-bonfim": {
        "name": "Casa B",
        "subtitle": "A full townhouse for family and friends in a residential corner of Porto",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 8,
        "bedrooms": 3,
        "beds": 4,
        "bathrooms": 2,
        "size_m2": null,
        "rating": 4.79,
        "reviews": 19,
        "price": null,
        "featured": true,
        "heroImage": "https://a0.muscache.com/im/pictures/miso/Hosting-1165921456940474210/original/24dc6342-b026-4ba1-aef0-f257a882cc1d.jpeg?im_w=1440",
        "images": [
            "https://a0.muscache.com/im/pictures/miso/Hosting-1165921456940474210/original/24dc6342-b026-4ba1-aef0-f257a882cc1d.jpeg?im_w=1200",
            "https://a0.muscache.com/im/pictures/miso/Hosting-1165921456940474210/original/4d4d799a-8e24-4de2-a53a-1de7b35c14dc.jpeg?im_w=1200",
            "https://a0.muscache.com/im/pictures/miso/Hosting-1165921456940474210/original/e32dcb38-061b-4ee3-bcb6-32518b26b868.jpeg?im_w=1200",
            "https://a0.muscache.com/im/pictures/miso/Hosting-1165921456940474210/original/0cdd561c-053b-4d4d-85ef-6bf0517a4462.jpeg?im_w=1200",
            "https://a0.muscache.com/im/pictures/miso/Hosting-1165921456940474210/original/4fc51680-ba89-413d-b935-0ee2e76df25b.jpeg?im_w=1200"
        ],
        "description": "A whole house in Bonfim, given over entirely to your group. Casa B spreads across three bedrooms in a quiet, residential pocket of Porto — more space and privacy than a typical apartment, with room for family gatherings or a group of friends travelling together.",
        "neighborhood": "Bonfim is a mostly residential neighbourhood east of the centre, known for its calm streets and the Cemitério do Bonfim gardens.",
        "nearby": [
            {
                "label": "Campo 24 de Agosto",
                "distance": "10 min walk"
            },
            {
                "label": "Praça dos Poveiros",
                "distance": "12 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Refrigerator",
                "Oven",
                "Stove",
                "Dishwasher",
                "Coffee maker"
            ],
            "Entertainment": [
                "TV"
            ],
            "Laundry": [
                "Washing machine"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "so-trendy-porto": {
        "name": "So Trendy Porto",
        "subtitle": "A duplex with a patio, a five-minute walk from Praça dos Poveiros",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 2,
        "size_m2": 110,
        "rating": 4.91,
        "reviews": 307,
        "price": null,
        "featured": true,
        "heroImage": "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MzUyMjM5MDM=/original/9fd62798-f4a9-4136-b507-ee6a937ab9e5.jpeg?im_w=1440",
        "images": [
            "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MzUyMjM5MDM=/original/9fd62798-f4a9-4136-b507-ee6a937ab9e5.jpeg?im_w=1200",
            "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MzUyMjM5MDM=/original/26f19c73-c431-4212-8c29-d76301c1e7d0.jpeg?im_w=1200",
            "https://a0.muscache.com/im/pictures/1a0eb0d4-480d-49ea-bd26-5e0071cfaee7.jpg?im_w=1200",
            "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MzUyMjM5MDM=/original/b3a991b1-6568-4c05-86e6-7e99565205c8.jpeg?im_w=1200",
            "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MzUyMjM5MDM=/original/d48edcb3-b892-44be-84c5-25099ee27b32.jpeg?im_w=1200"
        ],
        "description": "A guest-favourite duplex in Bonfim, with a private patio and two en-suite bedrooms. So Trendy Porto is a five-minute walk from the lively Praça dos Poveiros, well placed for exploring downtown Porto on foot.",
        "neighborhood": "This part of Bonfim sits right against the Baixa, close to Poveiros and the Bolhão market — central without the crowds.",
        "nearby": [
            {
                "label": "Praça dos Poveiros",
                "distance": "5 min walk"
            },
            {
                "label": "Bolhão metro station",
                "distance": "6 min walk"
            },
            {
                "label": "Mercado do Bolhão",
                "distance": "8 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Private patio"
            ],
            "Kitchen": [
                "Coffee maker",
                "Refrigerator",
                "Oven",
                "Dishwasher"
            ],
            "Entertainment": [
                "TV"
            ],
            "Laundry": [
                "Washing machine"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "vintage-porto": {
        "name": "Vintage Porto",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": 56,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A quiet apartment on a side street off Avenida dos Aliados",
        "description": "On a perpendicular street of Avenida dos Aliados, 50m from the University and a 10-minute walk from the Douro. Quiet, since it sits at the back of the building, yet close to the metro, bus and train. A mint-green kitchen, a round dining table and a comfortable living room with a leaf-print sofa give the apartment its warm, vintage character.",
        "neighborhood": "Baixa, Porto's historic centre.",
        "nearby": [
            {
                "label": "Avenida dos Aliados",
                "distance": "5 min walk"
            },
            {
                "label": "Douro riverfront",
                "distance": "10 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Kitchen": [
                "Refrigerator",
                "Stove"
            ]
        },
        "heroImage": "img/vintage-porto/01-living.jpg",
        "images": [
            "img/vintage-porto/01-living.jpg",
            "img/vintage-porto/02-living-dining.jpg",
            "img/vintage-porto/03-dining-detail.jpg",
            "img/vintage-porto/04-kitchen.jpg",
            "img/vintage-porto/05-bedroom.jpg",
            "img/vintage-porto/06-bathroom.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "artury-porto": {
        "name": "Artury Porto",
        "district": "Baixa · Trindade",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 1,
        "size_m2": 50,
        "priceFrom": 228,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A duplex with a balcony, close to the City Hall",
        "description": "A charming duplex apartment with a balcony in the centre of Porto, close to the City Hall, a 10-minute walk from Trindade metro station. Bright red-framed French windows, a Matisse-print living room and a wood staircase lead up to a second bedroom tucked under the eaves.",
        "neighborhood": "Baixa, near Trindade metro.",
        "nearby": [
            {
                "label": "Trindade metro",
                "distance": "10 min walk"
            },
            {
                "label": "Câmara Municipal",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Outdoor": [
                "Balcony"
            ]
        },
        "heroImage": "img/artury-porto/01-living.jpg",
        "images": [
            "img/artury-porto/01-living.jpg",
            "img/artury-porto/02-living-detail.jpg",
            "img/artury-porto/03-kitchen.jpg",
            "img/artury-porto/04-staircase.jpg",
            "img/artury-porto/05-bedroom-lower.jpg",
            "img/artury-porto/06-bedroom-upper.jpg",
            "img/artury-porto/07-bathroom.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "coAlarm": false
        }
    },
    "arty-porto": {
        "name": "Arty Porto",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 6,
        "bedrooms": 3,
        "beds": 4,
        "bathrooms": 3,
        "size_m2": null,
        "priceFrom": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A striking duplex loft in a private garden condominium, near Heroísmo metro",
        "description": "An architecturally striking duplex loft set within a quiet garden condominium in Bonfim, a short walk from Rua de Santa Catarina and the Coliseu do Porto, and close to Heroísmo metro station. Wood-panelled walls, black steel details and a bold urban-jungle mural frame the double-height living room, with a dark walnut kitchen opening onto a private stone-walled terrace. Three bedrooms and two full bathrooms span both levels, linked by a glass-railed staircase.",
        "neighborhood": "Bonfim, close to Rua de Santa Catarina and Heroísmo metro.",
        "nearby": [
            {
                "label": "Coliseu do Porto",
                "distance": "15 min walk"
            },
            {
                "label": "Heroísmo metro",
                "distance": "nearby"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Outdoor": [
                "Terrace",
                "Parking"
            ]
        },
        "heroImage": "img/arty-porto/01-living.jpg",
        "images": [
            "img/arty-porto/01-living.jpg",
            "img/arty-porto/02-kitchen.jpg",
            "img/arty-porto/03-kitchen-terrace.jpg",
            "img/arty-porto/04-exterior.jpg",
            "img/arty-porto/05-lavabo.jpg",
            "img/arty-porto/06-staircase.jpg",
            "img/arty-porto/07-corridor.jpg",
            "img/arty-porto/08-bedroom1.jpg",
            "img/arty-porto/09-bedroom2-twin.jpg",
            "img/arty-porto/10-bedroom3.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "belleville-porto": {
        "name": "Belleville Porto",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 2,
        "size_m2": null,
        "priceFrom": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A bright two-storey duplex with a mustard-yellow living room, close to Heroísmo metro",
        "description": "A bright, elegantly furnished duplex close to Heroísmo metro station, with a mustard-yellow sofa and teal accents in the living room, a white marble-backsplash kitchen and a separate dining room. An original wooden staircase links the two levels, leading to two bedrooms — one in soft beige tones, the other with a scalloped blue-and-cream wallpaper — each with its own full bathroom finished in classic black-and-white checkerboard tile.",
        "neighborhood": "Bonfim, close to Heroísmo metro station.",
        "nearby": [
            {
                "label": "Heroísmo metro",
                "distance": "nearby"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Outdoor": [
                "Balcony"
            ]
        },
        "heroImage": "img/belleville-porto/01-exterior.jpg",
        "images": [
            "img/belleville-porto/01-exterior.jpg",
            "img/belleville-porto/02-living.jpg",
            "img/belleville-porto/03-kitchen.jpg",
            "img/belleville-porto/04-dining.jpg",
            "img/belleville-porto/05-staircase.jpg",
            "img/belleville-porto/06-bedroom1.jpg",
            "img/belleville-porto/07-bathroom1.jpg",
            "img/belleville-porto/08-bedroom2.jpg",
            "img/belleville-porto/09-bathroom2.jpg",
            "img/belleville-porto/10-balcony.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "oliveirinhas-flat-i": {
        "name": "Oliveirinhas Flat I",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 2,
        "size_m2": null,
        "priceFrom": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A modern ground-floor flat with a private terrace on Rua das Oliveirinhas",
        "description": "A stylishly renovated flat on Rua das Oliveirinhas, with a green velvet sofa and warm wood cabinetry opening straight onto a private terrace furnished with woven yellow chairs — a suntrap tucked behind a stretch of old granite wall. A wood-clad kitchen, a bedroom with a plush upholstered headboard, and two full bathrooms finished in marble-effect tile with brushed-gold fittings complete the flat, part of a small, quietly renovated block close to Heroísmo metro.",
        "neighborhood": "Bonfim, on Rua das Oliveirinhas, close to Heroísmo metro.",
        "nearby": [
            {
                "label": "Heroísmo metro",
                "distance": "nearby"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Outdoor": [
                "Terrace"
            ]
        },
        "heroImage": "img/oliveirinhas-flat-i/01-living.jpg",
        "images": [
            "img/oliveirinhas-flat-i/01-living.jpg",
            "img/oliveirinhas-flat-i/02-terrace.jpg",
            "img/oliveirinhas-flat-i/03-kitchen.jpg",
            "img/oliveirinhas-flat-i/04-living-dining.jpg",
            "img/oliveirinhas-flat-i/05-staircase.jpg",
            "img/oliveirinhas-flat-i/06-bedroom.jpg",
            "img/oliveirinhas-flat-i/07-bathroom1.jpg",
            "img/oliveirinhas-flat-i/08-bathroom2.jpg",
            "img/oliveirinhas-flat-i/09-corridor.jpg",
            "img/oliveirinhas-flat-i/10-terrace-detail.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "oliveirinhas-flat-ii": {
        "name": "Oliveirinhas Flat II",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 0,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": null,
        "priceFrom": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A bright open-plan studio with petrol-blue velvet accents on Rua das Oliveirinhas",
        "description": "A bright, open-plan studio on Rua das Oliveirinhas, where a comfortable double bed, a wood-topped dining table and a compact fitted kitchen with a Siemens oven share one light-filled room behind a run of tall shuttered windows. Petrol-blue velvet armchairs, a scattering of vintage furniture and playful ceramic accents give the space real character, and a marble-effect bathroom with a brushed-gold rain shower completes this calm, well-located studio close to Heroísmo metro.",
        "neighborhood": "Bonfim, on Rua das Oliveirinhas, close to Heroísmo metro.",
        "nearby": [
            {
                "label": "Heroísmo metro",
                "distance": "nearby"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Kitchen": [
                "Refrigerator",
                "Oven",
                "Coffee maker"
            ]
        },
        "heroImage": "img/oliveirinhas-flat-ii/01-overview.jpg",
        "images": [
            "img/oliveirinhas-flat-ii/01-overview.jpg",
            "img/oliveirinhas-flat-ii/02-bed.jpg",
            "img/oliveirinhas-flat-ii/03-kitchen.jpg",
            "img/oliveirinhas-flat-ii/04-kitchen-detail.jpg",
            "img/oliveirinhas-flat-ii/05-dining.jpg",
            "img/oliveirinhas-flat-ii/06-lounge.jpg",
            "img/oliveirinhas-flat-ii/07-bathroom.jpg",
            "img/oliveirinhas-flat-ii/08-bathroom-sink.jpg",
            "img/oliveirinhas-flat-ii/09-windows.jpg",
            "img/oliveirinhas-flat-ii/10-detail.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "oliveirinhas-flat-iii": {
        "name": "Oliveirinhas Flat III",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": null,
        "priceFrom": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A one-bedroom flat with cane armchairs and a French balcony on Rua das Oliveirinhas",
        "description": "A warmly furnished one-bedroom flat on Rua das Oliveirinhas, where a pair of moss-green cane armchairs and a mid-century sideboard anchor the lounge corner beside French balcony doors overlooking the street. A wood-fronted kitchen, a bedroom softened with wool-knit cushions and matching cane armchairs, and a marble-effect bathroom with brushed-gold fittings complete this calm, well-located flat close to Heroísmo metro.",
        "neighborhood": "Bonfim, on Rua das Oliveirinhas, close to Heroísmo metro.",
        "nearby": [
            {
                "label": "Heroísmo metro",
                "distance": "nearby"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Outdoor": [
                "Balcony"
            ]
        },
        "heroImage": "img/oliveirinhas-flat-iii/01-lounge.jpg",
        "images": [
            "img/oliveirinhas-flat-iii/01-lounge.jpg",
            "img/oliveirinhas-flat-iii/02-dining.jpg",
            "img/oliveirinhas-flat-iii/03-kitchen.jpg",
            "img/oliveirinhas-flat-iii/04-kitchen-detail.jpg",
            "img/oliveirinhas-flat-iii/05-bedroom.jpg",
            "img/oliveirinhas-flat-iii/06-bedroom-armchairs.jpg",
            "img/oliveirinhas-flat-iii/07-bathroom.jpg",
            "img/oliveirinhas-flat-iii/08-bathroom-detail.jpg",
            "img/oliveirinhas-flat-iii/09-window.jpg",
            "img/oliveirinhas-flat-iii/10-detail.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "oliveirinhas-flat-iv": {
        "name": "Oliveirinhas Flat IV",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 2,
        "size_m2": null,
        "priceFrom": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A top-floor duplex with a rooftop terrace over Porto's tiled roofs, on Rua das Oliveirinhas",
        "description": "A top-floor duplex on Rua das Oliveirinhas, with a rooftop terrace furnished for dining and lounging above a patchwork of tiled roofs and chimneys. A glass-and-timber-railed staircase links the two levels, with a curved petrol-blue sofa and velvet dining chairs upstairs, and two bedrooms — each with its own full bathroom in marble-effect tile and brushed-gold fittings — on the level below. A fully fitted kitchen completes this bright, well-located duplex close to Heroísmo metro.",
        "neighborhood": "Bonfim, on Rua das Oliveirinhas, close to Heroísmo metro.",
        "nearby": [
            {
                "label": "Heroísmo metro",
                "distance": "nearby"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Outdoor": [
                "Terrace"
            ]
        },
        "heroImage": "img/oliveirinhas-flat-iv/01-terrace.jpg",
        "images": [
            "img/oliveirinhas-flat-iv/01-terrace.jpg",
            "img/oliveirinhas-flat-iv/02-living.jpg",
            "img/oliveirinhas-flat-iv/03-staircase.jpg",
            "img/oliveirinhas-flat-iv/04-kitchen.jpg",
            "img/oliveirinhas-flat-iv/05-lounge.jpg",
            "img/oliveirinhas-flat-iv/06-bedroom1.jpg",
            "img/oliveirinhas-flat-iv/07-bedroom2.jpg",
            "img/oliveirinhas-flat-iv/08-bathroom1.jpg",
            "img/oliveirinhas-flat-iv/09-bathroom2.jpg",
            "img/oliveirinhas-flat-iv/10-terrace-view.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "camilo-apartment": {
        "name": "Camilo Apartment",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 3,
        "bathrooms": 1,
        "size_m2": 71,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A charming apartment with a balcony on Avenida Camilo",
        "description": "Charming apartment with a balcony on the beautiful Avenida Camilo, a 5-minute walk from 24 de Agosto metro station. Two elegantly styled bedrooms — one in blue and gold, the other in warm grey and teal — sit either side of a bright dining and living room.",
        "neighborhood": "Bonfim, close to Campo 24 de Agosto.",
        "nearby": [
            {
                "label": "24 de Agosto metro",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Outdoor": [
                "Balcony"
            ]
        },
        "heroImage": "img/camilo-apartment/01-living-dining.jpg",
        "images": [
            "img/camilo-apartment/01-living-dining.jpg",
            "img/camilo-apartment/02-living-detail.jpg",
            "img/camilo-apartment/03-kitchen.jpg",
            "img/camilo-apartment/04-kitchen-detail.jpg",
            "img/camilo-apartment/05-bedroom-1.jpg",
            "img/camilo-apartment/06-bedroom-2.jpg",
            "img/camilo-apartment/07-bathroom.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "comfy-porto": {
        "name": "Comfy Porto",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 6,
        "bedrooms": 2,
        "beds": 4,
        "bathrooms": 3,
        "size_m2": 110,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A duplex with a rooftop terrace close to Praça dos Poveiros",
        "description": "Bright duplex penthouse with a private rooftop terrace in Porto's city centre, close to the lively Praça dos Poveiros and a 5-minute walk from Bolhão metro station. An open-plan living, dining and kitchen area sits downstairs, with three bedrooms and city views upstairs.",
        "neighborhood": "Bonfim, next to Praça dos Poveiros.",
        "nearby": [
            {
                "label": "Bolhão metro",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Outdoor": [
                "Terrace"
            ]
        },
        "heroImage": "img/comfy-porto/01-living.jpg",
        "images": [
            "img/comfy-porto/01-living.jpg",
            "img/comfy-porto/02-kitchen.jpg",
            "img/comfy-porto/03-bedroom-1.jpg",
            "img/comfy-porto/04-bedroom-2.jpg",
            "img/comfy-porto/05-bedroom-3.jpg",
            "img/comfy-porto/06-bathroom-1.jpg",
            "img/comfy-porto/07-bathroom-2.jpg",
            "img/comfy-porto/08-terrace.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "balcony-porto-view": {
        "name": "Balcony Porto View",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": 35,
        "subtitle": "A compact apartment with a balcony near Poveiros",
        "description": "Charming apartment with a balcony in downtown Porto, close to the joyful Praça dos Poveiros, a 5-minute walk from 24 de Agosto metro station.",
        "neighborhood": "Bonfim, next to Praça dos Poveiros.",
        "nearby": [
            {
                "label": "24 de Agosto metro",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Outdoor": [
                "Balcony"
            ]
        },
        "heroImage": "img/balcony-porto-view/01-living-room.jpg",
        "images": [
            "img/balcony-porto-view/01-living-room.jpg",
            "img/balcony-porto-view/02-living-room-detail.jpg",
            "img/balcony-porto-view/03-bedroom.jpg",
            "img/balcony-porto-view/04-balcony-exterior.jpg",
            "img/balcony-porto-view/05-dining-entry.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "volta-do-patio-porto": {
        "name": "Volta do Pátio",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 2,
        "size_m2": null,
        "rating": 5,
        "reviews": 4,
        "subtitle": "A sophisticated two-bedroom apartment with a patio in trendy Bonfim",
        "description": "Volta do Pátio is a sophisticated two-bedroom apartment in the trendy Bonfim district, with direct access to a private patio. The second bedroom features a sofa bed. The living room has a flat-screen TV, the kitchen is fully equipped, and high-speed Wi-Fi and a dedicated workspace make it a comfortable base for up to four guests.",
        "neighborhood": "Bonfim, one of Porto's up-and-coming residential districts, mixing traditional streets with a growing café and restaurant scene.",
        "nearby": [],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Kitchen": [
                "Refrigerator",
                "Dishwasher",
                "Washing machine"
            ],
            "Entertainment": [
                "TV"
            ],
            "Work": [
                "Dedicated workspace"
            ],
            "Outdoor": [
                "Patio"
            ]
        },
        "heroImage": "img/volta-do-patio-porto/01-living-room.jpg",
        "images": [
            "img/volta-do-patio-porto/01-living-room.jpg",
            "img/volta-do-patio-porto/02-bedroom.jpg",
            "img/volta-do-patio-porto/03-bathroom.jpg",
            "img/volta-do-patio-porto/04-patio.jpg",
            "img/volta-do-patio-porto/05-kitchen.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "so-truly-porto": {
        "name": "So Truly Porto",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 3,
        "beds": 3,
        "bathrooms": 2,
        "size_m2": null,
        "priceFrom": 266,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A characterful three-bedroom flat close to Praça dos Poveiros",
        "description": "Characterful apartment in downtown Porto, close to the joyful Praça dos Poveiros, a 5-minute walk from 24 de Agosto metro station. A green-walled living room with antique carved-wood details opens onto a dining area and kitchen, with three quietly styled bedrooms down the hall.",
        "neighborhood": "Bonfim, next to Praça dos Poveiros.",
        "nearby": [
            {
                "label": "24 de Agosto metro",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ]
        },
        "heroImage": "img/so-truly-porto/01-living.jpg",
        "images": [
            "img/so-truly-porto/01-living.jpg",
            "img/so-truly-porto/02-living-kitchen.jpg",
            "img/so-truly-porto/03-bedroom-1.jpg",
            "img/so-truly-porto/04-bedroom-2.jpg",
            "img/so-truly-porto/05-bedroom-3.jpg",
            "img/so-truly-porto/06-bathroom-1.jpg",
            "img/so-truly-porto/07-bathroom-2.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "boho-vintage-bonfim": {
        "name": "Boho & Vintage Bonfim",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 8,
        "bedrooms": 3,
        "beds": 4,
        "bathrooms": 1,
        "size_m2": 125,
        "priceFrom": 570,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A characterful 125m² apartment with three individually decorated bedrooms",
        "description": "A spacious apartment full of personality, mixing boho and vintage styles across a green mid-century living and dining room, a maroon checkerboard-tile kitchen, and three bedrooms each with its own look — one wrapped in green botanical wallpaper with a daybed, one with a leather headboard and a reading corner, and one in teal with a rattan headboard, plus a cosy sofa-bed nook for extra guests. A single vintage-style bathroom has brass fixtures and a round mirror. 100m from Trindade metro station, 50m from the City Hall and Avenida dos Aliados.",
        "neighborhood": "Bonfim, by Trindade and the Aliados.",
        "nearby": [
            {
                "label": "Trindade metro",
                "distance": "2 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "1 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Outdoor": [
                "Balcony",
                "Garden"
            ]
        },
        "heroImage": "img/boho-vintage-bonfim/01-living.jpg",
        "images": [
            "img/boho-vintage-bonfim/01-living.jpg",
            "img/boho-vintage-bonfim/02-living-detail.jpg",
            "img/boho-vintage-bonfim/03-dining.jpg",
            "img/boho-vintage-bonfim/04-kitchen.jpg",
            "img/boho-vintage-bonfim/05-bedroom-1.jpg",
            "img/boho-vintage-bonfim/06-bedroom-2.jpg",
            "img/boho-vintage-bonfim/07-bedroom-3.jpg",
            "img/boho-vintage-bonfim/08-sofa-room.jpg",
            "img/boho-vintage-bonfim/09-bathroom.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "joy-porto": {
        "name": "Joy Porto",
        "district": "Fontaínhas",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 3,
        "bathrooms": 2,
        "size_m2": 118,
        "priceFrom": 342,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A bright, colourful duplex with rooftop terrace and private garden",
        "description": "A cheerful, modern duplex with a mosaic-tiled kitchen, colour-block armchairs and two comfortable bedrooms. Downstairs a private walled garden with sun loungers and artificial lawn; upstairs a rooftop terrace with dining table and views over Fontaínhas' rooftops. In one of the most typical areas of Fontaínhas, a 10-minute walk from Campo 24 de Agosto.",
        "neighborhood": "Fontaínhas, downtown Porto.",
        "nearby": [
            {
                "label": "Campo 24 de Agosto",
                "distance": "10 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Outdoor": [
                "Terrace",
                "Garden"
            ]
        },
        "heroImage": "img/joy-porto/01-living.jpg",
        "images": [
            "img/joy-porto/01-living.jpg",
            "img/joy-porto/02-kitchen.jpg",
            "img/joy-porto/03-dining.jpg",
            "img/joy-porto/04-bedroom-1.jpg",
            "img/joy-porto/05-bedroom-2.jpg",
            "img/joy-porto/06-bathroom-1.jpg",
            "img/joy-porto/07-bathroom-2.jpg",
            "img/joy-porto/08-terrace-garden.jpg",
            "img/joy-porto/09-terrace-dining.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "mercadory-ribeira": {
        "name": "Mercadory Ribeira",
        "district": "Ribeira",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": 42,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A cosy renovated apartment behind original granite stone walls",
        "description": "A charming one-bedroom apartment where original exposed granite walls meet a crisp, modern interior — a compact kitchen with dining table, a comfortable lounge, a quilted-headboard bedroom and a marble-tiled bathroom. In one of the most emblematic and beautiful areas of Porto, the Ribeira, right in the historic centre of the city.",
        "neighborhood": "Ribeira, Porto's riverside historic quarter.",
        "nearby": [
            {
                "label": "Ribeira riverfront",
                "distance": "3 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ]
        },
        "heroImage": "img/mercadory-ribeira/01-living.jpg",
        "images": [
            "img/mercadory-ribeira/01-living.jpg",
            "img/mercadory-ribeira/02-living-detail.jpg",
            "img/mercadory-ribeira/03-kitchen-dining.jpg",
            "img/mercadory-ribeira/04-kitchen.jpg",
            "img/mercadory-ribeira/05-bedroom.jpg",
            "img/mercadory-ribeira/06-bedroom-detail.jpg",
            "img/mercadory-ribeira/07-bathroom.jpg",
            "img/mercadory-ribeira/08-bathroom-detail.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "ribeira-loft": {
        "name": "Ribeira Loft",
        "district": "Ribeira",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 2,
        "bathrooms": 1,
        "size_m2": 40,
        "priceFrom": 150.1,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A top-floor attic loft with sloped ceilings and rooftop views",
        "description": "A characterful attic loft tucked under the eaves, with a marble kitchen counter, a sitting area beneath original wooden beams, twin ornate wrought-iron beds and a striking bathroom in black mosaic tile. Wide windows look out over the rooftops of the Ribeira. In one of the most emblematic and beautiful areas of Porto, close to all the main tourist attractions.",
        "neighborhood": "Ribeira, Porto's riverside historic quarter.",
        "nearby": [
            {
                "label": "Ribeira riverfront",
                "distance": "2 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ]
        },
        "heroImage": "img/ribeira-loft/01-living.jpg",
        "images": [
            "img/ribeira-loft/01-living.jpg",
            "img/ribeira-loft/02-living-detail.jpg",
            "img/ribeira-loft/03-kitchen.jpg",
            "img/ribeira-loft/04-bedroom.jpg",
            "img/ribeira-loft/05-bedroom-detail.jpg",
            "img/ribeira-loft/06-bathroom.jpg",
            "img/ribeira-loft/07-bathroom-detail.jpg",
            "img/ribeira-loft/08-view.jpg"
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "torrinha-a-porto": {
        "name": "Torrinha A",
        "subtitle": "A bright studio in Porto's artistic Miguel Bombarda district",
        "district": "Cedofeita",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/torrinha-a-porto/01-living-room.jpg",
        "images": [
            "img/torrinha-a-porto/01-living-room.jpg",
            "img/torrinha-a-porto/02-kitchen.jpg",
            "img/torrinha-a-porto/03-kitchen-detail.jpg",
            "img/torrinha-a-porto/04-bedroom.jpg",
            "img/torrinha-a-porto/05-bathroom-detail.jpg"
        ],
        "description": "Torrinha A is a bright, well-appointed studio in a renovated building on Rua da Torrinha, in the heart of Porto's artistic Miguel Bombarda district. A comfortable lounge area, a compact kitchen and a cosy double bed make this a calm, well-located base for exploring the city on foot.",
        "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda is Porto's gallery district, a leafy, creative pocket close to the Soares dos Reis museum and the Carregal garden, with the Baixa and Trindade metro within easy walking distance.",
        "nearby": [
            {
                "label": "Rua Miguel Bombarda",
                "distance": "1 min walk"
            },
            {
                "label": "Trindade metro station",
                "distance": "10 min walk"
            },
            {
                "label": "Museu Nacional Soares dos Reis",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "torrinha-b-porto": {
        "name": "Torrinha B",
        "subtitle": "A studio with a small terrace in Miguel Bombarda",
        "district": "Cedofeita",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/torrinha-b-porto/01-living-room.jpg",
        "images": [
            "img/torrinha-b-porto/01-living-room.jpg",
            "img/torrinha-b-porto/02-studio-overview.jpg",
            "img/torrinha-b-porto/03-bedroom.jpg",
            "img/torrinha-b-porto/04-bathroom.jpg",
            "img/torrinha-b-porto/05-kitchen-detail.jpg"
        ],
        "description": "Torrinha B is a bright studio with a small private terrace, in a renovated building on Rua da Torrinha in the heart of Porto's artistic Miguel Bombarda district. A cosy lounge corner, a compact kitchen and a comfortable double bed make this calm, well-located studio ideal for exploring the city on foot.",
        "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda is Porto's gallery district, a leafy, creative pocket close to the Soares dos Reis museum and the Carregal garden, with the Baixa and Trindade metro within easy walking distance.",
        "nearby": [
            {
                "label": "Rua Miguel Bombarda",
                "distance": "1 min walk"
            },
            {
                "label": "Trindade metro station",
                "distance": "10 min walk"
            },
            {
                "label": "Museu Nacional Soares dos Reis",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Small terrace"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "torrinha-c-porto": {
        "name": "Torrinha C",
        "subtitle": "A duplex apartment in Porto's artistic Miguel Bombarda district",
        "district": "Cedofeita",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 1,
        "beds": 2,
        "bathrooms": 1,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/torrinha-c-porto/01-kitchen-dining.jpg",
        "images": [
            "img/torrinha-c-porto/01-kitchen-dining.jpg",
            "img/torrinha-c-porto/02-living-room.jpg",
            "img/torrinha-c-porto/03-bedroom.jpg",
            "img/torrinha-c-porto/04-decor-accent.jpg",
            "img/torrinha-c-porto/05-kitchen-detail.jpg"
        ],
        "description": "Torrinha C is a bright duplex apartment in a renovated building on Rua da Torrinha, in the heart of Porto's artistic Miguel Bombarda district. A wood-beamed dining area, a comfortable lounge beneath the stairs and a cosy double bedroom make this a calm, well-located base for exploring the city on foot.",
        "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda is Porto's gallery district, a leafy, creative pocket close to the Soares dos Reis museum and the Carregal garden, with the Baixa and Trindade metro within easy walking distance.",
        "nearby": [
            {
                "label": "Rua Miguel Bombarda",
                "distance": "1 min walk"
            },
            {
                "label": "Trindade metro station",
                "distance": "10 min walk"
            },
            {
                "label": "Museu Nacional Soares dos Reis",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "torrinha-d-porto": {
        "name": "Torrinha D",
        "subtitle": "A duplex apartment in Porto's artistic Miguel Bombarda district",
        "district": "Cedofeita",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 1,
        "beds": 2,
        "bathrooms": 1,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/torrinha-d-porto/01-living-room.jpg",
        "images": [
            "img/torrinha-d-porto/01-living-room.jpg",
            "img/torrinha-d-porto/02-bathroom.jpg",
            "img/torrinha-d-porto/03-bedroom.jpg",
            "img/torrinha-d-porto/04-bedroom-detail.jpg",
            "img/torrinha-d-porto/05-kitchen-dining.jpg"
        ],
        "description": "Torrinha D is a bright duplex apartment in a renovated building on Rua da Torrinha, in the heart of Porto's artistic Miguel Bombarda district. A comfortable lounge beneath the stairs, a modern bathroom and a cosy double bedroom make this a calm, well-located base for exploring the city on foot.",
        "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda is Porto's gallery district, a leafy, creative pocket close to the Soares dos Reis museum and the Carregal garden, with the Baixa and Trindade metro within easy walking distance.",
        "nearby": [
            {
                "label": "Rua Miguel Bombarda",
                "distance": "1 min walk"
            },
            {
                "label": "Trindade metro station",
                "distance": "10 min walk"
            },
            {
                "label": "Museu Nacional Soares dos Reis",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "torrinha-e-porto": {
        "name": "Torrinha E",
        "subtitle": "A duplex apartment with garden access in Miguel Bombarda",
        "district": "Cedofeita",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 1,
        "beds": 2,
        "bathrooms": 1,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/torrinha-e-porto/01-kitchen-dining-garden.jpg",
        "images": [
            "img/torrinha-e-porto/01-kitchen-dining-garden.jpg",
            "img/torrinha-e-porto/02-dining-detail.jpg",
            "img/torrinha-e-porto/03-living-room.jpg",
            "img/torrinha-e-porto/04-garden-view.jpg",
            "img/torrinha-e-porto/05-bedroom.jpg"
        ],
        "description": "Torrinha E is a bright duplex apartment with access to a shared garden, in a renovated building on Rua da Torrinha in the heart of Porto's artistic Miguel Bombarda district. A dining area opening onto the garden, a comfortable lounge and a cosy double bedroom make this calm, well-located apartment ideal for exploring the city on foot.",
        "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda is Porto's gallery district, a leafy, creative pocket close to the Soares dos Reis museum and the Carregal garden, with the Baixa and Trindade metro within easy walking distance.",
        "nearby": [
            {
                "label": "Rua Miguel Bombarda",
                "distance": "1 min walk"
            },
            {
                "label": "Trindade metro station",
                "distance": "10 min walk"
            },
            {
                "label": "Museu Nacional Soares dos Reis",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Shared garden"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "torrinha-f-porto": {
        "name": "Torrinha F",
        "subtitle": "A studio with terrace in Porto's artistic Miguel Bombarda district",
        "district": "Cedofeita",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/torrinha-f-porto/01-living-terrace.jpg",
        "images": [
            "img/torrinha-f-porto/01-living-terrace.jpg",
            "img/torrinha-f-porto/02-bathroom.jpg",
            "img/torrinha-f-porto/03-kitchen-detail.jpg",
            "img/torrinha-f-porto/04-linens.jpg",
            "img/torrinha-f-porto/05-entrance.jpg"
        ],
        "description": "Torrinha F is a bright studio with a private terrace, in a renovated building on Rua da Torrinha in the heart of Porto's artistic Miguel Bombarda district. A cosy lounge and dining area opening onto the terrace, a compact kitchen and a comfortable double bed make this calm, well-located studio ideal for exploring the city on foot.",
        "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda is Porto's gallery district, a leafy, creative pocket close to the Soares dos Reis museum and the Carregal garden, with the Baixa and Trindade metro within easy walking distance.",
        "nearby": [
            {
                "label": "Rua Miguel Bombarda",
                "distance": "1 min walk"
            },
            {
                "label": "Trindade metro station",
                "distance": "10 min walk"
            },
            {
                "label": "Museu Nacional Soares dos Reis",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Private terrace"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "torrinha-g-porto": {
        "name": "Torrinha G",
        "subtitle": "A bright studio in Porto's artistic Miguel Bombarda district",
        "district": "Cedofeita",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/torrinha-g-porto/01-living-room.jpg",
        "images": [
            "img/torrinha-g-porto/01-living-room.jpg",
            "img/torrinha-g-porto/02-bedroom-kitchen.jpg",
            "img/torrinha-g-porto/03-bathroom.jpg",
            "img/torrinha-g-porto/04-bathroom-detail.jpg",
            "img/torrinha-g-porto/05-dining-detail.jpg"
        ],
        "description": "Torrinha G is a bright, well-appointed studio in a renovated building on Rua da Torrinha, in the heart of Porto's artistic Miguel Bombarda district. A comfortable lounge, a compact kitchen and a cosy double bed make this a calm, well-located base for exploring the city on foot.",
        "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda is Porto's gallery district, a leafy, creative pocket close to the Soares dos Reis museum and the Carregal garden, with the Baixa and Trindade metro within easy walking distance.",
        "nearby": [
            {
                "label": "Rua Miguel Bombarda",
                "distance": "1 min walk"
            },
            {
                "label": "Trindade metro station",
                "distance": "10 min walk"
            },
            {
                "label": "Museu Nacional Soares dos Reis",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "torrinha-h-porto": {
        "name": "Torrinha H",
        "subtitle": "A bright studio in Porto's artistic Miguel Bombarda district",
        "district": "Cedofeita",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/torrinha-h-porto/01-living-room.jpg",
        "images": [
            "img/torrinha-h-porto/01-living-room.jpg",
            "img/torrinha-h-porto/02-dining.jpg",
            "img/torrinha-h-porto/03-kitchen-detail.jpg",
            "img/torrinha-h-porto/04-linens.jpg",
            "img/torrinha-h-porto/05-entrance.jpg"
        ],
        "description": "Torrinha H is a bright, well-appointed studio in a renovated building on Rua da Torrinha, in the heart of Porto's artistic Miguel Bombarda district. A comfortable lounge with large windows, a compact kitchen and a cosy double bed make this a calm, well-located base for exploring the city on foot.",
        "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda is Porto's gallery district, a leafy, creative pocket close to the Soares dos Reis museum and the Carregal garden, with the Baixa and Trindade metro within easy walking distance.",
        "nearby": [
            {
                "label": "Rua Miguel Bombarda",
                "distance": "1 min walk"
            },
            {
                "label": "Trindade metro station",
                "distance": "10 min walk"
            },
            {
                "label": "Museu Nacional Soares dos Reis",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "torrinha-i-porto": {
        "name": "Torrinha I",
        "subtitle": "A bright studio in Porto's artistic Miguel Bombarda district",
        "district": "Cedofeita",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/torrinha-i-porto/01-bedroom.jpg",
        "images": [
            "img/torrinha-i-porto/01-bedroom.jpg",
            "img/torrinha-i-porto/02-living-room.jpg",
            "img/torrinha-i-porto/03-kitchen.jpg",
            "img/torrinha-i-porto/04-kitchen-detail.jpg",
            "img/torrinha-i-porto/05-linens.jpg"
        ],
        "description": "Torrinha I is a bright, well-appointed studio in a renovated building on Rua da Torrinha, in the heart of Porto's artistic Miguel Bombarda district. A comfortable lounge, a compact kitchen and a cosy double bed make this a calm, well-located base for exploring the city on foot.",
        "neighborhood": "Rua da Torrinha 136, 4050-609 Porto. Miguel Bombarda is Porto's gallery district, a leafy, creative pocket close to the Soares dos Reis museum and the Carregal garden, with the Baixa and Trindade metro within easy walking distance.",
        "nearby": [
            {
                "label": "Rua Miguel Bombarda",
                "distance": "1 min walk"
            },
            {
                "label": "Trindade metro station",
                "distance": "10 min walk"
            },
            {
                "label": "Museu Nacional Soares dos Reis",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "lovely-porto": {
        "name": "Lovely Porto",
        "subtitle": "A cosy T0 studio with balcony and garden on an emblematic Baixa street",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": 25,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/lovely-porto/01-living.jpg",
        "images": [
            "img/lovely-porto/01-living.jpg",
            "img/lovely-porto/02-bathroom.jpg",
            "img/lovely-porto/03-detail.jpg",
            "img/lovely-porto/04-view.jpg",
            "img/lovely-porto/05-interior.jpg",
            "img/lovely-porto/06-garden.jpg"
        ],
        "description": "A cosy T0 studio tucked on one of Baixa's most emblematic streets, with a private balcony, a small garden corner and a comfortable double bed for two. Fully renovated in 2018, it's a compact, sun-filled base right in the centre of Porto.",
        "neighborhood": "Rua do Almada 419, 4050-093 Porto. Baixa is Porto's historic centre — cobbled streets, azulejo facades, and the widest concentration of cafés, shops, and miradouros in the city.",
        "nearby": [
            {
                "label": "Trindade metro station",
                "distance": "2 min walk"
            },
            {
                "label": "Galeria de Paris",
                "distance": "5 min walk"
            },
            {
                "label": "Câmara Municipal & Aliados",
                "distance": "1 min walk"
            },
            {
                "label": "Supermarket",
                "distance": "1 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Private balcony",
                "Garden"
            ],
            "Kitchen": [
                "Coffee maker",
                "Kettle",
                "Microwave",
                "Toaster"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "loft-porto": {
        "name": "Loft Porto",
        "subtitle": "A charming wood-beamed duplex loft in the heart of Baixa",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": 55,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/loft-porto/01-living.jpg",
        "images": [
            "img/loft-porto/01-living.jpg",
            "img/loft-porto/02-kitchen.jpg",
            "img/loft-porto/03-bedroom.jpg",
            "img/loft-porto/04-detail.jpg",
            "img/loft-porto/05-stairs.jpg",
            "img/loft-porto/06-interior.jpg"
        ],
        "description": "A charming duplex loft with exposed wooden beams and a striking internal staircase, comfortably sleeping up to four. Set on a landmark Baixa street just steps from the Trindade metro and the Aliados.",
        "neighborhood": "Rua do Almada 419, 3º frt, 4050-093 Porto. Around Avenida dos Aliados unfolds Porto's Baixa, the city's meeting point — the Câmara Municipal at one end, Praça da Liberdade and its statue of Pedro IV at the other, with São Bento station's azulejo-lined hall and Rua das Flores just beyond.",
        "nearby": [
            {
                "label": "Trindade metro station",
                "distance": "2 min walk"
            },
            {
                "label": "Galeria de Paris",
                "distance": "5 min walk"
            },
            {
                "label": "Câmara Municipal & Aliados",
                "distance": "1 min walk"
            },
            {
                "label": "Supermarket",
                "distance": "1 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Coffee maker",
                "Kettle",
                "Microwave",
                "Toaster",
                "Washing machine"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "simply-porto": {
        "name": "Simply Porto",
        "subtitle": "A charming 2-room apartment moments from Aliados and Bolhão",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": 40,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/simply-porto/01-living.jpg",
        "images": [
            "img/simply-porto/01-living.jpg",
            "img/simply-porto/02-kitchen.jpg",
            "img/simply-porto/03-bedroom.jpg",
            "img/simply-porto/04-interior.jpg",
            "img/simply-porto/05-balcony.jpg",
            "img/simply-porto/06-bathroom.jpg"
        ],
        "description": "A beautiful, charming apartment with two living areas and a separate bedroom, comfortably sleeping four. Very well located between the Aliados avenue and the Bolhão market.",
        "neighborhood": "Rua de Santo Ildefonso 306, 4000-465 Porto. Avenida dos Aliados was built to impress — grand neoclassical and Beaux-Arts buildings crowned by the 70-metre Câmara Municipal tower, its name recalling the centuries-old alliance between Portugal and the United Kingdom. Nearby is the Mercado do Bolhão, one of the city's liveliest markets.",
        "nearby": [
            {
                "label": "Jardim de São Lázaro",
                "distance": "5 min walk"
            },
            {
                "label": "Rua de Santa Catarina",
                "distance": "6 min walk"
            },
            {
                "label": "Fontaínhas",
                "distance": "8 min walk"
            },
            {
                "label": "Douro riverfront",
                "distance": "2 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Coffee maker",
                "Kettle",
                "Microwave",
                "Toaster",
                "Washing machine"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "trendy-porto": {
        "name": "Trendy Porto",
        "subtitle": "A striking 104m² duplex mixing raw granite, warm timber beams and mid-century style, near Aliados and Bolhão",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 3,
        "size_m2": 104,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/trendy-porto/01-living.jpg",
        "images": [
            "img/trendy-porto/01-living.jpg",
            "img/trendy-porto/02-kitchen.jpg",
            "img/trendy-porto/03-bedroom.jpg",
            "img/trendy-porto/04-detail.jpg",
            "img/trendy-porto/05-suite.jpg",
            "img/trendy-porto/06-interior.jpg"
        ],
        "description": "A statement duplex where original granite stone walls meet a fresh, design-led interior — a lounge and dining area anchored by a raw stone accent wall and mid-century velvet armchairs, a kitchen with a bold patterned tile floor, and a warm timber-beamed hallway leading up to two full suites. A design-forward base for four near the Aliados and Bolhão market.",
        "neighborhood": "Rua das Oliveirinhas 9, R/C, 4000-367 Porto. Avenida dos Aliados was built to impress — grand neoclassical and Beaux-Arts buildings crowned by the 70-metre Câmara Municipal tower, its name recalling the centuries-old alliance between Portugal and the United Kingdom. Nearby is the Mercado do Bolhão, one of the city's liveliest markets.",
        "nearby": [
            {
                "label": "Jardim de São Lázaro",
                "distance": "5 min walk"
            },
            {
                "label": "Rua de Santa Catarina",
                "distance": "6 min walk"
            },
            {
                "label": "Fontaínhas",
                "distance": "8 min walk"
            },
            {
                "label": "Douro riverfront",
                "distance": "2 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Coffee maker",
                "Kettle",
                "Microwave",
                "Toaster",
                "Washing machine"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "eiffel-porto": {
        "name": "Eiffel Porto",
        "subtitle": "A bright, quiet apartment near Casa da Música and Boavista",
        "district": "Boavista",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 2,
        "size_m2": 78,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/eiffel-porto/01-living.jpg",
        "images": [
            "img/eiffel-porto/01-living.jpg",
            "img/eiffel-porto/02-kitchen.jpg",
            "img/eiffel-porto/03-bedroom.jpg",
            "img/eiffel-porto/04-detail.jpg",
            "img/eiffel-porto/05-bathroom.jpg",
            "img/eiffel-porto/06-interior.jpg"
        ],
        "description": "A beautiful, bright and quiet apartment on the 3rd floor with a lift, its living room opening onto a dining area and a very comfortable sofa bed — two bedrooms across 78m², sleeping four.",
        "neighborhood": "Rua da Constituição 2105, 4250-170 Porto. Boavista is Porto's westernmost district, centred on a grand leafy roundabout with a monument to the Peninsular War heroes who defeated Napoleon's troops. Here you'll find Casa da Música, popular for its concerts, and Avenida da Boavista, a wide boulevard of mansions and shops running to the Atlantic shoreline.",
        "nearby": [
            {
                "label": "Rotunda da Boavista",
                "distance": "5 min walk"
            },
            {
                "label": "Casa da Música metro station",
                "distance": "15 min walk"
            },
            {
                "label": "Avenida da Boavista",
                "distance": "3 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Heating",
                "Air conditioning",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Coffee maker",
                "Kettle",
                "Microwave",
                "Toaster",
                "Washing machine"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Accessibility": [
                "Elevator"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "casa-senhorinha": {
        "name": "Casa Senhorinha",
        "subtitle": "An architect-designed seaside house in Foz Velha, moments from the Atlantic",
        "district": "Foz Velha",
        "city": "Porto",
        "country": "Portugal",
        "guests": 6,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 2,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/casa-senhorinha/01-terrace.jpg",
        "images": [
            "img/casa-senhorinha/01-terrace.jpg",
            "img/casa-senhorinha/07-living-dining.jpg",
            "img/casa-senhorinha/02-street.jpg",
            "img/casa-senhorinha/03-detail.jpg",
            "img/casa-senhorinha/04-courtyard.jpg",
            "img/casa-senhorinha/05-entrance.jpg",
            "img/casa-senhorinha/06-detail2.jpg"
        ],
        "description": "Designed in collaboration with Porto-born architect Álvaro Siza Vieira, Casa Senhorinha pairs a polished concrete ground floor with a soft, pine-lined upper level beneath high arched ceilings. Perched in the old fishing quarter of Foz Velha, its rooftop bedroom and ocean-facing terrace catch the Atlantic sunset in ever-changing colour.",
        "neighborhood": "Foz Velha is Porto's old fishing district, still shaped by the rhythms of the sea — wander its narrow lanes past the Capela-Farol de São Miguel-o-Anjo lighthouse chapel down to the local fishing point at the river mouth.",
        "nearby": [
            {
                "label": "Praia do Homem do Leme",
                "distance": "5 min walk"
            },
            {
                "label": "Foz do Douro riverside",
                "distance": "5 min walk"
            },
            {
                "label": "Passeio Alegre gardens",
                "distance": "10 min walk"
            },
            {
                "label": "Douro river mouth",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Ocean-facing terrace"
            ],
            "Kitchen": [
                "Coffee maker",
                "Kettle",
                "Microwave",
                "Toaster",
                "Washing machine",
                "Refrigerator"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "softly-porto": {
        "name": "Softly Porto",
        "subtitle": "A quiet, light-filled one-bedroom by Bolhão market, steps from Aliados",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": 45.7,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/softly-porto/01-living.jpg",
        "images": [
            "img/softly-porto/01-living.jpg",
            "img/softly-porto/02-kitchen.jpg",
            "img/softly-porto/03-bedroom.jpg",
            "img/softly-porto/04-detail.jpg",
            "img/softly-porto/05-bathroom.jpg",
            "img/softly-porto/06-interior.jpg"
        ],
        "description": "Softly Porto is a calm, softly furnished one-bedroom on the third floor of a classic building on Rua Fernandes Tomás, with a lift up and air conditioning throughout. Neutral tones, warm lighting and simple, comfortable furnishings make it an easy base for exploring the historic centre.",
        "neighborhood": "Rua Fernandes Tomás 845, 4000-219 Porto. Just off Praça de Almeida Garrett and the Bolhão market, this stretch of Baixa puts the Avenida dos Aliados, São Bento station and Santa Catarina's shopping street all within easy walking distance.",
        "nearby": [
            {
                "label": "Mercado do Bolhão",
                "distance": "3 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "5 min walk"
            },
            {
                "label": "São Bento train station",
                "distance": "6 min walk"
            },
            {
                "label": "Rua de Santa Catarina",
                "distance": "5 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Refrigerator",
                "Microwave",
                "Coffee maker",
                "Kettle",
                "Toaster"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Accessibility": [
                "Elevator"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "warmly-porto": {
        "name": "Warmly Porto",
        "subtitle": "A cosy one-bedroom with a private balcony in the heart of Baixa",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": 43,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/warmly-porto/01-living.jpg",
        "images": [
            "img/warmly-porto/01-living.jpg",
            "img/warmly-porto/02-kitchen.jpg",
            "img/warmly-porto/03-bedroom.jpg",
            "img/warmly-porto/04-detail.jpg",
            "img/warmly-porto/05-bathroom.jpg",
            "img/warmly-porto/06-interior.jpg"
        ],
        "description": "Warmly Porto welcomes up to four guests in a compact, sunny apartment on Rua de Santo Ildefonso, with a private balcony overlooking the street and air conditioning for warmer months. A sofa bed in the living area adds flexible sleeping space alongside the bedroom.",
        "neighborhood": "Rua de Santo Ildefonso 231, 4000-470 Porto. Santo Ildefonso sits right between Bolhão market and the Aliados avenue, a lively, central pocket of Baixa with cafés, bakeries and shops on every corner.",
        "nearby": [
            {
                "label": "Mercado do Bolhão",
                "distance": "4 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "6 min walk"
            },
            {
                "label": "Rua de Santa Catarina",
                "distance": "5 min walk"
            },
            {
                "label": "São Bento train station",
                "distance": "8 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Private balcony"
            ],
            "Kitchen": [
                "Refrigerator",
                "Microwave",
                "Coffee maker",
                "Kettle",
                "Toaster"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "amy-almada": {
        "name": "Amy Almada",
        "subtitle": "A one-bedroom with outdoor space, moments from Rua do Almada",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/amy-almada/01-kitchen.jpg",
        "images": [
            "img/amy-almada/02-bedroom.jpg",
            "img/amy-almada/01-kitchen.jpg",
            "img/amy-almada/03-bathroom.jpg",
            "img/amy-almada/04-courtyard.jpg",
            "img/amy-almada/05-garden-detail.jpg",
            "img/amy-almada/06-detail.jpg"
        ],
        "description": "Amy Almada is a bright, minimalist one-bedroom with a stone-walled private courtyard for morning coffee or an evening drink outdoors — a rare find this close to the centre. Clean-lined cabinetry, a marble kitchen splashback and a compact desk nook make it equally suited to a short break or a few working days in Porto.",
        "neighborhood": "Set just off Rua do Almada, one of Baixa's classic shopping streets, this quiet residential pocket is a short walk from Aliados, São Bento station and the riverside.",
        "nearby": [
            {
                "label": "Rua do Almada",
                "distance": "2 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "8 min walk"
            },
            {
                "label": "São Bento train station",
                "distance": "10 min walk"
            },
            {
                "label": "Mercado do Bolhão",
                "distance": "10 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Private courtyard"
            ],
            "Kitchen": [
                "Refrigerator",
                "Oven",
                "Coffee maker"
            ],
            "Entertainment": [
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "history-porto": {
        "name": "History Porto",
        "subtitle": "A duplex loft with soaring ceilings near Rua de Santa Catarina",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 2,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/history-porto/02-living.jpg",
        "images": [
            "img/history-porto/02-living.jpg",
            "img/history-porto/03-living2.jpg",
            "img/history-porto/01-entry.jpg",
            "img/history-porto/04-mezzanine.jpg",
            "img/history-porto/05-bedroom.jpg",
            "img/history-porto/06-bathroom.jpg"
        ],
        "description": "History Porto is a duplex loft with double-height ceilings, a mezzanine bedroom overlooking the living area, and a mix of traditional azulejo tile panels and folk-costume details that nod to the city's craft heritage. Wood floors, a glass-railed stairwell and large shuttered windows give the space an airy, light-filled feel across both levels.",
        "neighborhood": "The Bonfim quarter around Rua de Santa Catarina blends everyday Porto life with easy access to the centre — the shopping street, cafés and Bolhão market are all close by, with the historic core a short walk beyond.",
        "nearby": [
            {
                "label": "Rua de Santa Catarina",
                "distance": "5 min walk"
            },
            {
                "label": "Mercado do Bolhão",
                "distance": "10 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "15 min walk"
            },
            {
                "label": "Bonfim metro station",
                "distance": "8 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "casa-nina-porto": {
        "name": "Casa Nina Porto",
        "subtitle": "A one-bedroom in a gated building with a shared pool and garden, near Trindade",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": 36,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/casa-nina-porto/01-kitchen.jpg",
        "images": [
            "img/casa-nina-porto/01-kitchen.jpg",
            "img/casa-nina-porto/02-living.jpg",
            "img/casa-nina-porto/03-bathroom.jpg",
            "img/casa-nina-porto/04-detail.jpg",
            "img/casa-nina-porto/05-hallway.jpg",
            "img/casa-nina-porto/06-garden.jpg"
        ],
        "description": "Casa Nina Porto is a bright one-bedroom on Rua dos Mártires da Liberdade, inside a gated building with a shared swimming pool and garden — an unusual find this close to the centre. A private balcony, a clean modern kitchen and a calm bedroom make it a comfortable base a few minutes from Trindade metro station.",
        "neighborhood": "Rua Mártires da Liberdade 122, 4050-361 Porto. Set on the edge of the Baixa, this stretch is a short walk from Praça Coronel Pacheco, the Galeria de Paris and the shops and cafés around Trindade, with a supermarket open daily just steps away.",
        "nearby": [
            {
                "label": "Trindade metro station",
                "distance": "5 min walk"
            },
            {
                "label": "Galeria de Paris",
                "distance": "5 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "10 min walk"
            },
            {
                "label": "Supermarket",
                "distance": "2 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Balcony",
                "Collective garden"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "jenny-porto": {
        "name": "Jenny Porto",
        "subtitle": "A renovated one-bedroom with a balcony near Miguel Bombarda's art district",
        "district": "Cedofeita",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": 47,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/jenny-porto/01-living.jpg",
        "images": [
            "img/jenny-porto/01-living.jpg",
            "img/jenny-porto/02-detail.jpg",
            "img/jenny-porto/03-kitchen.jpg",
            "img/jenny-porto/04-bedroom.jpg",
            "img/jenny-porto/05-bedroom2.jpg",
            "img/jenny-porto/06-balcony.jpg"
        ],
        "description": "Jenny Porto is an elegant, light-filled one-bedroom in a new building on Rua de Clemente Meneres, with a private balcony, air conditioning and a lift. It sits in Porto's artistic Miguel Bombarda district, known for its galleries and design shops, a short walk from the historic centre.",
        "neighborhood": "Rua Clemente Menéres 64, 4050-201 Porto. Miguel Bombarda is Porto's gallery district, a leafy, creative pocket close to the Soares dos Reis museum and the Carregal garden, with the Baixa and Trindade metro within easy walking distance.",
        "nearby": [
            {
                "label": "Trindade metro station",
                "distance": "10 min walk"
            },
            {
                "label": "Galeria de Paris",
                "distance": "10 min walk"
            },
            {
                "label": "Museu Nacional Soares dos Reis",
                "distance": "5 min walk"
            },
            {
                "label": "Supermarket",
                "distance": "3 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Private balcony"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave",
                "Dishwasher",
                "Washing machine"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Accessibility": [
                "Elevator"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "shiny-porto": {
        "name": "Shiny Porto",
        "subtitle": "An elegant, renovated two-bedroom duplex for six on Rua do Almada",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 6,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 2,
        "size_m2": 106,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/shiny-porto/04-living.jpg",
        "images": [
            "img/shiny-porto/04-living.jpg",
            "img/shiny-porto/01-bedroom.jpg",
            "img/shiny-porto/02-bathroom.jpg",
            "img/shiny-porto/03-hallway.jpg",
            "img/shiny-porto/05-detail.jpg",
            "img/shiny-porto/06-staircase.jpg"
        ],
        "description": "Shiny Porto is an elegant, fully renovated duplex of 106m² on Rua do Almada, one of Baixa's classic streets. Marble-tiled bathrooms, a designer living area and a private balcony give this two-bedroom space comfortable room for up to six guests, with a lift and air conditioning throughout.",
        "neighborhood": "Rua do Almada 382, 4050-033 Porto. Rua do Almada runs through the heart of Baixa, 100 metres from Trindade metro station and a few minutes' walk from the Avenida dos Aliados, the City Hall and the Galeria de Paris — with a supermarket open daily right on the street.",
        "nearby": [
            {
                "label": "Trindade metro station",
                "distance": "2 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "5 min walk"
            },
            {
                "label": "Galeria de Paris",
                "distance": "5 min walk"
            },
            {
                "label": "Supermarket",
                "distance": "1 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Balcony"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave",
                "Dishwasher"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Accessibility": [
                "Elevator"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "so-shiny-porto": {
        "name": "Sunny Patio Retreat Porto",
        "subtitle": "A bright two-bedroom on Rua do Duque de Saldanha, steps from the São Lázaro garden",
        "district": "Fontaínhas",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 3,
        "size_m2": 90,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/so-shiny-porto/02-tv-wall.jpg",
        "images": [
            "img/so-shiny-porto/02-tv-wall.jpg",
            "img/so-shiny-porto/01-sideboard.jpg",
            "img/so-shiny-porto/03-bedroom.jpg",
            "img/so-shiny-porto/04-terrace.jpg",
            "img/so-shiny-porto/05-terrace-detail.jpg",
            "img/so-shiny-porto/06-staircase.jpg"
        ],
        "description": "So Shiny Porto is a bright 90m² apartment with two bedrooms and three bathrooms, set on Rua do Duque de Saldanha in the leafy Fontaínhas area. Blue azulejo-tiled accents, a private terrace with lounge seating and air conditioning throughout make this a comfortable base for up to four guests, just a few minutes from the Douro riverbank.",
        "neighborhood": "Rua Duque de Saldanha 535, 4300-466 Porto. Rua do Duque de Saldanha sits between the São Lázaro garden and the Porto School of Fine Arts, a quiet residential stretch that slopes down toward the Douro. The historic centre and the riverside Ribeira district are both an easy walk away.",
        "nearby": [
            {
                "label": "São Lázaro garden",
                "distance": "3 min walk"
            },
            {
                "label": "Douro riverbank",
                "distance": "8 min walk"
            },
            {
                "label": "Ribeira",
                "distance": "12 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "12 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Air conditioning",
                "Fresh linens",
                "Hairdryer",
                "Heating",
                "Wi-Fi"
            ],
            "Outdoor": [
                "Terrace"
            ],
            "Kitchen": [
                "Coffee maker",
                "Kettle",
                "Microwave",
                "Refrigerator",
                "Toaster"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "beauty-porto": {
        "name": "Beauty",
        "subtitle": "A cosy studio on Largo dos Lóios, moments from the Clérigos Tower",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 0,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": 38,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/beauty-porto/03-dining.jpg",
        "images": [
            "img/beauty-porto/03-dining.jpg",
            "img/beauty-porto/01-bathroom.jpg",
            "img/beauty-porto/02-detail.jpg",
            "img/beauty-porto/04-balcony.jpg",
            "img/beauty-porto/05-bedroom.jpg",
            "img/beauty-porto/06-street.jpg"
        ],
        "description": "Beauty is a cosy 38m² studio on Largo dos Lóios, with a French balcony overlooking the square, a compact dining corner and a warmly lit bathroom. With a lift to the building's upper floors, it's a comfortable and central pied-à-terre for two.",
        "neighborhood": "Largo dos Lóios 15, 2D, 4000-030 Porto. Largo dos Lóios sits right in the historic centre, in the shadow of the Clérigos Tower — the granite bell tower built by Nicolau Nasoni, with its 225-step climb and views over the whole city. São Bento train station and the Baixa shopping streets are all within easy reach.",
        "nearby": [
            {
                "label": "Clérigos Tower",
                "distance": "2 min walk"
            },
            {
                "label": "São Bento train station",
                "distance": "6 min walk"
            },
            {
                "label": "Livraria Lello",
                "distance": "5 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "8 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Balcony"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Accessibility": [
                "Elevator"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "sky-de-loios-porto": {
        "name": "Sky de Loios",
        "subtitle": "A light-filled studio with painted ceilings on Largo dos Lóios",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 0,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": 53,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/sky-de-loios-porto/01-bedroom.jpg",
        "images": [
            "img/sky-de-loios-porto/01-bedroom.jpg",
            "img/sky-de-loios-porto/02-dressing.jpg",
            "img/sky-de-loios-porto/03-bed-detail.jpg",
            "img/sky-de-loios-porto/04-view.jpg",
            "img/sky-de-loios-porto/05-bathroom.jpg",
            "img/sky-de-loios-porto/06-living.jpg"
        ],
        "description": "Sky de Loios is a 53m² studio with soaring ceilings, three tall French-balcony windows and a hand-painted period ceiling above the bed. A dressing area, a compact bathroom and a small living corner with TV complete this bright, high-ceilinged stay for two on Largo dos Lóios.",
        "neighborhood": "Largo dos Lóios 78/79, 4º frt, 4000-189 Porto. Largo dos Lóios is in the heart of the historic centre, close to the Clérigos Tower and Church, with rooftop views toward the city's landmark bell towers. São Bento train station and the Baixa shopping streets are all within easy reach.",
        "nearby": [
            {
                "label": "Clérigos Tower",
                "distance": "2 min walk"
            },
            {
                "label": "São Bento train station",
                "distance": "6 min walk"
            },
            {
                "label": "Livraria Lello",
                "distance": "5 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "8 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Fan",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Balcony"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Accessibility": [
                "Elevator"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "truly-porto": {
        "name": "Truly Porto",
        "subtitle": "A bright one-bedroom with terrace in the artistic Miguel Bombarda district",
        "district": "Cedofeita",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": 75,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/truly-porto/01-living.jpg",
        "images": [
            "img/truly-porto/01-living.jpg",
            "img/truly-porto/02-balcony.jpg",
            "img/truly-porto/03-shower.jpg",
            "img/truly-porto/04-entrance.jpg",
            "img/truly-porto/05-bedroom.jpg",
            "img/truly-porto/06-staircase.jpg"
        ],
        "description": "Truly Porto is an elegant and bright 75m² apartment with a private balcony and garden access, set in a fully renovated building in the artistic Miguel Bombarda district. Wi-Fi, air conditioning, a washing machine and dishwasher make this a comfortable base for two, with a lift serving the building.",
        "neighborhood": "Rua Clemente Menéres 61, 4050-202 Porto. Miguel Bombarda is Porto's gallery district, a green and creative corner near the Soares dos Reis museum and the Carregal garden, with Baixa and Trindade metro station just a few minutes away.",
        "nearby": [
            {
                "label": "Museu Nacional Soares dos Reis",
                "distance": "5 min walk"
            },
            {
                "label": "Trindade metro station",
                "distance": "12 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "15 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Balcony",
                "Garden"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave",
                "Dishwasher"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Accessibility": [
                "Elevator"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "loungy-porto": {
        "name": "Loungy",
        "subtitle": "A two-bedroom with fireplace on the historic Rua Dom João IV",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 2,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/loungy-porto/01-dining.jpg",
        "images": [
            "img/loungy-porto/01-dining.jpg",
            "img/loungy-porto/02-living-detail.jpg",
            "img/loungy-porto/03-fireplace.jpg",
            "img/loungy-porto/04-entrance.jpg",
            "img/loungy-porto/05-bedroom.jpg",
            "img/loungy-porto/06-bathroom.jpg"
        ],
        "description": "Loungy is a spacious two-bedroom apartment on Rua Dom João IV, with a wood-burning fireplace in the living room, a dining area for four, and an exterior space. Two full bathrooms, a washing machine and dishwasher, and air conditioning throughout make it a comfortable stay for two couples or a family.",
        "neighborhood": "Rua Dom João IV is a historic street in Bonfim, named for the Restoration king who freed Portugal from Spanish rule in 1640. It's a residential stretch close to the everyday life of the neighbourhood, with the centre of Porto a short ride away.",
        "nearby": [
            {
                "label": "Bonfim metro station",
                "distance": "10 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "20 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Exterior space",
                "Fireplace"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave",
                "Dishwasher",
                "Washing machine"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "cocoon-almada-porto": {
        "name": "Cocoon Almada",
        "subtitle": "A cosy studio-style one-bedroom steps from Trindade metro",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": 40,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/cocoon-almada-porto/02-bedroom.jpg",
        "images": [
            "img/cocoon-almada-porto/02-bedroom.jpg",
            "img/cocoon-almada-porto/08-living-room.jpg",
            "img/cocoon-almada-porto/07-kitchen.jpg",
            "img/cocoon-almada-porto/01-bedside.jpg",
            "img/cocoon-almada-porto/03-chair-detail.jpg",
            "img/cocoon-almada-porto/04-breakfast-nook.jpg",
            "img/cocoon-almada-porto/05-decor.jpg",
            "img/cocoon-almada-porto/06-exterior.jpg"
        ],
        "description": "Cocoon Almada is a compact and comfortable one-bedroom apartment near Rua do Dr. Ricardo Jorge, ideal for a couple exploring Porto on foot. The bedroom has a wall-mounted TV, the small breakfast nook is a bright spot for a morning coffee, and the building sits an elevator ride up from the street. Air conditioning and heating keep things comfortable year-round.",
        "neighborhood": "Rua Dr. Ricardo Jorge 96, 4050-039 Porto. This stretch of the Baixa sits between Trindade and Aliados, a few minutes' walk from the Câmara Municipal and the city's main civic square. It's a well-connected base with the metro, cafés and everyday shops all close by.",
        "nearby": [
            {
                "label": "Trindade metro station",
                "distance": "5 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "8 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Dishwasher"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Accessibility": [
                "Elevator"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "tomas-loft-porto": {
        "name": "Tomas Loft",
        "subtitle": "A spacious two-bedroom loft with balcony on Rua de Fernandes Tomás",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 2,
        "size_m2": 194,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/tomas-loft-porto/02-living.jpg",
        "images": [
            "img/tomas-loft-porto/02-living.jpg",
            "img/tomas-loft-porto/03-living-loft.jpg",
            "img/tomas-loft-porto/01-terrace-plants.jpg",
            "img/tomas-loft-porto/04-bedroom.jpg",
            "img/tomas-loft-porto/05-lounge.jpg",
            "img/tomas-loft-porto/06-kitchen.jpg"
        ],
        "description": "Tomas Loft is a striking 194m² attic apartment with exposed wooden beams soaring over an open-plan living and dining area, a private balcony, and a cosy lounge corner with fireside seating. Two full bedrooms and two bathrooms make it a comfortable stay for two couples or a family, with a fully equipped kitchen, dishwasher and washing machine for longer stays.",
        "neighborhood": "Rua Fernandes Tomás 235, 4000-215 Porto. Rua de Fernandes Tomás sits right in the heart of Aliados and Bolhão, a short stroll from the historic Mercado do Bolhão and Porto's grand central avenue. It's one of the most central bases in the city, with Trindade metro and the Câmara Municipal both nearby.",
        "nearby": [
            {
                "label": "Mercado do Bolhão",
                "distance": "5 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "6 min walk"
            },
            {
                "label": "Trindade metro station",
                "distance": "8 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Balcony"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave",
                "Dishwasher",
                "Washing machine"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "family-porto": {
        "name": "Family Porto",
        "subtitle": "A four-bedroom floor-through apartment on Rua Duque de Loulé",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 10,
        "bedrooms": 4,
        "beds": 4,
        "bathrooms": 2,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/family-porto/01-living.jpg",
        "images": [
            "img/family-porto/01-living.jpg",
            "img/family-porto/02-dining-kitchen.jpg",
            "img/family-porto/03-bedroom1.jpg",
            "img/family-porto/04-bedroom2.jpg",
            "img/family-porto/05-bedroom3.jpg",
            "img/family-porto/06-bedroom4.jpg"
        ],
        "description": "Family Porto is a spacious four-bedroom apartment occupying the first floor of a classic Porto building, with a bright living and dining room, an open kitchen and two full bathrooms. Each of the four bedrooms is individually decorated, making this a comfortable base for a large group or family visiting the city together.",
        "neighborhood": "Rua Duque de Loulé 22. Rua Duque de Loulé runs through the heart of the Baixa, close to São Bento train station and the Batalha square, with the Ribeira riverfront and Avenida dos Aliados both within easy walking distance.",
        "nearby": [
            {
                "label": "São Bento train station",
                "distance": "10 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "10 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave",
                "Dishwasher"
            ],
            "Laundry": [
                "Washing machine",
                "Drying machine",
                "Iron"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "so-family-porto": {
        "name": "So Family Porto",
        "subtitle": "A four-bedroom apartment with home office on Rua Duque de Loulé",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 10,
        "bedrooms": 4,
        "beds": 5,
        "bathrooms": 3,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/so-family-porto/01-bedroom.jpg",
        "images": [
            "img/so-family-porto/01-bedroom.jpg",
            "img/so-family-porto/02-bedroom2.jpg",
            "img/so-family-porto/03-bedroom3.jpg",
            "img/so-family-porto/04-bedroom4.jpg",
            "img/so-family-porto/05-twinbeds.jpg",
            "img/so-family-porto/06-bathroom.jpg"
        ],
        "description": "So Family Porto is a large four-bedroom apartment sharing the same historic building as Family Porto, with three full bathrooms, a small home office and a dedicated laundry room. Twin and double beds across the four bedrooms make it well suited to groups of friends or extended family travelling together.",
        "neighborhood": "Rua Duque de Loulé 22. Rua Duque de Loulé runs through the heart of the Baixa, close to São Bento train station and the Batalha square, with the Ribeira riverfront and Avenida dos Aliados both within easy walking distance.",
        "nearby": [
            {
                "label": "São Bento train station",
                "distance": "10 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "10 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave"
            ],
            "Laundry": [
                "Washing machine",
                "Drying machine",
                "Iron"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        }
    },
    "purely-porto": {
        "name": "Purely Porto",
        "subtitle": "A four-bedroom apartment with a striking teal dining room, on Rua Duque de Loulé",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 10,
        "bedrooms": 4,
        "beds": 4,
        "bathrooms": 2,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/purely-porto/01-living-dining.jpg",
        "images": [
            "img/purely-porto/01-living-dining.jpg",
            "img/purely-porto/02-kitchen.jpg",
            "img/purely-porto/03-bedroom1.jpg",
            "img/purely-porto/04-bedroom2.jpg",
            "img/purely-porto/05-bedroom3.jpg",
            "img/purely-porto/06-bedroom4.jpg",
            "img/purely-porto/07-bathroom1.jpg",
            "img/purely-porto/08-bathroom2.jpg"
        ],
        "description": "Purely Porto occupies the top floor of the same historic building as Family Porto and So Family Porto, with a striking teal-walled dining room seating eight, a long galley kitchen and four individually decorated bedrooms. Two full bathrooms — one classic, one finished in blue mosaic tile — make this a comfortable base for a large group or extended family visiting the city together.",
        "neighborhood": "Rua Duque de Loulé 22. Rua Duque de Loulé runs through the heart of the Baixa, close to São Bento train station and the Batalha square, with the Ribeira riverfront and Avenida dos Aliados both within easy walking distance.",
        "nearby": [
            {
                "label": "São Bento train station",
                "distance": "10 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "10 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Kitchen": [
                "Refrigerator",
                "Oven",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave",
                "Dishwasher"
            ],
            "Laundry": [
                "Washing machine",
                "Drying machine",
                "Iron"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "so-simply-ribeira": {
        "name": "So Simply Ribeira",
        "subtitle": "A two-bedroom apartment with balcony views over Ribeira",
        "district": "Ribeira",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 1,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/so-simply-ribeira/02-dining.jpg",
        "images": [
            "img/so-simply-ribeira/02-dining.jpg",
            "img/so-simply-ribeira/01-street-view.jpg",
            "img/so-simply-ribeira/03-kitchen.jpg",
            "img/so-simply-ribeira/04-bedroom.jpg",
            "img/so-simply-ribeira/05-hallway-art.jpg",
            "img/so-simply-ribeira/06-bedroom-art.jpg"
        ],
        "description": "So Simply Ribeira is a bright two-bedroom apartment on Rua de São Francisco, with balcony doors opening onto the rooftops of the old town and a dining table set for four. A fully equipped kitchen and a fan-cooled second bedroom make this a comfortable, well-located base for exploring Porto's historic centre on foot.",
        "neighborhood": "Rua de São Francisco is one of Ribeira's most storied streets, home to the gilded Igreja de São Francisco and just a short walk down the hill to the Douro riverfront and the Ribeira Square.",
        "nearby": [
            {
                "label": "Ribeira riverfront",
                "distance": "8 min walk"
            },
            {
                "label": "São Bento train station",
                "distance": "10 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating",
                "Fresh linens",
                "Hairdryer"
            ],
            "Outdoor": [
                "Balcony"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster",
                "Microwave"
            ],
            "Entertainment": [
                "TV",
                "Wi-Fi"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "charming-garden-porto": {
        "name": "Charming Garden Porto",
        "district": "Fontaínhas",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "bathrooms": 2,
        "size_m2": null,
        "priceFrom": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "subtitle": "A bright duplex with a private enclosed garden patio, in Fontaínhas",
        "description": "A bright, quiet duplex in Fontaínhas built around its own private, fully enclosed garden — an olive tree, gravel paths and woven-rattan chairs tucked behind the building's walls. Inside, a double-height living and dining room seats four under exposed wooden beams, next to a fully equipped kitchen with a dishwasher and espresso machine. Upstairs, two queen bedrooms — one en suite — share two full bathrooms with showers. A 10-minute walk from 24 de Agosto metro station.",
        "neighborhood": "Rua de São Vitor 31, Fontaínhas, a 10-minute walk from 24 de Agosto metro station.",
        "nearby": [
            {
                "label": "24 de Agosto metro",
                "distance": "10 min walk"
            }
        ],
        "checkIn": "16:00–23:00",
        "checkOut": "11:00",
        "safety": {
            "smokeAlarm": false,
            "coAlarm": false
        },
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Kitchen": [
                "Refrigerator",
                "Stove",
                "Oven",
                "Dishwasher",
                "Coffee maker",
                "Kettle"
            ],
            "Entertainment": [
                "TV"
            ],
            "Outdoor": [
                "Private patio"
            ]
        },
        "heroImage": "img/charming-garden-porto/01-patio.jpg",
        "images": [
            "img/charming-garden-porto/01-patio.jpg",
            "img/charming-garden-porto/02-living.jpg",
            "img/charming-garden-porto/03-kitchen.jpg",
            "img/charming-garden-porto/04-dining.jpg",
            "img/charming-garden-porto/05-mezzanine.jpg",
            "img/charming-garden-porto/06-living-view.jpg",
            "img/charming-garden-porto/07-bedroom1.jpg",
            "img/charming-garden-porto/08-bedroom2.jpg",
            "img/charming-garden-porto/09-bathroom1.jpg",
            "img/charming-garden-porto/10-bathroom2.jpg"
        ]
    },
    "so-gracy-porto": {
        "name": "Touchy Studio Porto",
        "subtitle": "A vintage-styled garden-level studio with a striking teal kitchen, in the heart of Baixa",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 0,
        "beds": 1,
        "bathrooms": 1,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/so-gracy-porto/01-living-bed.jpg",
        "images": [
            "img/so-gracy-porto/01-living-bed.jpg",
            "img/so-gracy-porto/02-living-room.jpg",
            "img/so-gracy-porto/03-kitchen-living.jpg",
            "img/so-gracy-porto/04-kitchen-detail.jpg",
            "img/so-gracy-porto/05-sofa.jpg",
            "img/so-gracy-porto/06-bed-detail.jpg",
            "img/so-gracy-porto/07-dining-corner.jpg"
        ],
        "description": "Touchy Studio Porto is a stylish, open-plan studio on the garden level of a Baixa townhouse, mixing mid-century and vintage furniture — a green leather sofa, brass-trimmed cabinetry, layered rugs — around a striking teal-and-marble kitchen. Terrazzo floors and tall barred windows give it a quiet, light-filled character, with a comfortable bed making it a stylish base for two in central Porto.",
        "neighborhood": "Rua de Álvares Cabral 372, Porto. Baixa is Porto's historic centre — cobbled streets, azulejo facades, and the widest concentration of cafés, shops, and miradouros in the city, with Rua do Almada and the Aliados just a few minutes away.",
        "nearby": [
            {
                "label": "Avenida dos Aliados",
                "distance": "7 min walk"
            },
            {
                "label": "São Bento train station",
                "distance": "9 min walk"
            },
            {
                "label": "Ribeira riverfront",
                "distance": "13 min walk"
            },
            {
                "label": "Mercado do Bolhão",
                "distance": "9 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Heating"
            ],
            "Kitchen": [
                "Refrigerator",
                "Oven",
                "Stovetop",
                "Microwave",
                "Coffee maker",
                "Toaster",
                "Kettle",
                "Cookware"
            ],
            "Entertainment": [
                "TV"
            ],
            "Safety": [
                "Fire extinguisher"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "charmy-studio-porto": {
        "name": "Charmy Studio",
        "subtitle": "A duplex studio with a spiral staircase and balcony views over Baixa — 3rd floor, no lift",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 3,
        "bedrooms": 0,
        "beds": 2,
        "bathrooms": 1,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/charmy-studio-porto/01-living-staircase.jpg",
        "images": [
            "img/charmy-studio-porto/01-living-staircase.jpg",
            "img/charmy-studio-porto/02-mezzanine.jpg",
            "img/charmy-studio-porto/03-bed-kitchen.jpg",
            "img/charmy-studio-porto/04-tv-console.jpg",
            "img/charmy-studio-porto/05-staircase-detail.jpg"
        ],
        "description": "Charmy Studio is a bright duplex on the third floor of a classic Baixa building — reached by stairs only, no lift — where a wrought-iron spiral staircase leads up to a mezzanine lounge with French doors opening onto tiled rooftops across the street. Downstairs, a retro fridge and a marble-and-brass kitchen sit beside a comfortable bed. A sofa bed is available for a third guest, for a supplement of €20 per stay.",
        "neighborhood": "Rua de Álvares Cabral 372, Porto. Baixa is Porto's historic centre — cobbled streets, azulejo facades, and the widest concentration of cafés, shops, and miradouros in the city, with Rua do Almada and the Aliados just a few minutes away.",
        "nearby": [
            {
                "label": "Avenida dos Aliados",
                "distance": "7 min walk"
            },
            {
                "label": "São Bento train station",
                "distance": "9 min walk"
            },
            {
                "label": "Ribeira riverfront",
                "distance": "13 min walk"
            },
            {
                "label": "Mercado do Bolhão",
                "distance": "9 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning"
            ],
            "Kitchen": [
                "Refrigerator",
                "Stovetop",
                "Coffee maker"
            ],
            "Entertainment": [
                "TV"
            ],
            "Safety": [
                "Fire extinguisher"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "loft-sto-antonio-porto": {
        "name": "Loft Sto António",
        "subtitle": "A bright mezzanine loft on Rua de Santo Ildefonso, steps from Bolhão",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 4,
        "bedrooms": 0,
        "beds": 2,
        "bathrooms": 1,
        "size_m2": null,
        "rating": null,
        "reviews": null,
        "price": null,
        "featured": false,
        "heroImage": "img/loft-sto-antonio-porto/01-living-room.jpg",
        "images": [
            "img/loft-sto-antonio-porto/01-living-room.jpg",
            "img/loft-sto-antonio-porto/02-mezzanine-bed.jpg",
            "img/loft-sto-antonio-porto/03-living-tv.jpg",
            "img/loft-sto-antonio-porto/04-kitchenette.jpg",
            "img/loft-sto-antonio-porto/05-sofa-detail.jpg",
            "img/loft-sto-antonio-porto/06-staircase.jpg",
            "img/loft-sto-antonio-porto/07-facade.jpg"
        ],
        "description": "Loft Sto António is a bright, high-ceilinged loft on a classic granite-fronted building on Rua de Santo Ildefonso, with tall shuttered windows looking out over the street. An open living and dining area on the main floor holds a comfortable sofa bed, while a wooden staircase climbs to a cosy mezzanine bedroom tucked under the exposed roof beams. A compact kitchenette covers the essentials — kettle, coffee maker, toaster, and mini-fridge. Just a few minutes on foot from Mercado do Bolhão and Avenida dos Aliados, it's a well-placed base for exploring central Porto on foot.",
        "neighborhood": "Rua de Santo Ildefonso 41, Porto. A central street between Baixa and Bonfim, a short walk from Mercado do Bolhão, Rua de Santa Catarina, and the Aliados — one of the most walkable pockets of the city.",
        "nearby": [
            {
                "label": "Mercado do Bolhão",
                "distance": "6 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "9 min walk"
            },
            {
                "label": "Rua de Santa Catarina",
                "distance": "5 min walk"
            },
            {
                "label": "São Bento train station",
                "distance": "12 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Heating"
            ],
            "Kitchen": [
                "Refrigerator",
                "Coffee maker",
                "Kettle",
                "Toaster"
            ],
            "Entertainment": [
                "TV"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "gardeny-porto": {
        "name": "Gardeny",
        "subtitle": "A triplex townhouse with a private garden on a quiet street in Bonfim",
        "district": "Bonfim",
        "city": "Porto",
        "country": "Portugal",
        "guests": 6,
        "bedrooms": 3,
        "beds": 3,
        "bathrooms": 2,
        "size_m2": null,
        "rating": 4.76,
        "reviews": 41,
        "price": null,
        "featured": false,
        "heroImage": "img/gardeny-porto/01-garden.jpg",
        "images": [
            "img/gardeny-porto/01-garden.jpg",
            "img/gardeny-porto/02-living-room.jpg",
            "img/gardeny-porto/03-living-sofa.jpg",
            "img/gardeny-porto/04-dining.jpg",
            "img/gardeny-porto/05-kitchen.jpg",
            "img/gardeny-porto/06-bedroom-one.jpg",
            "img/gardeny-porto/07-bedroom-two.jpg",
            "img/gardeny-porto/08-sofa-bed-nook.jpg",
            "img/gardeny-porto/09-bathroom-one.jpg",
            "img/gardeny-porto/10-bathroom-two.jpg",
            "img/gardeny-porto/11-facade.jpg"
        ],
        "description": "Gardeny is a triplex townhouse on a quiet street in Bonfim, with its own private garden — a rare find this close to the centre. The ground floor is an open living room and kitchen that spills out onto the garden, where a patch of grass, a swing, and a dining table sit under the trees, closed in by tiled walls for full privacy. A wood-burning stove and a cheerful yellow armchair anchor the living room. The second floor has a bedroom with its own bathroom, and the third has a second ensuite bedroom plus a small room with a sofa bed. It's a calm, homely base with genuine outdoor space, a short walk from Campo 24 de Agosto.",
        "neighborhood": "Travessa Monte dos Congregados 55, Porto. A quiet residential corner of Bonfim, close to Campo 24 de Agosto and a short walk from the shops and cafés of Rua de Costa Cabral.",
        "nearby": [
            {
                "label": "Campo 24 de Agosto",
                "distance": "8 min walk"
            },
            {
                "label": "Praça dos Poveiros",
                "distance": "14 min walk"
            },
            {
                "label": "Avenida dos Aliados",
                "distance": "20 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Heating"
            ],
            "Kitchen": [
                "Refrigerator",
                "Oven",
                "Stovetop",
                "Microwave",
                "Coffee maker"
            ],
            "Entertainment": [
                "TV"
            ],
            "Outdoor": [
                "Private garden"
            ],
            "Safety": [
                "Fire extinguisher",
                "First aid kit"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    },
    "gracy-porto": {
        "name": "Gracy Porto",
        "subtitle": "A bright studio with a garden terrace, in the heart of Baixa",
        "district": "Baixa",
        "city": "Porto",
        "country": "Portugal",
        "guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "bathrooms": 1.5,
        "size_m2": null,
        "rating": 4.78,
        "reviews": 102,
        "price": null,
        "featured": false,
        "heroImage": "img/gracy-porto/01-garden.jpg",
        "images": [
            "img/gracy-porto/01-garden.jpg",
            "img/gracy-porto/02-living-overview.jpg",
            "img/gracy-porto/03-living-garden-doors.jpg",
            "img/gracy-porto/04-dining.jpg",
            "img/gracy-porto/05-kitchen.jpg",
            "img/gracy-porto/06-kitchen-sink-detail.jpg",
            "img/gracy-porto/07-bedroom.jpg",
            "img/gracy-porto/08-staircase.jpg",
            "img/gracy-porto/09-building-entrance.jpg"
        ],
        "description": "Gracy Porto is a bright, spacious studio in the same Baixa townhouse as Touchy Studio Porto and Charmy Studio, a short walk from Rua do Almada and the Aliados. A pink marble kitchenette with brass fittings opens onto a warm living and dining area furnished with vintage pieces, glass doors leading out to a small garden terrace scattered with wildflowers. The queen bed sits behind an open shelving divider, and the building itself has a striking wrought-iron spiral staircase. A comfortable, well-equipped base for two in central Porto.",
        "neighborhood": "Rua de Álvares Cabral 372, Porto. Baixa is Porto's historic centre — cobbled streets, azulejo facades, and the widest concentration of cafés, shops, and miradouros in the city, with Rua do Almada and the Aliados just a few minutes away.",
        "nearby": [
            {
                "label": "Avenida dos Aliados",
                "distance": "7 min walk"
            },
            {
                "label": "São Bento train station",
                "distance": "9 min walk"
            },
            {
                "label": "Ribeira riverfront",
                "distance": "13 min walk"
            },
            {
                "label": "Mercado do Bolhão",
                "distance": "9 min walk"
            }
        ],
        "amenities": {
            "Essentials": [
                "Wi-Fi",
                "Air conditioning",
                "Hairdryer"
            ],
            "Kitchen": [
                "Refrigerator",
                "Oven",
                "Stove",
                "Kettle",
                "Coffee maker"
            ],
            "Entertainment": [
                "TV"
            ],
            "Outdoor": [
                "Garden view",
                "Terrace"
            ],
            "Laundry": [
                "Washing machine"
            ],
            "Safety": [
                "Fire extinguisher"
            ]
        },
        "checkIn": "16:00–23:00",
        "checkOut": "11:00"
    }
};

/* Helper: read the ?p= query param and return the matching property */
function getPropertyFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('p');
  return slug && PROPERTIES[slug] ? { slug, ...PROPERTIES[slug] } : null;
}

/* Helper: featured properties (with real photos) for the homepage grid */
function getFeaturedProperties() {
  return Object.entries(PROPERTIES)
    .filter(([, p]) => p.featured)
    .map(([slug, p]) => ({ slug, ...p }));
}

/* Helper: directory properties grouped by district, in original order */
function getDirectoryProperties() {
  return Object.entries(PROPERTIES)
    .filter(([, p]) => !p.featured)
    .map(([slug, p]) => ({ slug, ...p }));
}

/* Helper: every property (featured + directory) — used by the full collection page */
function getAllProperties() {
  return Object.entries(PROPERTIES)
    .map(([slug, p]) => ({ slug, ...p }));
}
