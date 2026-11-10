# MyPortfolio
自分に関するポートフォリオ作成

## プレビューを開く

- `previews/index.html` をダブルクリックすると、その時点で生成済みのポートフォリオをブラウザーで確認できます。HTMLの表示にNode.jsや開発サーバーは不要です。
- 編集後は、リポジトリ直下の `preview.cmd` をダブルクリックしてください。HTMLを再生成して、既定のブラウザーで開きます。再生成にはNode.js・npmと、アプリの依存パッケージが必要です。
- 開いたままのページに更新が反映されない場合は、ブラウザーを再読み込みしてください。

ターミナルから更新する場合:

```powershell
cd student-portfolio
npm run preview:html
```

プレビューは実際の `app/page.tsx` とCSSから作成するため、足跡・波紋・記録の詳細表示も同じコードで動作します。CSS・JavaScript・アイコンはHTMLに埋め込まれます。`previews/index.html` は生成物なので直接編集せず、アプリのソースを編集してから再生成してください。

HTMLの外枠は `student-portfolio/preview/index.html`、生成処理は `student-portfolio/scripts/build-preview.mjs` です。これは画面確認用の静的プレビューで、サーバー認証やデータベース接続の検証には使いません。
