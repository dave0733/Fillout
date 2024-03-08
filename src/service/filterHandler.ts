import { OperationType, QuestionType } from '../interfaces/commons';

const stringOperations = {
  equals: (a: string, b: string) => a === b,
  does_not_equal: (a: string, b: string) => a !== b,
};

const numberOperations = {
  equals: (a: number, b: number) => a === b,
  does_not_equal: (a: number, b: number) => a !== b,
  greater_than: (a: number, b: number) => a > b,
  less_than: (a: number, b: number) => a < b,
};

const dateOperations = {
  equals: (a: number, b: number) =>
    new Date(a).getTime() === new Date(b).getTime(),
  does_not_equal: (a: number, b: number) =>
    new Date(a).getTime() !== new Date(b).getTime(),
  greater_than: (a: number, b: number) => new Date(a) > new Date(b),
  less_than: (a: number, b: number) => new Date(a) < new Date(b),
};

const typesToOperations = {
  Address: stringOperations,
  DatePicker: dateOperations,
  EmailInput: stringOperations,
  LongAnswer: stringOperations,
  NumberInput: numberOperations,
  Password: stringOperations,
  ShortAnswer: stringOperations,
};

export const evaluate = (
  questionType: QuestionType,
  operation: OperationType,
  value: string | number,
  targetValue: string | number,
) => {
  if (
    typesToOperations.hasOwnProperty(questionType) &&
    typesToOperations[questionType].hasOwnProperty(operation)
  ) {
    // @ts-ignore
    return typesToOperations[questionType][operation](value, targetValue);
  } else {
    return false;
  }
};
