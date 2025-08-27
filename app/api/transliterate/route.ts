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
    const { text, style, reverse = false, customInstructions } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'text is required' }, { status: 400, headers: corsHeaders });
    }
    const validStyles = Object.values(TransliterationStyle);
    if (!style || !validStyles.includes(style)) {
      return NextResponse.json({ error: `style must be one of: ${validStyles.join(', ')}` }, { status: 400, headers: corsHeaders });
    }

    const system = buildPrompt(style as TransliterationStyle, reverse, customInstructions);
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
    const transliteration = result.replace(/\*/g, '');

    return NextResponse.json({ transliteration }, { headers: corsHeaders });
  } catch (e: any) {
    console.error('Transliteration error:', e);
    const msg = e?.message?.includes('API key')
      ? 'AI API configuration error'
      : 'Failed to transliterate text';
    return NextResponse.json({ error: msg }, { status: 500, headers: corsHeaders });
  }
}
