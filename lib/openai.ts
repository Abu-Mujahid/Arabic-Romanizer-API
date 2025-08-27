/// <reference types="node" />
import { AzureOpenAI, OpenAI } from 'openai';

export const openai = (() => {
  const hasAzure = !!process.env.AZURE_SECRET_KEY && !!process.env.AZURE_ENDPOINT_URL;
  if (hasAzure) {
    return new AzureOpenAI({
      apiKey: process.env.AZURE_SECRET_KEY!,
      endpoint: process.env.AZURE_ENDPOINT_URL!,
      apiVersion: process.env.AZURE_API_VERSION || '2024-06-01',
    });
  }
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY or Azure OpenAI credentials');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
})();

export const modelName =
  process.env.AZURE_4_1_DEPLOYMENT || process.env.OPENAI_MODEL || 'gpt-4o-mini';
