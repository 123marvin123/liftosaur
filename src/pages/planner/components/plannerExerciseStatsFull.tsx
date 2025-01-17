import { h, JSX, Fragment } from "preact";
import { Exercise } from "../../../models/exercise";
import { Weight } from "../../../models/weight";
import { ISettings } from "../../../types";
import { IPlannerProgramExercise } from "../models/types";
import { IPlannerEvalResult } from "../plannerExerciseEvaluator";
import { PlannerGraph } from "../plannerGraph";

interface IPlannerExerciseStatsFullProps {
  settings: ISettings;
  evaluatedWeeks: IPlannerEvalResult[][];
  weekIndex: number;
  dayIndex: number;
  exerciseLine: number;
}

export function PlannerExerciseStatsFull(props: IPlannerExerciseStatsFullProps): JSX.Element {
  const evaluatedWeek = props.evaluatedWeeks[props.weekIndex];
  const evaluatedDay = evaluatedWeek[props.dayIndex];

  if (!evaluatedDay.success) {
    return <></>;
  }

  const evaluatedExercise = evaluatedDay.data.find((e) => e.line === props.exerciseLine);
  if (!evaluatedExercise) {
    return <></>;
  }

  const customExercises = props.settings.exercises;
  let exercise = Exercise.findByName(evaluatedExercise.name, customExercises);
  if (!exercise) {
    return <></>;
  }
  exercise = Exercise.find({ id: exercise.id, equipment: evaluatedExercise.equipment }, customExercises);
  if (!exercise) {
    return <></>;
  }

  const intensityGraphData = getIntensityPerWeeks(props.evaluatedWeeks, props.dayIndex, exercise.name);
  const volumeGraphData = getVolumePerWeeks(props.evaluatedWeeks, props.dayIndex, exercise.name);
  const intensityKey = JSON.stringify(intensityGraphData);
  const volumeKey = JSON.stringify(volumeGraphData);

  return (
    <div className="py-1 bg-white shadow-xs" style={{ borderRadius: "8px 8px 0 0" }}>
      <div className="flex mb-2">
        {intensityGraphData[0].length > 1 && (
          <div className="flex-1" style={{ marginTop: "-14px" }}>
            <PlannerGraph
              key={intensityKey}
              title="Intensity w/w"
              color="red"
              height="8rem"
              yAxisLabel="Intensity"
              data={intensityGraphData}
            />
          </div>
        )}
        {volumeGraphData[0].length > 1 && (
          <div className="flex-1" style={{ marginTop: "-14px" }}>
            <PlannerGraph
              key={volumeKey}
              title="Volume w/w"
              color="orange"
              height="8rem"
              yAxisLabel="Volume"
              data={volumeGraphData}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function getIntensityPerWeeks(
  evaluatedWeeks: IPlannerEvalResult[][],
  dayIndex: number,
  exerciseName: string
): [number[], number[]] {
  const data: [number[], number[]] = [[], []];
  for (let weekIndex = 0; weekIndex < evaluatedWeeks.length; weekIndex++) {
    const evaluatedWeek = evaluatedWeeks[weekIndex];
    let exercise: IPlannerProgramExercise | undefined;
    const evaluatedDay = evaluatedWeek[dayIndex] as IPlannerEvalResult | undefined;
    if (evaluatedDay?.success) {
      exercise = evaluatedDay.data.find((e) => e.name === exerciseName);
    }
    if (!exercise) {
      continue;
    }
    const weights = exercise.sets.map((s) => {
      const weight = s.percentage
        ? s.percentage * 100
        : Weight.rpeMultiplier(s.repRange?.maxrep ?? 1, s.rpe ?? 10) * 100;
      return Number(weight.toFixed(2));
    });
    data[0].push(weekIndex + 1);
    data[1].push(Math.max(...weights));
  }
  return data;
}

function getVolumePerWeeks(
  evaluatedWeeks: IPlannerEvalResult[][],
  dayIndex: number,
  exerciseName: string
): [number[], number[]] {
  const data: [number[], number[]] = [[], []];
  for (let weekIndex = 0; weekIndex < evaluatedWeeks.length; weekIndex++) {
    const evaluatedWeek = evaluatedWeeks[weekIndex];
    let exercise: IPlannerProgramExercise | undefined;
    const evaluatedDay = evaluatedWeek[dayIndex] as IPlannerEvalResult | undefined;
    if (evaluatedDay?.success) {
      exercise = evaluatedDay.data.find((e) => e.name === exerciseName);
    }
    if (!exercise) {
      continue;
    }
    const volume = Number(
      exercise.sets
        .reduce((acc, s) => {
          if (!s.repRange) {
            return acc;
          }
          const reps = s.repRange.maxrep;
          const weight = s.percentage ? s.percentage * 100 : Weight.rpeMultiplier(reps, s.rpe ?? 10) * 100;
          return acc + s.repRange.numberOfSets * weight * reps;
        }, 0)
        .toFixed(2)
    );
    data[0].push(weekIndex + 1);
    data[1].push(volume);
  }
  return data;
}
