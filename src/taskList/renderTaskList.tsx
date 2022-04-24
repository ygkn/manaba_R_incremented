import dayjs from "dayjs";
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime";
import { render } from "preact";

import { TaskList } from "./TaskList";

dayjs.extend(relativeTime);
dayjs.locale("ja");

const parentSelector = ".contentbody-left";

const container = document.createElement("div");

const parent = document.querySelector(parentSelector);

const kinkyuInfo = document.querySelector(
  ".contentbody-left .my-infolist-kinkyu"
);

if (parent !== null) {
  if (kinkyuInfo !== null) {
    parent.insertBefore(container, kinkyuInfo);
  } else {
    parent.prepend(container);
  }

  render(<TaskList />, container);
}
