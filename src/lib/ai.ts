import { requests } from '@/data/requests';
import type { ServiceRequest } from '@/data/requests';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const terms = (value: string) => Array.from(new Set(normalize(value).split(' ').filter(Boolean)));

const scoreRequest = (request: ServiceRequest, queryTerms: string[]) => {
  const combined = [
    request.title,
    request.shortDescription,
    request.category,
    request.section,
    request.subSection ?? '',
    request.environment ?? '',
    ...(request.keywords ?? []),
  ]
    .join(' ')
    .toLowerCase();

  return queryTerms.reduce((score, term) => {
    if (!term) return score;
    if (combined.includes(term)) {
      return score + 1;
    }
    return score;
  }, 0);
};

export async function getAIResponse(messages: Message[]): Promise<string> {
  const lastUser = [...messages].reverse().find((message) => message.role === 'user');
  if (!lastUser?.content) {
    return 'Please tell me what you need help with, such as the service type or environment.';
  }

  const query = normalize(lastUser.content);
  if (!query) {
    return 'Please enter your request in a few words so I can help.';
  }

  const queryTerms = terms(query);
  const scored = requests
    .map((request) => ({ request, score: scoreRequest(request, queryTerms) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.request.title.localeCompare(b.request.title));

  if (scored.length === 0) {
    return 'I could not find a matching request. Can you tell me if you need a new service, a modification, access, or publishing support?';
  }

  const topMatches = scored.slice(0, 3);
  const lines = topMatches.map(({ request }, index) =>
    `${index + 1}. ${request.title} (${request.category})\n   ID: ${request.id}\n   ${request.shortDescription}${request.environment ? `\n   Environment: ${request.environment}` : ''}`
  );

  return `Based on your description, these requests are likely the best fit:\n\n${lines.join('\n\n')}\n\nIf none are perfect, give me more detail and I can refine the recommendation.`;
}
