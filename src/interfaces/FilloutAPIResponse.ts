import { QuestionType } from './commons';

interface Question {
  id: string;
  name: string;
  type: QuestionType;
  value: string;
}

interface Calculation {
  id: string;
  name: string;
  type: string;
  value: string;
}

interface UrlParameter {
  id: string;
  name: string;
  value: string;
}

interface Quiz {
  score: number;
  maxScore: number;
}

interface Response {
  questions: Question[];
  calculations: Calculation[];
  urlParameters: UrlParameter[];
  quiz?: Quiz;
  submissionId: string;
  submissionTime: string;
}

export interface FilloutSuccessResponse {
  responses: Response[];
  totalResponses: number;
  pageCount: number;
}

export interface FilloutErrorResponse {
  statusCode: number;
  error: string;
  message: string;
}

export type SubmissionsResponse = FilloutSuccessResponse | FilloutErrorResponse;
