const path = window.location.pathname.replace(/^\/(s|ct)\//, "");

type MaybeFunction<T> = T | (() => T);
type MaybeArray<T> = T | T[];

type TitleSegment = string | false | undefined | null;
type Title = MaybeFunction<MaybeArray<TitleSegment>>;

type Rule = RegExp | string;

const titleRules: [Rule, Title][] = [
  ["home", "マイページ"],
  ["home_course", "コース"],
  ["home_announcement", "お知らせ"],
  ["home_announcement_list", "個人宛のお知らせ"],
  [
    "home_announcement_publist",
    () => [
      document.querySelector<HTMLElement>(".infolist-tab .current")?.innerText,
      "その他大学からのお知らせ",
    ],
  ],
  ["home_coursetable", "ポートフォリオ"],
  [
    /^course_\d+$/,
    () => [
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  [
    /^course_\d+_.+$/,
    () => [
      document.querySelector<HTMLElement>("#coursename")?.innerText,
      "コース",
    ],
  ],
  [
    "syllabus__search",
    () => {
      const query = document.querySelector<HTMLInputElement>(
        "input#target_word_search"
      )?.value;
      return [query && `"${query}"`, "シラバス検索"];
    },
  ],
  [
    /^syllabus_\d+$/,
    () => [
      document.querySelector<HTMLElement>(
        "#container > div.pagebody > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(1)"
      )?.innerText,
      "シラバス",
    ],
  ],
];

const unwrapFunction = <T>(maybeFunction: MaybeFunction<T>): T => {
  if (maybeFunction instanceof Function) {
    return maybeFunction();
  }

  return maybeFunction;
};

const wrapToArray = <T>(maybeArray: MaybeArray<T>): T[] => {
  if (Array.isArray(maybeArray)) {
    return maybeArray;
  }

  return [maybeArray];
};

const title = titleRules.find(([rule]) => {
  if (typeof rule === "string") {
    return path === rule;
  }

  return rule.test(path);
})?.[1];

if (title !== undefined) {
  document.title = [
    ...wrapToArray(unwrapFunction(title)).filter((v) => v),
    "manaba",
  ].join(" - ");
}
