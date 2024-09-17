export async function GET(req) {
  // apply pages -/single-p?k
  const { searchParams } = new URL(req.url);
  let pinCode = +searchParams.get("pinCode");

  let location = {};
  const allData = [
    {
      _id: "Chhattisgarh",
      start: 490001,
      end: 497778,
      districts: [{ sPin: 492001, ePin: 493441, district: "Raipur" }],
    },
    {
      _id: "Odisha",
      start: 751001,
      end: 770076,
      districts: [{ sPin: 766001, ePin: 767019, district: "Bhawanipatna" }],
    },
  ];

  allData.forEach(({ _id: state, start, end, districts }) => {
    if (pinCode >= start && pinCode <= end)
      location = {
        state,
        ...districts.find(
          ({ sPin, ePin }) => pinCode >= sPin && pinCode <= ePin
        ),
      };
  });

  return new Response(JSON.stringify({ pinCode, ...location }), {
    status: 200,
  });
}
