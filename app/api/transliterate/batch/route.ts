import { NextRequest, NextResponse } from 'next/server';
import { openai, modelName } from '@/lib/openai';
import { buildPrompt } from '@/lib/styles';
import { TransliterationStyle } from '@/types/transliteration';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { texts, style, reverse = false, customInstructions } = await req.json();

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({ error: 'texts[] is required' }, { status: 400, headers: corsHeaders });
    }
    const validStyles = Object.values(TransliterationStyle);
    if (!style || !validStyles.includes(style)) {
      return NextResponse.json({ error: `style must be one of: ${validStyles.join(', ')}` }, { status: 400, headers: corsHeaders });
    }

    const system = buildPrompt(style as TransliterationStyle, reverse, customInstructions);
    const results: { text: string; transliteration: string }[] = [];

    for (const text of texts) {
      if (!text || typeof text !== 'string') continue;

      const user = reverse ? `Romanized:\n${text}` : `${text}`;

      const completion = await openai.chat.completions.create({
        model: modelName,
        temperature: 0,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        max_completion_tokens: 2048,
        top_p: 1,
      });

      const result = completion.choices?.[0]?.message?.content?.trim() ?? '';
      results.push({ text, transliteration: result.replace(/\*/g, '') });
    }

    return NextResponse.json({ results }, { headers: corsHeaders });
  } catch (e: any) {
    console.error('Batch transliteration error:', e);
    return NextResponse.json({ error: 'Batch failed' }, { status: 500, headers: corsHeaders });
  }
}
