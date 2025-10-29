const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Do not log secrets. Only log presence/absence for debugging.
if (process.env.GEMINI_API_KEY) {
  console.log('GEMINI_API_KEY is set');
} else {
  console.warn('GEMINI_API_KEY is NOT set');
}

/**
 * Send an image to the Gemini generative model for analysis.
 * @param {string} imagePath Absolute or relative path to the image file
 * @returns {Promise<{status: string, data?: any}>}
 */
exports.sendImageForPrediction = async (imagePath) => {
  try {
    // Validate API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Gemini API Key is missing');

    // Validate image path
    if (!imagePath || typeof imagePath !== 'string') {
      throw new Error('A valid image path must be provided');
    }

    const resolvedPath = path.resolve(imagePath);
    const stat = await fs.promises.stat(resolvedPath).catch(() => null);
    if (!stat || !stat.isFile()) {
      throw new Error(`Image file not found at path: ${resolvedPath}`);
    }

    const imageBuffer = await fs.promises.readFile(resolvedPath);
    const base64Image = imageBuffer.toString('base64');

    // Simple mime type detection from file extension (avoid new deps)
    const ext = path.extname(resolvedPath).toLowerCase();
    const mimeMap = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp'
    };
    const mimeType = mimeMap[ext] || 'application/octet-stream';

    // Instantiate client after validating key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // const prompt = `
    // תחזיר את התשובה בשפה העברית -
    //   סרוק את התמונה המצורפת ובצע את הפעולות הבאות:
    //   1. זיהוי אנשים ופציעות - קבע את מספר האנשים בתמונה, עבור כל אדם ציין אם הוא פצוע או לא.
    //   2. סיווג דרגות פציעה - עבור כל פצוע סווג את דרגת הפציעה (קלה, בינונית, חמורה).
    //   3. הערכת דחיפות הטיפול - עבור כל פצוע, קבע את רמת הדחיפות בטיפול נדרש.
    //   4. הנחיות לטיפול ראשוני, כולל - בדיקות הכרה, בדיקות נשימה, איתור פציעות ודימומים, עצירת דימומים, פעולות נוספות לפי צורך.
    //   הצג את המידע בצורה מסודרת וברורה עבור כל אדם בתמונה.
    // `;

 const prompt = `
אתה מודל ניתוח תמונה רפואית. נתח את התמונה ושלח תשובה בעברית בלבד במבנה JSON תקין לפי הסכמה:
{
  "סה\\"כ_אנשים": <number>,
  "סה\\"כ_פצועים": <number>,
  "אנשים": [
    {
      "אדם_מספר": <number>,
      "פצוע": true/false,
      "פציעות": [
        {
          "סוג": "דימום | כוויה | חתך | חבלה קהה | קטיעה/חסר גפה | שבר חשוד | חוסר הכרה/הכרה מעורפלת | אחר",
          "מיקום_בגוף": "ראש/צוואר/חזה/בטן/גב/יד ימין/יד שמאל/רגל ימין/רגל שמאל/פנים/אחר",
          "חומרה": "קל | בינוני | קשה",
          "ודאות_אחוז": <number 0-100>,
          "נימוק_קצר": "עד 20 מילים על מה רואים שמצדיק את האבחנה"
        }
      ]
    }
  ],
  "הערות_כלליות": "דגשים רלוונטיים (אם יש)"
}
החזר אך ורק JSON חוקי וללא טקסט נוסף.
`;


    console.log('Sending request to Gemini API...');

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: base64Image } }
          ]
        }
      ]
    });  

    // Helper: try to extract text from possible result shapes
    const extractText = (res) => {
      if (!res) return '';
      // Newer SDKs: result.output -> array of outputs
      if (Array.isArray(res.output) && res.output.length) {
        try {
          return res.output
            .map(o => (o.content || []).map(c => c.text || c.selections || '').join(''))
            .join('\n')
            .trim();
        } catch (e) {
          // fall through
        }
      }
      // Some SDKs provide response and .text() method
      try {
        if (typeof res.response?.text === 'function') return res.response.text();
      } catch (e) {
        // ignore
      }
      // Fallback to JSON string
      try { return JSON.stringify(res); } catch (e) { return String(res); }
    };

    const text = extractText(result);

    console.log('Gemini response received');

    return {
      status: 'success',
      data: {
        analysis: text
      }
    };

  } catch (error) {
    // Normalize error for logging
    const safeError = {
      message: error?.message || String(error),
      status: error?.status || null,
      errorDetails: error?.errorDetails || null
    };
    console.error('Detailed Gemini API Error:', safeError);

    // Try to detect invalid API key from common shapes
    const details = error?.errorDetails || error?.details || null;
    if (error?.status === 400 && Array.isArray(details)) {
      const apiError = details.find(d => d.reason === 'API_KEY_INVALID' || d.code === 'API_KEY_INVALID');
      if (apiError) {
        throw new Error('Invalid or Expired Gemini API Key. Please regenerate the key.');
      }
    }

    // Throw an Error so callers can handle consistently
    throw new Error(safeError.message || 'An unexpected error occurred while processing the image.');
  }
};
