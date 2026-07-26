import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { input } = await req.json();

  if (!input || typeof input !== 'string' || !input.trim()) {
    return NextResponse.json({ error: 'No input provided' }, { status: 400 });
  }

  let contentToAnalyze = input.trim();
  const isUrl = /^https?:\/\//i.test(contentToAnalyze);

  if (isUrl) {
    try {
      const pageRes = await fetch(contentToAnalyze, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const html = await pageRes.text();
      contentToAnalyze = stripHtml(html).slice(0, 15000);
    } catch {
      return NextResponse.json(
        { error: "Couldn't fetch that URL — try pasting the job description instead" },
        { status: 400 }
      );
    }
  }

  const systemPrompt = `You extract structured job posting information from text. Respond with ONLY valid JSON, no markdown formatting, no commentary — exactly this shape:
{
  "company": string,
  "position": string,
  "location": string | null,
  "salary": string | null,
  "tags": string[],
  "description": string
}

Rules:
- "description": a concise 1-3 sentence summary in your own words, not copied verbatim.
- "tags": 3-6 short skill/technology keywords (e.g. "React", "Remote", "Senior").
- If a field can't be determined, use null (or [] for tags).
- Output only the JSON object, nothing else.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: contentToAnalyze },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', errText);
      return NextResponse.json(
        { error: 'AI service error — try again' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json({ error: 'AI did not return a result' }, { status: 502 });
    }

    const parsed = JSON.parse(raw);

    return NextResponse.json({
      data: {
        ...parsed,
        jobUrl: isUrl ? input.trim() : '',
      },
    });
  } catch (err) {
    console.error('AI parse error:', err);
    return NextResponse.json(
      { error: 'Failed to parse job details — try pasting plain text instead' },
      { status: 500 }
    );
  }
}