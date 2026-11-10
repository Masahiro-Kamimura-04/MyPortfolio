# 内容を更新するには

画面初稿の内容は、主に `content/portfolio.ts` を編集します。

- `profile`：活動名、所属、GitHub URL。
- `milestones`：軌跡の節目。配列の順に表示されます。`date` は `YYYY-MM`、`displayDate` は表示用。`note` で短い学びのメモを添えられます。
- `projects`：作品紹介。`summary` は一覧、`lead` と `sections` は詳細、`tags` は一覧の技術、`tech` は詳細の技術です。
- `app/page.tsx`：画面構成、自己紹介文、作品の機能イメージ。
- `app/globals.css`：配色、レイアウト、アニメーション。冒頭のCSS変数で主な色を変更できます。
- `app/layout.tsx`：ページタイトルと検索結果用の説明。
- `public/favicon.svg`：タブのアイコン。

画像・動画を用意したら `public/` に保存し、作品の機能イメージの図を差し替えます。管理画面からの編集・アップロードは今後実装する予定で、現時点では利用できません。

## HTMLをダブルクリックして確認

リポジトリ直下の `preview.cmd` をダブルクリックすると、現在のReact画面を単独HTMLに変換してブラウザーで開きます。生成済みの `../previews/index.html` を直接開くこともできます。

```powershell
npm run preview:html
```

HTMLにはスタイルとスクリプトが埋め込まれるため、開発サーバーなしで足跡・波紋・詳細画面を確認できます。ソースを変更した後は再生成してください。HTMLの外枠を編集する場合は `preview/index.html` を使います。
## ローカルで確認

```powershell
npm run dev
```

標準のURLは `http://localhost:5173` です。別ポートになった場合はターミナルに表示されたURLを開いてください。

```powershell
node node_modules/typescript/bin/tsc --noEmit
npm run build
```

構成や未実装の範囲は `DESIGN.md` にまとめています。
