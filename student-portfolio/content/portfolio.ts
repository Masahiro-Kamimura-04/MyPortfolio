// 作品や節目はここで追加・編集できます。未確認の日付や実績は補完しません。
export type Story = {
  id: string;
  title: string;
  kicker: string;
  lead: string;
  sections: { heading: string; body: string }[];
  tech?: string[];
};

export const profile = {
  name: "まさ",
  affiliation: "東洋大学 情報連携学部",
  github: "https://github.com/Masahiro-Kamimura-04",
};

export const projects: (Story & {
  category: string; status: string; summary: string; tags: string[];
})[] = [
  {
    id: "connect", title: "INIAD-CONNECT", kicker: "PROJECT 01 / WEB APPLICATION",
    category: "WEB APPLICATION", status: "制作中",
    summary: "学年を越えたつながりをつくる、INIADの学生のための総合掲示板。",
    lead: "東洋大学情報連携学部の学生が、学年を問わず交流できる場所を目指しています。2026年10月ごろから個人で制作中です。",
    tags: ["Next.js", "TypeScript", "Supabase"],
    sections: [
      { heading: "つくろうと思ったきっかけ", body: "大学生活で、学年間のつながりを感じる場面が少ないと感じたこと。学年の枠を越えて話せる、総合掲示板のような場所をつくりたいと思いました。" },
      { heading: "現在できること", body: "掲示板への投稿とコメント、仲間の募集、雑談など。さまざまな目的で交流できる掲示板機能を実装しています。" },
      { heading: "開発を通しての学び", body: "一つのWebアプリケーションをつくるにも、画面、データベース、認証、アクセス制限など、さまざまな技術を組み合わせる必要があることを実感しました。" },
      { heading: "これから取り組みたいこと", body: "Googleアカウントによる認証、いいね数の多い投稿のランキング、自由にタグを設定できる機能を追加したいと考えています。現在は個人制作ですが、今後のチーム開発への移行も検討しています。" },
    ],
    tech: ["Next.js / App Router", "React", "TypeScript", "Tailwind CSS", "Lucide React", "Supabase / PostgreSQL", "Supabase Auth", "SQL / PL/pgSQL / RLS", "React Context / Hooks", "sessionStorage", "Node.js / npm", "PGlite", "Playwright / axe", "GitHub Actions"],
  },
  {
    id: "moocs", title: "MOOCs Check", kicker: "PROJECT 02 / CHROME EXTENSION",
    category: "CHROME EXTENSION", status: "個人利用・改善中",
    summary: "提出状況と課題をひとつの場所で。日々の学習管理を支えるChrome拡張機能。",
    lead: "学部専用サイト「MOOCs」の提出状況や課題を、確認・管理しやすくする個人利用向けの拡張機能です。2026年6月に制作を始め、10月にデザインなどを刷新しました。",
    tags: ["JavaScript", "Manifest V3", "HTML / CSS"],
    sections: [
      { heading: "身近にあった不便", body: "MOOCsで提出状況を確認しづらいことと、課題を一括で管理する機能が欲しいと感じたことが、制作のきっかけです。" },
      { heading: "課題ダッシュボードと管理", body: "ページ内の課題を自動抽出し、提出率、未提出、期限超過、締切間近、未確認の件数を表示。絞り込みと締切順の表示に対応しています。課題名、コース、締切日時、URL、メモの手動登録と編集・削除、提出状態の切り替えもできます。" },
      { heading: "カレンダーと通知", body: "月間カレンダー、日別の課題、今後1週間の締切を表示。コース別の絞り込みにも対応しています。提出忘れや締切24時間前・1時間前の通知は、画面の表示・更新時に確認する方式です。" },
      { heading: "提出クリック履歴", body: "提出ボタンを押した日時を秒単位で保存し、ボタン横に最新日時を表示。同じChromeプロファイル内の複数タブでも履歴を共有します。記録するのはボタンのクリックで、提出の成功を保証するものではありません。" },
      { heading: "講義ページのまとめ・PDF処理", body: "講義ページを取得し、ページ名と出席・提出状態を一覧化します。表示は3種類から切り替え可能で、取得できない状態は「未確認」として区別します。スライドの一括PDF保存にも対応しています。" },
    ],
    tech: ["JavaScript / HTML / CSS", "Chrome Extensions Manifest V3", "Content Script / Service Worker", "Shadow DOM", "DOMParser / MutationObserver", "Fetch API", "chrome.storage.local / session", "Canvas / PDF生成", "Node.js / Playwright"],
  },
];

export const milestones: (Story & {
  date: string; displayDate: string; category: string; summary: string; note?: string;
})[] = [
  {
    id: "first-step", date: "2026-04", displayDate: "2026.04", category: "LEARNING",
    title: "プログラミングとの出会い。", kicker: "2026.04 / THE FIRST STEP",
    summary: "大学での学習をきっかけに、プログラミングを学び始める。",
    lead: "2026年4月、プログラミングの学習を始めました。",
    sections: [{ heading: "軌跡の出発点", body: "大学の授業で技術を学び、その技術を自分でも活かしていきたいと考えるようになりました。この学びが、6月ごろからの制作につながっていきます。" }],
  },
  {
    id: "first-build", date: "2026-06", displayDate: "2026.06", category: "MAKING",
    title: "学んだことを、使えるものに。", kicker: "2026.06 / START MAKING",
    summary: "授業で習った技術を活かしたくて、MOOCs Checkの制作を始める。",
    lead: "提出状況の確認や、課題の一括管理をしやすくしたい。その思いから制作を始めました。",
    sections: [{ heading: "制作を始めた理由", body: "学部専用サイトMOOCsを使う中で感じた不便と、授業で学んだ技術を活かしたいという気持ちが結びつきました。個人利用向けのChrome拡張機能「MOOCs Check」の開発に着手しました。" }],
  },
  {
    id: "refine", date: "2026-10", displayDate: "2026.10", category: "IMPROVING",
    title: "つくったものを、つくり直す。", kicker: "2026.10 / KEEP IMPROVING",
    summary: "後期の開始に合わせ、MOOCs Checkのデザインなどを刷新。",
    lead: "6月に始めた制作を、後期が始まった10月に見直しました。",
    sections: [{ heading: "改善を重ねる", body: "MOOCs Checkのデザインなどを刷新しました。提出状況やクリック履歴の確認、課題の登録、カレンダーでの確認など、自分の学習を支える機能を備えています。" }],
  },
  {
    id: "new-challenge", date: "2026-10", displayDate: "2026.10 ごろ", category: "NEW CHALLENGE",
    title: "自分の不便から、みんなのつながりへ。", kicker: "2026.10 / A NEW CHALLENGE",
    summary: "学年を越えた交流の場を目指して、INIAD-CONNECTの制作を開始。",
    note: "一つのWebアプリにも、さまざまな技術がつながっている。",
    lead: "学年間のつながりを感じる場面が少ない。その実感が、新しい開発のきっかけになりました。",
    sections: [{ heading: "取り組んでいること", body: "情報連携学部の総合掲示板として、投稿・コメント、仲間募集、雑談などの交流機能を制作しています。現在は個人制作で、今後はチーム開発への移行も検討しています。" }, { heading: "開発から得た学び", body: "一つのWebアプリケーションを形にするためにも、さまざまな技術を使い、組み合わせる必要があることを実感しました。" }],
  },
];
