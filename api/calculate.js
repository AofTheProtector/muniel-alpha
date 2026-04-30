const { Origin, Horoscope } = require('circular-natal-horoscope-js');

// Approximate coordinates for 77 Thai provinces
const PROVINCES = {
  "กรุงเทพมหานคร": { lat: 13.7563, lng: 100.5018 },
  "กระบี่": { lat: 8.0863, lng: 98.9063 },
  "กาญจนบุรี": { lat: 14.0041, lng: 99.5483 },
  "กาฬสินธุ์": { lat: 16.4333, lng: 103.5000 },
  "กำแพงเพชร": { lat: 16.4828, lng: 99.5227 },
  "ขอนแก่น": { lat: 16.4322, lng: 102.8236 },
  "จันทบุรี": { lat: 12.6114, lng: 102.1039 },
  "ฉะเชิงเทรา": { lat: 13.6904, lng: 101.0719 },
  "ชลบุรี": { lat: 13.3611, lng: 100.9847 },
  "ชัยนาท": { lat: 15.1852, lng: 100.1251 },
  "ชัยภูมิ": { lat: 15.8063, lng: 102.0315 },
  "ชุมพร": { lat: 10.4930, lng: 99.1800 },
  "เชียงราย": { lat: 19.9105, lng: 99.8406 },
  "เชียงใหม่": { lat: 18.7883, lng: 98.9853 },
  "ตรัง": { lat: 7.5563, lng: 99.6114 },
  "ตราด": { lat: 12.2428, lng: 102.5175 },
  "ตาก": { lat: 16.8840, lng: 99.1258 },
  "นครนายก": { lat: 14.2069, lng: 101.2131 },
  "นครปฐม": { lat: 13.8199, lng: 100.0443 },
  "นครพนม": { lat: 17.3920, lng: 104.7695 },
  "นครราชสีมา": { lat: 14.9707, lng: 102.1003 },
  "นครศรีธรรมราช": { lat: 8.4333, lng: 99.9667 },
  "นครสวรรค์": { lat: 15.6987, lng: 100.1156 },
  "นนทบุรี": { lat: 13.8591, lng: 100.5217 },
  "นราธิวาส": { lat: 6.4255, lng: 101.8253 },
  "น่าน": { lat: 18.7756, lng: 100.7730 },
  "บึงกาฬ": { lat: 18.3605, lng: 103.6464 },
  "บุรีรัมย์": { lat: 14.9930, lng: 103.1029 },
  "ปทุมธานี": { lat: 14.0208, lng: 100.5250 },
  "ประจวบคีรีขันธ์": { lat: 11.8105, lng: 99.7975 },
  "ปราจีนบุรี": { lat: 14.0510, lng: 101.3725 },
  "ปัตตานี": { lat: 6.8673, lng: 101.2501 },
  "พระนครศรีอยุธยา": { lat: 14.3532, lng: 100.5690 },
  "พังงา": { lat: 8.4501, lng: 98.5283 },
  "พัทลุง": { lat: 7.6167, lng: 100.0833 },
  "พิจิตร": { lat: 16.4426, lng: 100.3488 },
  "พิษณุโลก": { lat: 16.8211, lng: 100.2659 },
  "เพชรบุรี": { lat: 13.1111, lng: 99.9392 },
  "เพชรบูรณ์": { lat: 16.4190, lng: 101.1544 },
  "แพร่": { lat: 18.1446, lng: 100.1403 },
  "พะเยา": { lat: 19.1666, lng: 99.9022 },
  "ภูเก็ต": { lat: 7.8804, lng: 98.3923 },
  "มหาสารคาม": { lat: 16.1856, lng: 103.3007 },
  "มุกดาหาร": { lat: 16.5435, lng: 104.5262 },
  "แม่ฮ่องสอน": { lat: 19.3003, lng: 97.9654 },
  "ยะลา": { lat: 6.5411, lng: 101.2804 },
  "ยโสธร": { lat: 15.7926, lng: 104.1486 },
  "ร้อยเอ็ด": { lat: 16.0538, lng: 103.6520 },
  "ระนอง": { lat: 9.9658, lng: 98.6348 },
  "ระยอง": { lat: 12.6814, lng: 101.2816 },
  "ราชบุรี": { lat: 13.5283, lng: 99.8150 },
  "ลพบุรี": { lat: 14.7995, lng: 100.6534 },
  "ลำปาง": { lat: 18.2888, lng: 99.4930 },
  "ลำพูน": { lat: 18.5745, lng: 99.0087 },
  "เลย": { lat: 17.4860, lng: 101.7223 },
  "ศรีสะเกษ": { lat: 15.1186, lng: 104.3220 },
  "สกลนคร": { lat: 17.1664, lng: 104.1486 },
  "สงขลา": { lat: 7.1898, lng: 100.5954 },
  "สตูล": { lat: 6.6238, lng: 100.0674 },
  "สมุทรปราการ": { lat: 13.5993, lng: 100.5968 },
  "สมุทรสงคราม": { lat: 13.4098, lng: 100.0023 },
  "สมุทรสาคร": { lat: 13.5475, lng: 100.2736 },
  "สระแก้ว": { lat: 13.8240, lng: 102.0646 },
  "สระบุรี": { lat: 14.5289, lng: 100.9101 },
  "สิงห์บุรี": { lat: 14.8936, lng: 100.3967 },
  "สุโขทัย": { lat: 17.0055, lng: 99.8262 },
  "สุพรรณบุรี": { lat: 14.4742, lng: 100.1222 },
  "สุราษฎร์ธานี": { lat: 9.1333, lng: 99.3167 },
  "สุรินทร์": { lat: 14.8818, lng: 103.4936 },
  "หนองคาย": { lat: 17.8783, lng: 102.7413 },
  "หนองบัวลำภู": { lat: 17.2045, lng: 102.4407 },
  "อ่างทอง": { lat: 14.5896, lng: 100.4550 },
  "อำนาจเจริญ": { lat: 15.8653, lng: 104.6258 },
  "อุดรธานี": { lat: 17.4138, lng: 102.7872 },
  "อุตรดิตถ์": { lat: 17.6201, lng: 100.0993 },
  "อุทัยธานี": { lat: 15.3835, lng: 100.0246 },
  "อุบลราชธานี": { lat: 15.2287, lng: 104.8564 }
};

// Map time string from dropdown to hour and minute
function parseTime(timeStr) {
  // e.g. "06:00–08:00 (เช้าตรู่)" -> we take the middle, e.g. 07:00
  // or "ไม่ทราบเวลาเกิด" -> default to 12:00 (noon)
  if (!timeStr || timeStr === "ไม่ทราบเวลาเกิด") return { h: 12, m: 0 };
  
  const match = timeStr.match(/(\d{2}):(\d{2})/);
  if (match) {
    // Just using the start time of the range + 1 hour as an approximation
    let h = parseInt(match[1], 10) + 1;
    if (h === 25) h = 0; // Edge case
    return { h: h, m: 0 };
  }
  return { h: 12, m: 0 };
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { dob, tob, province } = req.body;

    if (!dob) {
      return res.status(400).json({ error: 'Date of birth is required' });
    }

    // Default to Bangkok if province not found
    const coords = PROVINCES[province] || PROVINCES["กรุงเทพมหานคร"];
    
    // Parse DOB (YYYY-MM-DD)
    const [year, month, day] = dob.split('-').map(Number);
    const { h, m } = parseTime(tob);

    // circular-natal-horoscope-js expects local time and coordinates.
    // Thailand is UTC+7, but Origin class handles local time via coordinates if we pass it correctly.
    // Wait, let's just pass UTC time to be safe? 
    // The doc says: "The year, month, date, hour, and minute properties are expected to be in local time for the latitude and longitude provided."
    const origin = new Origin({
      year: year,
      month: month - 1, // 0-indexed month
      date: day,
      hour: h,
      minute: m,
      latitude: coords.lat,
      longitude: coords.lng
    });

    const horoscope = new Horoscope({
      origin: origin,
      houseSystem: "placidus",
      zodiac: "tropical",
      aspectPoints: ['bodies', 'points', 'angles'],
      aspectWithPoints: ['bodies', 'points', 'angles'],
      customOrbs: {},
      language: 'en'
    });

    const sunSign = horoscope.CelestialBodies.sun.Sign.label;
    const moonSign = horoscope.CelestialBodies.moon.Sign.label;
    const risingSign = horoscope.Ascendant.Sign.label;

    return res.status(200).json({
      sun_sign: sunSign,
      moon_sign: moonSign,
      rising_sign: risingSign
    });

  } catch (error) {
    console.error('Calculation Error:', error);
    return res.status(500).json({ error: 'Failed to calculate ephemeris' });
  }
};
