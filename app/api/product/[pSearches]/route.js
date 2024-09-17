import client from "@/backend/config/redisConnect";
import dbConnect from "@/backend/config/dbConnect";
import Products from "@/backend/models/Products";
// apply api  - header.js

export async function GET(req, context) {
  try {
    const key = context.params.pSearches;
    let tOfPData = [
      "Ball",
      "Hand Grip",
      "Abs Roller",
      "Football Shoes",
      "Volleyball",
      "Football Socks",
      "Badminton Racket",
      "Fitness Gloves",
      "Resistance Band",
      "Disc Cones",
      "Marking Cones",
      "Massage Roller",
      "Kettle Bell",
      "Resistance Tube",
      "Wrist Support",
      "Inline Skates",
      "Shuttlecock",
      "Dumbbell",
      "Cricket Stumps",
      "Gym Ball",
      "Quad Roller Skates",
      "Ab Roller",
      "Skipping Rope",
      "Protein Shaker",
      "Chess Set",
      "Chess Coin",
      "Yoga Mat",
      "Water Bottle",
      "Carrom Coins",
      "Knee Support",
      "Chess Pieces",
      "Supporter",
      "Elbow Support",
      "Skating Protective Set",
      "Throwing Discs",
      "Hand Gripper",
      "Weighing Scale",
      "Abdominal Guard",
      "Face Scrub",
      "Face Cream",
      "Face Moisturizer",
      "Bleach",
      "Face Wash",
      "Sunscreen",
      "Face Lotion",
    ];

    let nameData = [
      { _id: "1", name: "Sixit Lite Cricket Tennis Ball" },
      {
        _id: "3",
        name: "Morex 10 KG-40 KG  Adjustable Hand Grip Strengthener",
      },
      { _id: "4", name: "Vector X Abs  Roller" },
      { _id: "5", name: "Sega Spectra Football Shoes" },
      {
        _id: "6",
        name: "Spartan Approved By Vfi Super Volley Leather Volleyball",
      },
      { _id: "7", name: "Vicky Cricket Tennis Ball" },
      { _id: "8", name: "Vector X Cyrus Football Socks" },
      { _id: "9", name: "Sega Men'S  Football Shoes" },
      { _id: "10", name: "Nivia Shining Star Football" },
      { _id: "11", name: "Yonex Badminton Racket 200 THL" },
      { _id: "12", name: "Vector X Vx-Majestic Fitness Gloves" },
      { _id: "14", name: "Vector X Restance Band" },
      {
        _id: "15",
        name: "Disc Plastic Space Marker Agility Soccer Cones for Training, Field Cone Mar",
      },
      { _id: "16", name: "Multi Color Plastic Marking Cones 10 pieces" },
      {
        _id: "17",
        name: "Vector X JF-3159 Massage Roller for Physical Therapy Muscle Recovery",
      },
      {
        _id: "18",
        name: "Vector X JF-3169 Massage Roller for Physical Therapy Muscle Recovery",
      },
      { _id: "19", name: "Kettle Bell 1kg - 10kg" },
      { _id: "20", name: "VECTOR X JF-2103 Resistance Tube" },
      {
        _id: "21",
        name: "Champs fighter  Cotton Wrist Support - Pack of 2",
      },
      {
        _id: "22",
        name: "Mikado wrist support comfortable Cotton Gym Wrist band Wrap Band",
      },
      { _id: "23", name: "Viva Inline Unisex Outdoor Adjustable Skating" },
      { _id: "24", name: "Yonex Mavis 350 Nylon Shuttlecock" },
      { _id: "25", name: "Yonex Mavis 2000 Nylon Shuttlecock" },
      { _id: "26", name: "Yonex Mavis 600 Nylon Shuttlecock" },
      { _id: "27", name: "Yonex Mavis 10 Nylon Shuttlecock" },
      { _id: "28", name: "Li-Ning Bolt Boost shuttlecock" },
      { _id: "29", name: "Vinyl Dumbbells Set" },
      { _id: "30", name: "Plastic Cricket Stumps Set" },
      { _id: "31", name: "Li-Ning Bolt Neo shuttlecock" },
      {
        _id: "32",
        name: "Cricket Wooden Stumps , Wickets Stumps , Cricket Stumps",
      },
      {
        _id: "33",
        name: "Vector X Gym Ball, Exercise Ball, Yoga Ball, Workout  Ball  with Foot Pump",
      },
      { _id: "34", name: "VIVA  Quad Roller Skates" },
      {
        _id: "35",
        name: "Vector X Broad Exercise Wheel for core workout, ab roller",
      },
      { _id: "38", name: "Protech Adjustable Jumping Rope, Skipping Rope" },
      { _id: "39", name: "Adjustable Jumping Rope, Skipping Rope" },
      { _id: "40", name: "Vector X Shaker Bottle For Protein Shaker" },
      {
        _id: "41",
        name: "Vector X Plastic Gym Energy Shaker Bottle 600 Milliliters",
      },
      {
        _id: "42",
        name: "Mikado sports 18'' x 18'' Tournament Chess Vinyl Foldable Chess",
      },
      { _id: "43", name: "Vinex Roll On Chess Set , Vinyl Foldable Chess" },
      { _id: "44", name: "Vinex Regular Chess Coin" },
      { _id: "45", name: "Vector X  PVC Printed Yoga Mat" },
      { _id: "46", name: "Vector X Yoga mat, Exercise Yoga Mat" },
      {
        _id: "48",
        name: "Cello Swift Stainless Steel Vacuum Insulated Flask 1000ml | Hot and Cold",
      },
      {
        _id: "49",
        name: "Mikado Wrist Support,  Mikado wrist Wrap Ultima",
      },
      { _id: "50", name: "Impact Wood carrom coins" },
      { _id: "51", name: "Magic Wood carrom coins" },
      {
        _id: "52",
        name: "Champs Fighter sports knee cap , Knee Pain Knee Support , Gym knee cap",
      },
      {
        _id: "53",
        name: "Champs Fighter sports knee wrap , Knee Pain Knee Support , Gym knee wrap",
      },
      {
        _id: "54",
        name: "Iron Adjustable dumbbell , Iron dumbbell 2kg to 10kg",
      },
      {
        _id: "55",
        name: "Mikado Roller Skates, four wheeler skates, Mikado Skates",
      },
      { _id: "56", name: "Vector X Fittness Gloves Vx 300, Gym Gloves" },
      {
        _id: "57",
        name: "Techno Galaxy Heavy Men-Solid Chess Pieces, Chess Coin",
      },
      {
        _id: "58",
        name: "Champs Fighter Nexa knee Support , Knee Pain Knee Support , Gym knee cap",
      },
      {
        _id: "59",
        name: "Champs Fighter Nexa Gym Cotton Supporter, Sports Underwear",
      },
      { _id: "60", name: "Mikado apex crysta badminton racket" },
      { _id: "61", name: "Champs Fighter Nylon Elbow Support" },
      {
        _id: "62",
        name: "Black Panther Maxx Supporter Soft Stretch Spandex Belt, Sports Underwear",
      },
      { _id: "63", name: "Mikado skating protective set" },
      {
        _id: "64",
        name: "Outdoor Catching & Throwing Discs,Dog Training Disc, Flying Discs Game",
      },
      { _id: "65", name: "PVC Hand Gripper,  Hand Strength" },
      {
        _id: "66",
        name: "Ksports ankle socks multiple colour patterns socks, sport socks",
      },
      {
        _id: "67",
        name: "Suvarna Electro Lite Weighing Scale , Weight Machine For Body Weight",
      },
      {
        _id: "68",
        name: "Suvarna  Ele150 Weighing Scale, Weight Machine For Body Weight",
      },
      {
        _id: "69",
        name: "Vector X VXB-902 Aluminum Composite One Piece Joint Less Badminton Racket",
      },
      {
        _id: "70",
        name: "Protect Abdominal Guard for Cricket and Other Sports, L Guard",
      },
      { _id: "71", name: "Black panther Twin pack socks, Sports Socks" },
      {
        _id: "72",
        name: "Mamaearth Vitamin C Face Scrub for Glowing Skin, With Vitamin C",
      },
      {
        _id: "73",
        name: "Biotique Morning Nectar Flawless Skin Moisturizer l Prevents Dark spots",
      },
      {
        _id: "74",
        name: "VLCC Insta Glow Diamond Bleach | With Diamond Powder For Sparkling Fairness",
      },
      {
        _id: "75",
        name: "Cetaphil Brightness Reveal Creamy Face Wash for Uneven Skin Tone",
      },
      {
        _id: "76",
        name: "The Derma Co 1% Hyaluronic Sunscreen SPF 50 Aqua Gel for Oily and Dry Skin",
      },
      {
        _id: "77",
        name: "Jovees Herbal Sun Guard Lotion SPF 60 PA+++Broad Spectrum  3 in 1 Matte",
      },
      {
        _id: "78",
        name: "Ustraa Face & Stubble Lotion For Beard Softening, Dermatologically Tested",
      },
      {
        _id: "79",
        name: "Pond's Men Energy Bright Anti-Dullness Facewash With Coffee Bean",
      },
      {
        _id: "80",
        name: "Garnier Bright Complete Vitamin C Gel Face Wash , Instant Brighter Skin",
      },
    ];

    let nameKeys = [];
    let tOfPKeys = [];
    const findKeys = async (keyType) => {
      let data = false;
      const filterTofP = (data) => data.includes(key) || key.includes(data);

      const filterName = (data) => data.name.includes(key);
      // try {
      //   data = await client.lrange(keyType, 0, -1);
      // } catch (err) {}
      data = keyType == "tOfPKeys" ? tOfPData : nameData;

      // if (data) {
      //   dbConnect();
      //   const productData = await Products.find({}, { tOfP: 1, name: 1 });
      //   let tOfPS = productData.map((data) => data.tOfP);
      //   let names = productData.map((data) => {
      //     return { _id: data.id, name: data.name };
      //   });

      //   data = keyType == "tOfPKeys" ? tOfPS : names;
      //   try {
      //     await client.lpush("tOfPKeys", ...tOfPS, (err, reply) => {});
      //     await client.expire("tOfPKeys", 86400); //86400
      //     await client.lpush("nameKeys", ...names, (err, reply) => {});
      //     await client.expire("nameKeys", 86400); //86400
      //   } catch (err) {}
      // }

      return data
        .filter(keyType == "tOfPKeys" ? filterTofP : filterName)
        .slice(0, 200);
    };
    tOfPKeys = await findKeys("tOfPKeys");
    if (tOfPKeys.length < 10) {
      nameKeys = await findKeys("nameKeys");
    }

    return new Response(
      JSON.stringify({
        success: true,
        nameKeys,
        tOfPKeys,
        key,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 200,
      }
    );
  }
}
