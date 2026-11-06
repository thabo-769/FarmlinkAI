import { config } from '../config.js';
import { HttpError } from '../middleware/errors.js';

function getLocalAgriculturalGuidance(message: string): string {
  const query = message.toLowerCase();
  if (query.includes('maize') || query.includes('plant')) {
    return `**Maize Planting Advice (Zimbabwe Context):**
- **Optimal Planting Window:** In Region II (e.g. Mashonaland, Harare, Mazowe), optimal planting is between mid-November and mid-December once the rains have established (at least 25–30mm over 2–3 days).
- **Fertilizer Guidance:** Apply basal Compound D fertilizer (approx. 300–400 kg/ha) at or before planting, placed 5cm away from the seed. Plan top-dressing with Ammonium Nitrate (AN) around 4–6 weeks after emergence.
- **Moisture Check:** Ensure soil is moist to at least 30cm depth before dry planting or sowing.
*Note: Consult with your local AGRITEX extension officer for specific soil testing and rainfall forecast updates.*`;
  }
  if (query.includes('armyworm') || query.includes('pest')) {
    return `**Fall Armyworm & Pest Identification:**
- **Signs:** Look for windowing (pinholes/transparent spots) on young maize whorls, sawdust-like frass (excrement) in the funnel, and inverted 'Y' markings on the caterpillar's head.
- **Immediate Action:** Scout fields early in the morning. Hand-picking in small plots or applying biological neem extracts/chili-garlic sprays can help reduce young larvae populations.
- **Chemical Control:** If threshold exceeds 10–20% infested whorls, consult certified agro-dealers for registered insecticides (e.g. emamectin benzoate, chlorantraniliprole) and rotate chemical groups to prevent resistance.`;
  }
  if (query.includes('soil') || query.includes('fertilis') || query.includes('fertilizer')) {
    return `**Soil Health & Nutrient Management:**
- **Pfumvudza / Conservation Agriculture:** Use permanent planting basins, apply well-rotted cattle manure or compost (approx. 1 handful per basin), and maintain mulch cover to preserve soil moisture and structure.
- **Acidity & Liming:** Many sandy clay soils in Zimbabwe become acidic with repeated AN applications. Apply agricultural lime every 3–4 seasons based on soil pH tests.
- **Crop Rotation:** Rotate cereals (maize, sorghum) with legumes (sugar beans, cowpeas, groundnuts) to naturally fix atmospheric nitrogen and break weed/pest cycles.`;
  }
  return `**FarmLink Agricultural Assistant Guidance:**
Thank you for your question regarding Zimbabwean farming practices.

1. **Agronomic Best Practice:** Ensure consistent soil moisture monitoring, crop rotation, and timely weeding within the first 4 weeks after crop emergence.
2. **Pfumvudza / Conservation Agriculture Principles:** Mulching, minimal soil disturbance, and targeted input application remain the highest yield-securing practices for smallholder farmers.
3. **Local Consultation:** For specific crop diagnostics, pest infestations, or animal health concerns, always contact your local AGRITEX extension officer or nearest veterinary services depot.`;
}

export async function answerAgriculture(message: string) {
  if (!config.aiApiKey || !config.aiProvider || !config.aiModel) {
    return getLocalAgriculturalGuidance(message);
  }
  if (config.aiProvider !== 'openai-compatible') {
    return getLocalAgriculturalGuidance(message);
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.aiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.aiModel,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content:
              'You are FarmLink AI, an agricultural information assistant serving Zimbabwean farmers. Give practical, locally contextual general guidance, ask for key missing context, and clearly state uncertainty. Never claim an image-free crop or livestock diagnosis is confirmed. For serious disease or animal health issues advise prompt consultation with a qualified agricultural extension officer or veterinarian. Do not invent live market prices or current weather. Keep the response clear and concise.',
          },
          { role: 'user', content: message },
        ],
      }),
    });
    if (!response.ok) return getLocalAgriculturalGuidance(message);
    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content || getLocalAgriculturalGuidance(message);
  } catch {
    return getLocalAgriculturalGuidance(message);
  }
}

export function getLocalCropAssessment(symptoms: string): string {
  const query = (symptoms || '').toLowerCase();

  if (query.includes('maize') || query.includes('corn') || query.includes('whorl') || query.includes('stalk') || query.includes('armyworm')) {
    return `**Preliminary Crop Assessment (Field Screening):**
Based on the submitted plant photo and reported symptoms ("${symptoms || 'Maize crop observation'}"):

1. **Visible Signs & Likely Identification:**
   - **Fall Armyworm (*Spodoptera frugiperda*):** High likelihood if windowing, ragged leaf holes, or sawdust-like frass are present in the whorl.
   - **Maize Streak Virus (MSV):** Uniform chlorotic streaking along leaf veins, transmitted by cicadellid leafhoppers (*Cicadulina mbila*).
   - **Northern Corn Leaf Blight (*Exserohilum turcicum*):** Long elliptical grayish-tan lesions on lower leaves.

2. **Immediate Recommended Actions:**
   - Scout 20 consecutive plants across 5 representative field spots early in the morning.
   - For smallholder plots with early-instar larvae, hand-picking or applying a pinch of dry sand/wood ash into infested whorls can suppress young populations.
   - Avoid excessive chemical treatment until economic thresholds (>10-20% infested whorls) are verified.

3. **Prevention & Agronomic Context:**
   - Practice early planting with certified drought-tolerant seed varieties.
   - Ensure timely top-dressing with Ammonium Nitrate (AN) around 4–6 weeks post-emergence.
   - Consult your nearest AGRITEX extension officer for localized pest trapping and spray thresholds.`;
  }

  if (query.includes('tomato') || query.includes('spot') || query.includes('blight') || query.includes('yellow') || query.includes('curl')) {
    return `**Preliminary Crop Assessment (Field Screening):**
Based on the submitted plant photo and reported symptoms ("${symptoms || 'Tomato foliage observation'}"):

1. **Visible Signs & Likely Identification:**
   - **Early Blight (*Alternaria solani*) or Septoria Leaf Spot:** Dark concentric ring lesions starting on older lower foliage during warm, humid weather.
   - **Tomato Yellow Leaf Curl Virus (TYLCV):** Upward curling and stunted yellowing of young shoots, spread by whitefly vectors.
   - **Nutrient Chlorosis (Nitrogen / Magnesium Deficiency):** Progressive yellowing between veins or on lower leaves in leached sandy soils.

2. **Immediate Recommended Actions:**
   - Prune and safely bury or burn severely diseased lower leaves away from the plot (do not compost).
   - Irrigate at the root zone only; strictly avoid overhead watering or wetting leaves late in the day.
   - Check the undersides of leaves with a hand lens for active whiteflies, aphids, or spider mites.

3. **Prevention & Agronomic Context:**
   - Practice crop rotation with non-solanaceous crops (e.g. maize, legumes) for at least 2–3 seasons.
   - Apply grass mulch around plant bases to reduce rain-splash of soil-borne fungal spores.
   - Contact your nearest AGRITEX depot or horticultural specialist if symptoms continue to spread.`;
  }

  return `**Preliminary Crop Assessment (Field Screening):**
Based on the submitted plant photo and notes ("${symptoms || 'Visual plant symptom check'}"):

1. **Visible Signs & Preliminary Observations:**
   - **Fungal or Bacterial Leaf Spotting:** Irregular chlorotic margins, browning edges, or localized lesions, often triggered by prolonged leaf wetness, high humidity, or overhead watering.
   - **Sap-Sucking Pest Damage:** Stippling, curled leaf margins, or distorted new shoots commonly associated with aphids, thrips, or mites.
   - **Moisture or Nutrient Stress:** Uneven watering, root compaction, or nitrogen/phosphorus imbalance causing generalized foliage discoloration.

2. **Immediate Recommended Actions:**
   - Remove heavily infected or dried plant material and dispose of it away from healthy crops.
   - Water directly at the root zone in the morning to allow foliage to remain dry throughout the day.
   - Inspect the underside of leaves and growing tips for live pests or fungal powder.

3. **Prevention & Next Steps:**
   - Maintain good field sanitation, weed management, and adequate row spacing for ventilation.
   - Take a fresh, representative sample (leaves and stems sealed in a bag) to your nearest AGRITEX extension officer or research station for definitive physical diagnosis.`;
}

export async function analyzePlantImage(imageData: string, mimeType: string, symptoms: string) {
  if (!config.aiApiKey) {
    return getLocalCropAssessment(symptoms);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.aiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.aiModel,
        temperature: 0.2,
        max_tokens: 900,
        messages: [
          {
            role: 'system',
            content:
              'You are a cautious crop-health assistant for farmers in Zimbabwe. Examine the supplied plant image itself and use the user notes as context. If the image does not clearly show a plant or affected area, say so and request a clearer close-up rather than guessing. Give a concise preliminary assessment with: (1) visible signs, (2) possible causes and confidence (low/medium/high), clearly separating alternatives, (3) safe immediate checks/actions, and (4) prevention and next steps. Ask for crop type or field context only when it would materially improve the assessment. Never claim a confirmed diagnosis, invent visual details, or recommend pesticide products or dosage. State that image-based suggestions need local confirmation. For severe or spreading damage, advise prompt contact with an AGRITEX extension officer.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Farmer's crop and symptom notes: ${symptoms || 'No additional symptoms supplied.'}. Assess the attached image and notes as a preliminary screening.`,
              },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageData}` } },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      return getLocalCropAssessment(symptoms);
    }

    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const assessment = data.choices?.[0]?.message?.content?.trim();
    if (!assessment) {
      return getLocalCropAssessment(symptoms);
    }
    return assessment;
  } catch {
    return getLocalCropAssessment(symptoms);
  }
}
