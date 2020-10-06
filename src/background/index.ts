import dayjs from 'dayjs';
import { browser } from 'webextension-polyfill-ts';
import { fetchTasksInfo, saveTasks } from '../common/task';

const lookUp = async () => {
  const tasksInfo = await fetchTasksInfo();

  saveTasks(tasksInfo);

  browser.browserAction.setBadgeText({
    text: Object.values(tasksInfo)
      .flat()
      .filter(({ due }) => dayjs(due).diff(dayjs(), 'day') < 7)
      .length.toString(),
  });
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
