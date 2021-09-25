import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import relativeTime from 'dayjs/plugin/relativeTime';
import { render } from 'preact';

import { TaskList } from './TaskList';

dayjs.extend(relativeTime);
dayjs.locale('ja');

const parentSelector = '.contentbody-left';

const container = document.createElement('div');

const parent = document.querySelector(parentSelector);

if (parent == null) {
  throw new Error(`parent element: \`${parentSelector}\` does not found.`);
}

parent.insertBefore(container, parent.children[0]);

render(<TaskList />, container);
