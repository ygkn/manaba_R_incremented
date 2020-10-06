import { browser } from 'webextension-polyfill-ts';
import { saveTasks } from '../common/task';

browser.runtime.onInstalled.addListener(() => {
  browser.alarms.create('fetch_manaba+R_tasks', { periodInMinutes: 30 });
  saveTasks();
});

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'fetch_manaba+R_tasks') {
    await saveTasks();
  }
});
