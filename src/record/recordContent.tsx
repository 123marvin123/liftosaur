import { h, JSX } from "preact";
import "../models/state";
import { DateUtils } from "../utils/date";
import { IRecordResponse } from "../api/service";
import { Weight, IBarKey, IUnit } from "../models/weight";
import { ISet, Reps } from "../models/set";
import { ObjectUtils } from "../utils/object";
import { Exercise, IExerciseId } from "../models/exercise";
import { StringUtils } from "../utils/string";
import { IHistoryRecord, IHistoryEntry } from "../models/history";
import { CollectionUtils } from "../utils/collection";
import { Graph } from "../components/graph";
import { ISettings } from "../models/settings";
import { History } from "../models/history";

interface IProps {
  data: IRecordResponse;
}

export function RecordContent(props: IProps): JSX.Element {
  const { record } = props.data;
  return (
    <section className="px-4 text-gray-900">
      <div className="px-4">
        <h2 className="text-xl font-bold">
          {record.programName}, {record.dayName}
        </h2>
        <p className="text-sm text-gray-600">{DateUtils.format(record.date)}</p>
      </div>
      <PersonalRecords data={props.data} />
      <MaxWeights data={props.data} />
      <ul>
        {record.entries.map((entry) => (
          <li>
            <Entry recordId={record.id} entry={entry} history={props.data.history} settings={props.data.settings} />
          </li>
        ))}
      </ul>
    </section>
  );
}

interface IPersonalRecordsProps {
  data: IRecordResponse;
}

function PersonalRecords(props: IPersonalRecordsProps): JSX.Element | null {
  const { history, record } = props.data;
  const prs: Partial<Record<IExerciseId, Record<IBarKey | "none", ISet>>> = {};
  for (const entry of record.entries) {
    const set = History.findPersonalRecord(record.id, entry, history);
    if (set != null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prs[entry.exercise.id] = (prs[entry.exercise.id] || {}) as any;
      prs[entry.exercise.id]![entry.exercise.bar || "none"] = set;
    }
  }

  if (Object.keys(prs).length > 0) {
    return (
      <section className="p-4 my-6 bg-orange-100 border border-orange-800 rounded-lg">
        <h3 className="text-lg font-bold" dangerouslySetInnerHTML={{ __html: "&#x1F3C6 New Personal Records" }} />
        <ul>
          {ObjectUtils.keys(prs).map((exerciseId) => {
            return ObjectUtils.keys(prs[exerciseId]!).map((bar) => {
              const set = prs[exerciseId]![bar];
              const exercise = Exercise.get({ id: exerciseId, bar: bar === "none" ? undefined : bar });
              return (
                <li>
                  <strong>{exercise.name}</strong>: <SetView set={set} units={props.data.settings.units} />
                </li>
              );
            });
          })}
        </ul>
      </section>
    );
  } else {
    return null;
  }
}

interface IMaxWeightsProps {
  data: IRecordResponse;
}

function MaxWeights(props: IMaxWeightsProps): JSX.Element {
  return (
    <section className="px-4 my-6">
      <h3
        className="text-lg font-bold"
        dangerouslySetInnerHTML={{ __html: "&#x1F3CB Max lifted weights at the workout" }}
      />
      <ul>
        {props.data.record.entries.map((entry) => {
          const exercise = Exercise.get(entry.exercise);
          const set = CollectionUtils.sort(entry.sets, (a, b) => Weight.compare(b.weight, a.weight))[0];
          return (
            <li>
              <strong>{exercise.name}</strong>: <SetView set={set} units={props.data.settings.units} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

interface IEntryProps {
  history: IHistoryRecord[];
  recordId: number;
  entry: IHistoryEntry;
  settings: ISettings;
}

function Entry(props: IEntryProps): JSX.Element {
  const units = props.settings.units;
  const exercise = Exercise.get(props.entry.exercise);
  const prSet = History.findPersonalRecord(props.recordId, props.entry, props.history);
  const setGroups = Reps.group(props.entry.sets);

  const totalWeight = History.totalEntryWeight(props.entry);
  const totalReps = History.totalEntryReps(props.entry);

  return (
    <section className="p-4 my-2 bg-gray-100 border border-gray-600 rounded-lg">
      <h4 className="text-lg font-bold">{exercise.name}</h4>
      <div class="flex flex-col sm:flex-row">
        <div class="flex-1">
          {prSet != null && (
            <div className="my-2 text-lg">
              <strong>🏆 New Personal Record</strong>: <SetView set={prSet} units={units} />
            </div>
          )}
          <p>Completed sets x reps x weight</p>
          <ul>
            {setGroups.map((group) => {
              let line: string;
              if (group.length > 1) {
                line = `${group.length} x ${group[0].completedReps} x ${Weight.display(group[0].weight)}`;
              } else {
                line = `${group[0].completedReps} x ${Weight.display(group[0].weight)}`;
              }
              return <li>{line}</li>;
            })}
          </ul>
          <div className="mt-4">
            <p>
              <strong>Total Weight</strong>: {Weight.display(totalWeight)}
            </p>
            <p>
              <strong>Total reps</strong>: {totalReps}
            </p>
          </div>
        </div>
        <div className="record-graph">
          <Graph history={props.history} exercise={props.entry.exercise} settings={props.settings} />
        </div>
      </div>
    </section>
  );
}

interface ISetProps {
  set: ISet;
  units: IUnit;
}

function SetView({ set, units }: ISetProps): JSX.Element {
  return (
    <span className="whitespace-no-wrap">
      {set.completedReps || 0} {StringUtils.pluralize("rep", set.completedReps || 0)} x{" "}
      {Weight.display(Weight.convertTo(set.weight, units))}
    </span>
  );
}