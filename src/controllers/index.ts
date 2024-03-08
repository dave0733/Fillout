import express from 'express';
import axios from 'axios';

import {
  FilterClauseType,
  FiltersHashType,
  IRequest,
} from '../interfaces/IRequest';
import { evaluate } from '../service/filterHandler';
import {
  FilloutErrorResponse,
  SubmissionsResponse,
  FilloutSuccessResponse,
} from '../interfaces/FilloutAPIResponse';


export const FilterController = async (
  req: IRequest,
  res: express.Response,
) => {
  const formId = req.params.formId;
  let filters: FilterClauseType[];

  try {
    filters = req.query.filters ? JSON.parse(req.query.filters) : [];
  } catch {
    return res
      .json({
        statusCode: 400,
        error: 'Bad request',
        message: 'Unable to parse filters JSON.',
      })
      .status(400);
  }

  let filtersHash: FiltersHashType = {};
  filters.forEach((filter) => {
    filtersHash[filter.id] = filter;
  });
  const q = new URLSearchParams(req.query);
  q.delete('filters');
  q.delete('limit');
  q.delete('offset');

  let limit = 150,
    offset = 0;
  let totalOriginalResponses: number;
  try {
    let filteredSubmissions;

    do {
      q.set('limit', limit.toString());
      q.set('offset', offset.toString());
      const response = await axios.get<SubmissionsResponse>(
        `https://api.fillout.com/v1/api/forms/${formId}/submissions?${q.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FILLOUT_API_KEY}`,
          },
        },
      );

      const body = response.data;

      if (response.status === 200) {
        filteredSubmissions = (body as FilloutSuccessResponse).responses;
        filteredSubmissions = filteredSubmissions.filter((submission) => {
          return submission.questions.every((question) => {
            if (filtersHash.hasOwnProperty(question.id)) {
              return evaluate(
                question.type,
                filtersHash[question.id].condition,
                question.value,
                filtersHash[question.id].value,
              );
            }
            return true;
          });
        });

        totalOriginalResponses = (body as FilloutSuccessResponse).totalResponses;
        if (totalOriginalResponses <= limit + offset) {
          break;
        } else {
          offset += limit;
        }
      } else {
        return res
          .json({
            statusCode: 424,
            error: (body as FilloutErrorResponse).error || 'Error Processing Request',
            message:
              (body as FilloutErrorResponse).message ||
              'Unknown error, please check in later.',
          })
          .status(424);
      }
    } while (true);

    const originalOffset = +req.query.offset || 0;
    const originalLimit = +req.query.limit || 150;
    const totalPages = Math.ceil(filteredSubmissions.length / originalLimit);
    return res
      .json({
        responses: filteredSubmissions.slice(
          originalOffset,
          originalOffset + originalLimit,
        ),
        totalResponses: filteredSubmissions.length,
        pageCount: totalPages,
      })
      .status(200);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const body = e.response?.data;
      return res
        .json({
          statusCode: 424,
          error: (body as FilloutErrorResponse).error || 'Error Processing Request',
          message:
            (body as FilloutErrorResponse).message ||
            'Unknown error, please check in later.',
        })
        .status(424);
    } else {
      return res
        .json({
          statusCode: 500,
          error: 'Error Processing Request',
          message: 'Unknown error, please check in later.',
        })
        .status(500);
    }
  }
};
