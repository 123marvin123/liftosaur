import { tags as t } from "@lezer/highlight";

// eslint-disable-next-line no-shadow
export enum PlannerNodeName {
  Program = "Program",
  LineComment = "LineComment",
  TripleLineComment = "TripleLineComment",
  Week = "Week",
  Day = "Day",
  ExerciseExpression = "ExerciseExpression",
  ExerciseName = "ExerciseName",
  NonSeparator = "NonSeparator",
  SectionSeparator = "SectionSeparator",
  ExerciseSection = "ExerciseSection",
  ReuseSection = "ReuseSection",
  ExerciseProperty = "ExerciseProperty",
  ExercisePropertyName = "ExercisePropertyName",
  Keyword = "Keyword",
  FunctionExpression = "FunctionExpression",
  FunctionName = "FunctionName",
  FunctionArgument = "FunctionArgument",
  Rep = "Rep",
  Int = "Int",
  Weight = "Weight",
  Number = "Number",
  Float = "Float",
  Percentage = "Percentage",
  Rpe = "Rpe",
  RepRange = "RepRange",
  KeyValue = "KeyValue",
  SetLabel = "SetLabel",
  Liftoscript = "Liftoscript",
  ReuseLiftoscript = "ReuseLiftoscript",
  WarmupExerciseSets = "WarmupExerciseSets",
  WarmupExerciseSet = "WarmupExerciseSet",
  WarmupSetPart = "WarmupSetPart",
  None = "None",
  ExerciseSets = "ExerciseSets",
  CurrentVariation = "CurrentVariation",
  ExerciseSet = "ExerciseSet",
  Timer = "Timer",
  SetPart = "SetPart",
  EmptyExpression = "EmptyExpression",
}

export const plannerExerciseStyles = {
  [`${[PlannerNodeName.SetPart]}/...`]: t.atom,
  [`${[PlannerNodeName.WarmupSetPart]}/...`]: t.atom,
  [`${[PlannerNodeName.Rpe]}/...`]: t.number,
  [`${[PlannerNodeName.Timer]}/...`]: t.keyword,
  [`${[PlannerNodeName.Weight]}/...`]: t.number,
  [`${[PlannerNodeName.Percentage]}/...`]: t.number,
  [PlannerNodeName.LineComment]: t.lineComment,
  [PlannerNodeName.TripleLineComment]: t.blockComment,
  [PlannerNodeName.SectionSeparator]: t.lineComment,
  [`${[PlannerNodeName.ExercisePropertyName]}/...`]: t.keyword,
  [`${[PlannerNodeName.FunctionName]}/...`]: t.attributeName,
  [`${[PlannerNodeName.FunctionArgument]}/...`]: t.attributeValue,
  [PlannerNodeName.None]: t.atom,
  [PlannerNodeName.Week]: t.annotation,
  [PlannerNodeName.Day]: t.docComment,
};
