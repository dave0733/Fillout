import { Request } from 'express';
import MessageResponse from './MessageResponse';
import { OperationType } from './commons';

export type FilterClauseType = {
  id: string;
  condition: OperationType;
  value: number | string;
};

type RequestParams = {
  formId: string;
};
// FilterClauseType[]
type RequestQuery = {
  filters: string;
  limit: string;
  offset: string;
};

export type IRequest = Request<
RequestParams,
MessageResponse,
{},
RequestQuery
>;

export type FiltersHashType = {
  [id: string]: FilterClauseType;
};

