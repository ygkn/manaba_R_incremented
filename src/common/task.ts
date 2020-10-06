import { browser } from 'webextension-polyfill-ts';

const taskListURLs = {
  query: 'https://ct.ritsumei.ac.jp/s/home_summary_query',
  survey: 'https://ct.ritsumei.ac.jp/s/home_summary_survey',
  report: 'https://ct.ritsumei.ac.jp/s/home_summary_report',
} as const;

export type TaskInfo = {
  url: string;
  courseUrl: string;
  title: string;
  course: string;
  due: string;
};

export type TaskType = keyof typeof taskListURLs;

export type TasksInfo = Record<TaskType, TaskInfo[]>;

const fetchTaskInfo = async (type: TaskType): Promise<TaskInfo[]> => {
  const result = await fetch(taskListURLs[type]);
  const htmlText = await result.text();

  const domparser = new DOMParser();
  const doc = domparser.parseFromString(htmlText, 'text/html');

  return Array.from(
    doc.querySelectorAll(
      '.querylist > li > a, .reportlist > li > a'
    ) as NodeListOf<HTMLAnchorElement>
  ).map((a) => {
    const taskPath = a.getAttribute('href')!;
    const coursePath = taskPath.replace(/_[a-z]+_[0-9]+/, '');

    return {
      url: `https://ct.ritsumei.ac.jp/ct/${taskPath}`,
      courseUrl: `https://ct.ritsumei.ac.jp/ct/${coursePath}`,
      title: a.querySelector('h3')!.innerText.replace(/\s+/g, ' '),
      course: (a.querySelector(
        '.info1'
      ) as HTMLParagraphElement)!.innerText.replace(/\s+/g, ' '),
      due: (a.querySelector(
        '.info2'
      ) as HTMLParagraphElement)!.innerText.replace('受付終了日時：', ''),
    };
  });
};

export const fetchTasksInfo = async (): Promise<TasksInfo> => {
  const fetching = ([
    'query',
    'survey',
    'report',
  ] as const).map(async (type) => [type, await fetchTaskInfo(type)]);

  return Object.fromEntries(await Promise.all(fetching));
};

export const saveTasks = async (
  tasksInfo: TasksInfo | undefined
): Promise<void> => {
  await browser.storage.local.set({ tasksInfo });
};
