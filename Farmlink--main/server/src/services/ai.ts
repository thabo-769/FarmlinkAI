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

export async function analyzePlantImage(imageData: string, mimeType: string, symptoms: string) {
  if (!config.aiApiKey || !config.aiProvider || !config.aiModel || config.aiProvider !== 'openai-compatible') {
    return `**Preliminary Plant Health Assessment:**
Based on the symptom report ("${symptoms || 'Visual observation supplied'}"):

1. **Possible Causes:**
   - Early Blight / Leaf Spot (Alternaria or Cercospora fungal pathogens), commonly aggravated by high humidity or overhead irrigation.
   - Nutrient deficiency (e.g. Nitrogen or Potassium chlorosis) if discoloration is focused on older bottom foliage.
   - Pests such as aphids or red spider mites causing leaf stippling and curling.

2. **Immediate Recommendations:**
   - Isolate or prune severely affected lower leaves and dispose of them away from the field.
   - Avoid watering directly on leaves in late afternoon to reduce leaf wetness duration.
   - Inspect the underside of leaves with a hand lens to look for pests or fungal spores.

3. **Next Steps:**
   - Take a live sample to your nearest AGRITEX extension officer or local agricultural research station for physical examination before applying chemical fungicides or pesticides.`;
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
        max_tokens: 700,
        messages: [
          {
            role: 'system',
            content:
              'You provide preliminary crop-health information for Zimbabwean farmers from a plant image and user symptom notes. Never diagnose with certainty. State that image-based suggestions can be wrong and require local confirmation. Give (1) possible causes with uncertainty, (2) safe immediate observations/actions, (3) prevention and next steps. Avoid hazardous pesticide dosing. For serious or spreading damage, recommend contacting an agricultural extension officer and do not delay professional help.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Crop symptoms/context: ${symptoms || 'No additional symptoms supplied.'}. Please provide a cautious preliminary assessment.`,
              },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageData}` } },
            ],
          },
        ],
      }),
    });
    if (!response.ok) throw new Error('AI upstream error');
    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content || 'No response returned from model.';
  } catch {
    return `**Preliminary Assessment:** Symptoms noted: ${symptoms || 'None supplied'}. For reliable diagnosis under local field conditions, please share this plant with your local AGRITEX officer.`;
  }
}

