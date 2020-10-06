import 'dayjs/locale/ja';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ReactDOM from 'react-dom';

import { app } from './app';

dayjs.extend(relativeTime);
dayjs.locale('ja');

const container = document.createElement('div');

const parent = document.querySelector('.contentbody-left');

if (parent == null) {
  throw new Error('parent element: `.contentbody-left` does not found.');
}

parent.insertBefore(container, parent.children[0]);

ReactDOM.render(app, container);
