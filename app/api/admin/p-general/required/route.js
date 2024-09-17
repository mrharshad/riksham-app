export async function POST(req) {
  try {
    let { category } = await req.json();

    const requiredDes = {
      Accessories: {
        tOfPS: ["College Bag", "Cap", "Keychain", "Wallets"],
        brands: [
          "NA",
          "Blue Beads",
          "GLUN",
          "Global Grabbers",
          "Hindustan Foam",
          "Puma",
          "Wesley",
        ],
        keyValueD: {
          common: ["Material"],
        },
        aInfo: {
          common: ["Country of Origin"],
        },
        certificate: {
          common: [],
        },
      },
      Athletic: {
        tOfPS: [
          "Sport A-L Socks",
          "Sport K-L Socks",
          "Marking Cone",
          "Disc Cone",
          "Ankle Support",
          "Knee Support",
          "Skipping Rope",
        ],
        brands: ["NA", "Vector X", "BLACK PANTHER", "Nivia"],
        keyValueD: {
          common: ["Material"],
        },
        aInfo: {
          common: ["Country of Origin"],
        },
        certificate: {
          common: [],
        },
      },
      Bathroom: {
        tOfPS: ["Holder For Bathroom", "Soap Stand", "Tooth Brush Holder"],
        brands: ["NA", "iSTAR", "Plantex"],
        keyValueD: {
          common: ["Material"],
        },
        aInfo: {
          common: ["Country of Origin"],
        },
        certificate: {
          common: [],
        },
      },
      "Men's Wear": {
        tOfPS: [
          "Mens Shirts",
          "Mens T-Shirts",
          "Mens Shorts ",
          "Mens Track Pants",
          "Mens Joggers",
          "Mens Jeans",
          "Mens Underwear",
          "Mens Vests",
        ],
        brands: ["Jockey"],
        keyValueD: {
          common: ["Material", "Care instructions"],
        },
        aInfo: {
          common: ["Country of Origin", "Net Quantity"],
        },
        certificate: {
          common: [],
        },
      },
      "Men's Accessories": {
        tOfPS: [
          "Mens Belts",
          "Mens Cap",
          "Mens Coats",
          "Mens Jackets",
          "Mens Wallets",
        ],
        brands: ["Adidas", "Puma", "Protect", "Sixit", "Vicky"],
        keyValueD: {
          common: ["Material", "Net Quantity"],
        },
        aInfo: {
          common: ["Country of Origin", "Container Type"],
        },
        certificate: {
          common: [],
        },
      },
      "Men's Footwear": {
        tOfPS: [
          "Mens Sports Shoes",
          "Mens Sneakers",
          "Mens Casual Shoes",
          "Mens Slippers",
          "Mens Socks",
        ],
        brands: ["Adidas", "Puma", "Protect", "Sixit", "Vicky"],
        keyValueD: {
          common: ["Material"],
        },
        aInfo: {
          common: ["Country of Origin", "Container Type"],
        },
        certificate: {
          common: [],
        },
      },
      "Face Care": {
        tOfPS: ["Face Wash", "Face Cream", "Face Scrub"],
        brands: [
          "The Body Shop",
          "Neutrogena",
          "L'Oreal",
          "Himalaya",
          "Cetaphil",
          "Clinique",
          "Clean & Clear",
          "Nivea",
          "Garnier",
          "Olay",
          "Ponds",
          "Kiehl's",
          "Forest Essentials",
          "Lotus Herbals",
          "Aveeno",
          "Globus Naturals",
          "Simple",
        ],
        keyValueD: {
          common: ["Skin Type", "Age range"],
          // "Face Cream": ["test 1", "test 2"],  isme kisi type ke product ka keyValue defrance kya hoga likh sakte hai
        },
        aInfo: {
          common: ["Country of Origin", "Container Type"],
        },
        certificate: {
          common: [
            // "Bureau of Indian Standards (BIS)",
            // "Drug Controller General of India (DCGI)",
          ],
        },
      },
      Badminton: {
        tOfPS: [
          "Badminton Ball",
          "Badminton Racket",
          "Badminton Accessories",
          "Shuttlecock",
        ],
        brands: ["NA", "Adidas", "Li-Ning", "Puma", "Yonex", "Vector X"],
        keyValueD: {
          common: ["Material"],
        },
        aInfo: {
          common: ["Country of Origin"],
        },
        certificate: {
          common: [],
        },
      },

      "Body Care": {
        tOfPS: ["Body Wash", "Body Lotion"],
        brands: [
          "Ancient Living",
          "The Body Shop",
          "Neutrogena",
          "L'Oreal",
          "Lakme",
          "Himalaya Herbals",
          "Cetaphil",
          "Clinique",
          "Clean & Clear",
          "Nivea",
          "Garnier",
          "Olay",
          "Ponds",
          "Kiehl's",
          "Forest Essentials",
          "Lotus Herbals",
          "Aveeno",
        ],
        keyValueD: {
          common: ["Skin Type", "Net Quantity", "Age range"],
          // "Face Cream": ["test 1", "test 2"],  isme kisi type ke product ka keyValue defrance kya hoga likh sakte hai
        },
        aInfo: {
          common: ["Country of Origin", "Maximum Use", "Container Type"],
        },
        certificate: {
          common: [],
        },
      },
      "Car Accessories": {
        tOfPS: ["Car Dashboard"],
        brands: ["Godrej"],
        keyValueD: {
          common: ["Material"],
        },
        aInfo: {
          common: ["Country of Origin"],
        },
        certificate: {
          common: [],
        },
      },
      Cricket: {
        tOfPS: [
          "Cricket Bat",
          "Cricket Ball",
          "Cricket Stump",
          "Cricket Gloves",
          "Cricket Abdominal Guard",
          "Cricket Tennis Ball",
        ],
        brands: ["Adidas", "Puma", "Protect", "Sixit", "Vicky"],
        keyValueD: {
          common: ["Material", "Net Quantity"],
        },
        aInfo: {
          common: ["Country of Origin", "Container Type"],
        },
        certificate: {
          common: [],
        },
      },

      "Home Appliances": {
        tOfPS: ["Air Freshener"],
        brands: ["Godrej"],
        keyValueD: {
          common: ["Material"],
        },
        aInfo: {
          common: ["Country of Origin"],
        },
        certificate: {
          common: [],
        },
      },
      Football: {
        tOfPS: [
          "Football Shoes",
          "Football",
          "Football Gloves",
          "Football Shoes",
        ],
        brands: ["Adidas", "Puma", "Nivia", "Sega", "Vector X"],
        keyValueD: {
          common: ["Material"],
          "Football Shoes": ["Sole material"],
        },
        aInfo: {
          common: ["Country of Origin"],
        },
        certificate: {
          common: [],
        },
      },

      "Hair Care": {
        tOfPS: ["Shampoo"],
        brands: ["Indulekha"],
        keyValueD: {
          common: ["Material"],
        },
        aInfo: {
          common: ["Country of Origin"],
        },
        certificate: {
          common: [],
        },
      },

      Skates: {
        tOfPS: [
          "Skateboard",
          "Inline Skates",
          "Roller Skates",
          "Skating Bag",
          "Quad Skates",
        ],
        brands: ["HCN", "VKDAS", "Viva"],
        keyValueD: {
          common: ["Size", "Item Weight", "Wheel Size"],
        },
        aInfo: {
          common: ["Material", "Wheel Material", "Country of Origin"],
        },
        certificate: {
          common: [],
        },
      },
      Fitness: {
        tOfPS: [
          "Pushup Equipment",
          "Tools For Abs",
          "Weight Machine For Body",
          "Protein Shaker",
          "Exercise Ball",
          "Fitness Gloves",
          "Wrist Band",
          "Strengthener",
          "Yoga Mat",
          "Massage Roller",
          "Resistance Band",
          "Kettlebell",
        ],
        brands: [
          "NA",
          "Vector X",
          "SUVARNA",
          "Champs Fighter",
          "Morex",
          "Mikado",
        ],
        keyValueD: {
          common: ["Material"],
          "Weight Machine For Body": ["Warranty"],
          "Protein Shaker": ["Capacity", "Product Dimensions"],
        },
        aInfo: {
          common: ["Country of Origin"],
        },
        certificate: {
          common: [],
        },
      },

      Kitchen: {
        tOfPS: ["For Egg", "For Serving", "For Food Storage"],
        brands: [
          "NA",
          "Kent",
          "Whysko",
          "4 Sacred",
          "Lifelong",
          "Lishonn",
          "Nestasia",
          "Pepplo",
        ],
        keyValueD: {
          common: ["Material"],
        },
        aInfo: {
          common: ["Country of Origin"],
        },
        certificate: {
          common: [],
        },
      },
      "Men Athletic": {
        tOfPS: ["Men Supporter"],
        brands: ["BLACK PANTHER"],
        keyValueD: {
          common: ["Material"],
        },
        aInfo: {
          common: ["Country of Origin"],
        },
        certificate: {
          common: [],
        },
      },
      Sports: {
        tOfPS: [
          "Chess Coins",
          "Chess Set",
          "Carrom Coins",
          "Flying Disc",
          "Basketball",
          "Volleyball",
          "Ball Pump",
        ],
        brands: ["NA", "Techno Galaxy", "Mikado", "Magic", "Vinex", "Nivia"],
        keyValueD: {
          common: ["Material"],
        },
        aInfo: {
          common: ["Country of Origin"],
        },
        certificate: {
          common: [],
        },
      },
      Showpiece: {
        tOfPS: ["Energizing Art"],
        brands: ["NA", "Xtore", "Global Grabbers"],
        keyValueD: {
          common: ["Material"],
        },
        aInfo: {
          common: ["Country of Origin"],
        },
        certificate: {
          common: [],
        },
      },
    };

    const data = requiredDes[category];
    if (!data) {
      throw new Error("category not found");
    }
    data.category = category;
    return new Response(
      JSON.stringify({
        success: true,
        message: "Data Send Successfully",
        data,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        message: err.message,
      }),
      {
        status: 200,
      }
    );
  }
}

// Socks: {
//   tOfPS: [

//     "Low Show",
//     "No Show",
//     "High Ankle",
//     "Knee Length",
//   ],
//   brands: ["Adidas", "Puma", "Nivia", "Sega", "Vector X"],
//   keyValueD: {
//     common: ["Material"],
//   },
//   aInfo: {
//     common: ["Country of Origin"],
//   },
//   certificate: {
//     common: [],
//   },
// },
