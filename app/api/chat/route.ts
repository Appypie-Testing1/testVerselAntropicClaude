import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, type Message } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    // Check for attachments
    const messagesHavePDF = messages.some(message =>
      message.experimental_attachments?.some(
        a => a.contentType === 'application/pdf',
      ),
    );
    const messagesHaveImage = messages.some(message =>
      message.experimental_attachments?.some(
        a => a.contentType?.startsWith('image/'),
      ),
    );

    // Anthropic supports both images and PDFs. Use Anthropic if any image or PDF is present.
    const useAnthropic = messagesHavePDF || messagesHaveImage;

    const result = streamText({
      model: useAnthropic
        ? anthropic('claude-3-5-sonnet-20240620')
        : openai('gpt-4o'),
      messages,
    });

    return result.toDataStreamResponse();
  } catch (err: Error | unknown) {
    console.error('API /api/chat error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
