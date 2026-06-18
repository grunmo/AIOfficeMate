export interface FileItem {
  path: string;
  name: string;
  isDir: boolean;
  size: number;
  mtime: string;
  ext?: string;
}

export interface AiSuggestion {
  file: string;
  suggestedName: string;
  suggestedCategory: string;
  confidence: number;
  reason: string;
}

export interface KnowledgeSpace {
  id: string;
  name: string;
  description: string;
  docCount: number;
  createdAt: string;
}

export interface KnowledgeDocument {
  id: string;
  spaceId: string;
  title: string;
  filePath: string;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

export interface Settings {
  workDir: string;
  llmProvider: string;
  llmModel: string;
  llmApiKey: string;
  llmBaseUrl: string;
  namingTemplate: string;
  theme: 'light' | 'dark';
}

export interface EnhanceRequest {
  file: string;
  contrast?: number;
  brightness?: number;
  angle?: number;
}

export interface EnhanceResponse {
  success: boolean;
  outputFile: string;
}

export interface AiAnalyzeRequest {
  files: string[];
}

export interface AiAnalyzeResponse {
  suggestions: AiSuggestion[];
}

export interface TreeNode {
  name: string;
  path: string;
  isDir: boolean;
  children?: TreeNode[];
}
