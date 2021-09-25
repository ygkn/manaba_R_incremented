import dayjs from 'dayjs';
import { FunctionComponent } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import {
  fetchTasksInfo,
  saveTasks,
  TaskInfo,
  TasksInfo,
  TaskType,
} from '../taskInfo';

type TabKey = TaskType | 'all';

const tabNames = {
  all: 'すべて',
  query: '小テスト',
  survey: 'アンケート',
  report: 'レポート',
} as const;

const getRowStyle = (due: string): JSXInternal.CSSProperties | undefined => {
  const daysLeft = dayjs(due).diff(dayjs(), 'day');

  if (daysLeft < 1) {
    return {
      backgroundColor: ' hsl(7deg 86% 86%)',
      color: 'hsl(17deg 46% 33%)',
    };
  }
  if (daysLeft < 3) {
    return {
      backgroundColor: ' hsl(47deg 86% 86%)',
      color: 'hsl(74deg 46% 33%)',
    };
  }
  if (daysLeft < 7) {
    return {
      backgroundColor: ' hsl(87deg 86% 86%)',
      color: 'hsl(134deg 46% 33%)',
    };
  }

  return undefined;
};

const compare = <T, ValidT extends T>(
  a: T,
  b: T,
  compareFn: (a: ValidT, b: ValidT) => number,
  isValid: (x: T) => x is ValidT
): number => {
  // If `b` is invalid,`b` comes after
  // (regardless of whether `a` is valid or not)
  if (!isValid(b)) {
    return -1;
  }

  // If `a` is invalid,`a` comes after
  if (!isValid(a)) {
    return 1;
  }

  return compareFn(a, b);
};

const compareString = (a: string, b: string) =>
  b.trim().localeCompare(a.trim());

const getTasks = (tasks: TasksInfo, openedTab: TabKey) => {
  if (openedTab !== 'all') {
    return tasks[openedTab];
  }

  return Object.values(tasks)
    .flat()
    .sort(
      (a, b) =>
        compare<TaskInfo['due'], string>(
          a.due,
          b.due,
          (aDue, bDue) => dayjs(aDue).diff(bDue),
          (x): x is string => (x != null && dayjs(x).isValid) as boolean
        ) ||
        compare<TaskInfo['course'], string>(
          a.course,
          b.course,
          compareString,
          (x): x is string => x != null
        ) ||
        compare<TaskInfo['title'], string>(
          a.title,
          b.title,
          compareString,
          (x): x is string => x != null
        )
    );
};

export const TaskList: FunctionComponent = () => {
  const [openedTab, setOpenedTab] = useState<TabKey>('all');
  const [tasks, setTasks] = useState<TasksInfo | undefined>(undefined);
  const [showAll, setShowAll] = useState<boolean>(false);

  const toggleShowAll = useCallback(async () => {
    const newShowAll = !showAll;
    setShowAll(newShowAll);
    await chrome.storage.local.set({ taskListShowAll: newShowAll });
  }, [showAll]);

  useEffect(() => {
    chrome.storage.local
      .get('taskListShowAll')
      .then(({ taskListShowAll }) => setShowAll(taskListShowAll ?? false));

    fetchTasksInfo().then((tasksInfo) => {
      setTasks(tasksInfo);
      saveTasks(tasksInfo);
    });

    const callback: Parameters<typeof chrome.storage.onChanged.addListener>[0] =
      ({ tasksInfo }, areaName) => {
        console.log({ tasksInfo, areaName });
        if (areaName === 'local' && tasksInfo?.newValue != null) {
          setTasks(tasksInfo.newValue);
        }
      };

    chrome.storage.onChanged.addListener(callback);

    return () => {
      chrome.storage.onChanged.removeListener(callback);
    };
  }, []);

  const showingTasks = tasks && getTasks(tasks, openedTab);

  return (
    <div className="my-infolist my-infolist-coursenews">
      <div className="my-infolist-header">
        <h2>課題</h2>
      </div>
      <ul className="infolist-tab">
        {(['all', 'query', 'survey', 'report'] as const).map((taskType) => (
          <li
            className={taskType === openedTab ? 'current' : ''}
            key={taskType}
          >
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            <a onClick={() => setOpenedTab(taskType)}>{tabNames[taskType]}</a>
          </li>
        ))}
      </ul>
      <div className="my-infolist-body">
        <div className="groupthreadlist" style={{ minHeight: 156 }}>
          {showingTasks == null && (
            <p>
              {/* eslint-disable-next-line react/jsx-one-expression-per-line, jsx-a11y/accessible-emoji */}
              読み込み中です <span aria-hidden="false">&gt; 🐤</span>
            </p>
          )}
          {showingTasks != null && showingTasks.length === 0 && (
            <>
              <p>
                未提出の課題はありません！
                {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
                <span aria-hidden="false">&gt; 🐤</span>
              </p>
              <p>
                良い一日を！
                {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
                <span aria-hidden="false">&gt; 🐑</span>
              </p>
            </>
          )}
          {showingTasks != null && (
            <table>
              <tbody>
                {showingTasks.slice(0, showAll ? undefined : 5).map((task) => (
                  <tr
                    key={task.url}
                    style={task.due != null ? getRowStyle(task.due) : undefined}
                  >
                    <td
                      width="15%"
                      style={
                        task.due != null &&
                        dayjs(task.due).diff(dayjs(), 'day') < 7
                          ? { fontWeight: 'bold' }
                          : undefined
                      }
                      title={task.due ?? undefined}
                    >
                      {task.due && dayjs(task.due).fromNow()}
                    </td>
                    <th style={{ backgroundImage: 'none', padding: 0 }}>
                      <div
                        className="news-title newsentry"
                        style={{ width: 350 }}
                      >
                        <img
                          src="/icon-coursedeadline-on.png"
                          className="inline"
                          alt="未提出の課題"
                        />
                        <a
                          href={task.url ?? ''}
                          title={task.title ?? ''}
                          style={{ width: 'auto', display: 'inline' }}
                        >
                          {task.title}
                        </a>
                      </div>
                    </th>
                    <td>
                      <div
                        className="news-courseinfo"
                        title={task.course ?? undefined}
                        style={{
                          width: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {task.course && (
                          <a href={task.courseUrl ?? ''}>{task.course}</a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="showmore">
          <img
            src="/icon_mypage_showmore.png"
            alt=""
            className="inline"
            title=""
          />
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#" onClick={toggleShowAll}>
            {showAll ? '一部を表示' : 'すべて表示'}
          </a>
        </div>
      </div>
    </div>
  );
};
