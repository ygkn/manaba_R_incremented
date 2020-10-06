import dayjs from 'dayjs';
import { browser } from 'webextension-polyfill-ts';
import { fetchTasksInfo, saveTasks } from '../common/task';

const lookUp = async () => {
  const tasksInfo = await fetchTasksInfo().catch(() => undefined);

  saveTasks(tasksInfo);

  if (tasksInfo === undefined) {
    browser.browserAction.setBadgeText({ text: '!' });
  } else {
    const recentTasksCount = Object.values(tasksInfo)
      .flat()
      .filter(({ due }) => dayjs(due).diff(dayjs(), 'day') < 7).length;

    browser.browserAction.setBadgeText({
      text: recentTasksCount.toString(),
    });
  }
};

browser.runtime.onInstalled.addListener(() => {
  browser.alarms.create('fetch_manaba+R_tasks', { periodInMinutes: 1 });
  lookUp();
});

browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'fetch_manaba+R_tasks') {
    lookUp();
  }
});

browser.storage.onChanged.addListener((...args) =>
  console.log('storage changed', args)
);
