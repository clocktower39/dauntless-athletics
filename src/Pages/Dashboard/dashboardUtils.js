import { ratingOptions } from "./surveyConfig";

export const ratingLabelMap = ratingOptions.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

export const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
};
