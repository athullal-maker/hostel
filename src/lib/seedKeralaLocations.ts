import connectDB from "@/lib/mongodb";
import { State, District, City } from "@/models";

export const KERALA_DISTRICTS_DATA = [
  {
    name: "Ernakulam (Kochi)",
    slug: "ernakulam",
    cities: [
      { name: "Kakkanad (Infopark / SmartCity)", slug: "kakkanad" },
      { name: "Kalamassery (CUSAT / Medical College)", slug: "kalamassery" },
      { name: "Edappally (Metro & Transit Hub)", slug: "edappally" },
      { name: "Kaloor (JLN Stadium Metro)", slug: "kaloor" },
      { name: "Thrikkakara (Model Engg / Bharata Mata)", slug: "thrikkakara" },
      { name: "Palarivattom (Pipeline Jn)", slug: "palarivattom" },
      { name: "Vyttila (Mobility Hub)", slug: "vyttila" },
      { name: "MG Road / Ravipuram", slug: "mg-road-kochi" },
    ],
  },
  {
    name: "Thiruvananthapuram",
    slug: "thiruvananthapuram",
    cities: [
      { name: "Kazhakkoottam (Technopark Phase 1, 2, 3)", slug: "kazhakkoottam" },
      { name: "Kariavattom (Kerala University Campus)", slug: "kariavattom" },
      { name: "Sreekariyam (CET Campus)", slug: "sreekariyam" },
      { name: "Palayam / University College", slug: "palayam" },
      { name: "Medical College Jn / Ulloor", slug: "trivandrum-medical-college" },
      { name: "East Fort / Thampanoor", slug: "thampanoor" },
    ],
  },
  {
    name: "Kozhikode (Calicut)",
    slug: "kozhikode",
    cities: [
      { name: "Chathamangalam (NIT Calicut)", slug: "chathamangalam-nit" },
      { name: "Nellikkode (Cyberpark / Hilite City)", slug: "cyberpark-calicut" },
      { name: "Mavoor Road (Calicut City Hub)", slug: "mavoor-road" },
      { name: "Kunnamangalam (IIM Kozhikode)", slug: "kunnamangalam-iim" },
      { name: "Medical College Campus", slug: "calicut-medical-college" },
      { name: "Palayam / SM Street Area", slug: "kozhikode-palayam" },
    ],
  },
  {
    name: "Kottayam",
    slug: "kottayam",
    cities: [
      { name: "Gandhinagar (Govt Medical College)", slug: "gandhinagar-kottayam" },
      { name: "Pala (St. Thomas / Tuition Hub)", slug: "pala" },
      { name: "Kottayam Town (Collectorate / CMS College)", slug: "kottayam-town" },
      { name: "Changanassery (SB College)", slug: "changanassery" },
    ],
  },
  {
    name: "Thrissur",
    slug: "thrissur",
    cities: [
      { name: "Thrissur Town (Swaraj Round / Govt Engg College)", slug: "thrissur-town" },
      { name: "Mannuthy (Kerala Agricultural University)", slug: "mannuthy" },
      { name: "Ollur (Industrial & Academic Zone)", slug: "ollur" },
      { name: "Chalakudy", slug: "chalakudy" },
    ],
  },
  {
    name: "Malappuram",
    slug: "malappuram",
    cities: [
      { name: "Thenhipalam (Calicut University Main Campus)", slug: "thenhipalam" },
      { name: "Perinthalmanna (Medical Hub)", slug: "perinthalmanna" },
      { name: "Manjeri", slug: "manjeri" },
      { name: "Malappuram Town", slug: "malappuram-town" },
    ],
  },
  {
    name: "Palakkad",
    slug: "palakkad",
    cities: [
      { name: "Palakkad Town (Victoria College)", slug: "palakkad-town" },
      { name: "Kanjikode (IIT Palakkad / Industrial Area)", slug: "kanjikode-iit" },
      { name: "Ottapalam", slug: "ottapalam" },
    ],
  },
  {
    name: "Kannur",
    slug: "kannur",
    cities: [
      { name: "Kannur Town (SN College / Krishna Menon)", slug: "kannur-town" },
      { name: "Thalassery (Brennan College)", slug: "thalassery" },
      { name: "Payyanur", slug: "payyanur" },
    ],
  },
  {
    name: "Kollam",
    slug: "kollam",
    cities: [
      { name: "Chinnakada (Kollam City Hub)", slug: "chinnakada" },
      { name: "Asramam / TKM College", slug: "tkm-college-kollam" },
      { name: "Kottarakkara", slug: "kottarakkara" },
    ],
  },
  {
    name: "Alappuzha",
    slug: "alappuzha",
    cities: [
      { name: "Alappuzha Town (SD College)", slug: "alappuzha-town" },
      { name: "Cherthala (Infopark Cherthala)", slug: "cherthala" },
    ],
  },
  {
    name: "Pathanamthitta",
    slug: "pathanamthitta",
    cities: [
      { name: "Thiruvalla (Mar Athanasios / Medical)", slug: "thiruvalla" },
      { name: "Adoor (Central Travancore)", slug: "adoor" },
    ],
  },
  {
    name: "Idukki",
    slug: "idukki",
    cities: [
      { name: "Thodupuzha (Newman College / UCE)", slug: "thodupuzha" },
      { name: "Kattappana", slug: "kattappana" },
    ],
  },
  {
    name: "Wayanad",
    slug: "wayanad",
    cities: [
      { name: "Kalpetta (District HQ)", slug: "kalpetta" },
      { name: "Sulthan Bathery (St. Mary's)", slug: "sulthan-bathery" },
    ],
  },
  {
    name: "Kasaragod",
    slug: "kasaragod",
    cities: [
      { name: "Kasaragod Town (Central University)", slug: "kasaragod-town" },
      { name: "Kanhangad (Nehru College)", slug: "kanhangad" },
    ],
  },
];

export async function seedKeralaLocations() {
  await connectDB();

  // 1. Create or get State of Kerala
  let state = await State.findOne({ slug: "kerala" });
  if (!state) {
    state = await State.create({
      name: "Kerala",
      slug: "kerala",
    });
  }

  let totalDistricts = 0;
  let totalCities = 0;

  for (const distData of KERALA_DISTRICTS_DATA) {
    let district = await District.findOne({
      slug: distData.slug,
      stateId: state._id,
    });

    if (!district) {
      district = await District.create({
        name: distData.name,
        slug: distData.slug,
        stateId: state._id,
      });
      totalDistricts++;
    }

    for (const cityData of distData.cities) {
      const existingCity = await City.findOne({
        slug: cityData.slug,
        districtId: district._id,
      });

      if (!existingCity) {
        await City.create({
          name: cityData.name,
          slug: cityData.slug,
          districtId: district._id,
        });
        totalCities++;
      }
    }
  }

  return {
    state: state.name,
    districtsSeeded: totalDistricts,
    citiesSeeded: totalCities,
  };
}
