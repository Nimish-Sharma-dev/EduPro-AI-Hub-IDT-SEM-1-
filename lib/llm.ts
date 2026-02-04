import OpenAI from 'openai';

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';

// Lazy initialization to avoid build-time failures
let _openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
    if (!_openai) {
        const apiKey = LLM_PROVIDER === 'openai'
            ? process.env.OPENAI_API_KEY
            : 'not-needed';

        if (LLM_PROVIDER === 'openai' && !apiKey) {
            throw new Error(
                'OPENAI_API_KEY environment variable is required when using OpenAI provider. ' +
                'Please set it in your Netlify environment variables or use LM Studio instead.'
            );
        }

        _openai = new OpenAI({
            apiKey,
            baseURL: LLM_PROVIDER === 'lmstudio'
                ? process.env.LM_STUDIO_URL
                : undefined,
        });
    }
    return _openai;
}

const MODEL = LLM_PROVIDER === 'openai'
    ? (process.env.OPENAI_MODEL || 'gpt-4-turbo-preview')
    : (process.env.LM_STUDIO_MODEL || 'local-model');

export async function generateCompletion(
    prompt: string,
    systemPrompt?: string,
    maxTokens: number = 2000
): Promise<string> {
    try {
        const openai = getOpenAIClient();
        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
        }

        messages.push({ role: 'user', content: prompt });

        const response = await openai.chat.completions.create({
            model: MODEL,
            messages,
            max_tokens: maxTokens,
            temperature: 0.7,
        });

        return response.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('LLM Error:', error);
        throw new Error('Failed to generate completion');
    }
}

export async function generateStreamCompletion(
    prompt: string,
    systemPrompt?: string
): Promise<ReadableStream> {
    try {
        const openai = getOpenAIClient();
        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
        }

        messages.push({ role: 'user', content: prompt });

        const stream = await openai.chat.completions.create({
            model: MODEL,
            messages,
            stream: true,
            temperature: 0.7,
        });

        const encoder = new TextEncoder();

        return new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });
    } catch (error) {
        console.error('LLM Stream Error:', error);
        throw new Error('Failed to generate stream completion');
    }
}
