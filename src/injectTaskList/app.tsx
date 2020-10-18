import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { browser } from 'webextension-polyfill-ts';
import { fetchTasksInfo, saveTasks, TasksInfo, TaskType } from '../common/task';

type TabKey = TaskType | 'all';

const tabNames = {
  all: 'すべて',
  query: '小テスト',
  survey: 'アンケート',
  report: 'レポート',
} as const;

const TaskList: FC = () => {
  const [openedTab, setOpenedTab] = useState<TabKey>('all');
  const [tasks, setTasks] = useState<TasksInfo | undefined>(undefined);
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    fetchTasksInfo().then((tasksInfo) => {
      setTasks(tasksInfo);
      saveTasks(tasksInfo);
    });

    const callback: Parameters<
      typeof browser.storage.onChanged.addListener
    >[0] = ({ tasksInfo }, areaName) => {
      console.log({ tasksInfo, areaName });
      if (areaName === 'local' && tasksInfo?.newValue != null) {
        setTasks(tasksInfo.newValue);
      }
    };

    browser.storage.onChanged.addListener(callback);

    return () => {
      browser.storage.onChanged.removeListener(callback);
    };
  }, []);

  if (tasks === undefined) return <>loading...</>;

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
        <div className="groupthreadlist">
          <table>
            <tbody>
              {(openedTab === 'all'
                ? Object.values(tasks)
                    .flat()
                    .sort((a, b) => {
                      // If `b` is invalid,`b` comes after
                      // (regardless of whether `a` is valid or not)
                      if (b.due == null || !dayjs(b.due).isValid) {
                        return -1;
                      }

                      // If `a` is invalid,`a` comes after
                      if (a.due == null || !dayjs(a.due).isValid) {
                        return 1;
                      }

                      return dayjs(a.due).diff(b.due);
                    })
                : tasks[openedTab]
              )
                .slice(0, showAll ? undefined : 5)
                .map((task) => (
                  <tr key={task.url}>
                    <td width="15%">{task.due && dayjs(task.due).fromNow()}</td>
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
                        title="32956:英語上級 109(QX)"
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
        </div>
        <div className="showmore">
          <img
            src="/icon_mypage_showmore.png"
            alt=""
            className="inline"
            title=""
          />
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            // eslint-disable-next-line
            href="javascript:void(0)"
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? '一部を表示' : 'すべて表示'}
          </a>
        </div>
      </div>
    </div>
  );
};

export const app = <TaskList />;
