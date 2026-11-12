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

プレビューは実際の `app/page.tsx` とCSSから作成するため、光の線・波紋・記録の詳細表示も同じコードで動作します。CSS・JavaScript・アイコンはHTMLに埋め込まれます。`previews/index.html` は生成物なので直接編集せず、アプリのソースを編集してから再生成してください。

HTMLの外枠は `student-portfolio/preview/index.html`、生成処理は `student-portfolio/scripts/build-preview.mjs` です。これは画面確認用の静的プレビューで、サーバー認証やデータベース接続の検証には使いません。

## GitHub Pagesで公開する

公開URL: https://Masahiro-Kamimura-04.github.io/MyPortfolio/

### 初回の公開

1. この変更をコミットしてGitHubの `main` ブランチへpushします。
2. リポジトリの **Settings → Pages → Build and deployment → Source** で **GitHub Actions** を選択します。
3. **Actions → Build and deploy GitHub Pages → Run workflow** で `main` を選んで実行します。Pages設定前のpushで実行が失敗していた場合も、設定後に再実行できます。
4. `build` と `deploy` が成功したら、実行結果の `github-pages` のURLから公開ページを開きます。

以後は `main` へのpushで自動更新されます。`main` 向けのプルリクエストではビルドのみを確認します。手動実行で公開できるのも `main` だけです。

GitHub Freeでは公開リポジトリが必要です。非公開リポジトリのまま利用する場合はPagesに対応したプランを確認してください。リポジトリの公開範囲変更は、この準備には含めません。

### ローカルで公開用ファイルを生成

Node.js 24を使用します。

```powershell
cd student-portfolio
npm ci --include=dev --include=optional --no-audit --no-fund
npm run build:pages
```

出力先は `student-portfolio/dist/pages/` です。`index.html` を直接開いて確認することもできます。生成物はGit管理せず、GitHub Actionsが毎回ソースから生成します。

- 実際の `app/page.tsx` とCSSを使い、JavaScript・CSS・faviconをHTMLへ埋め込みます。ルート絶対パスのアセット読み込みがないため、`/MyPortfolio/` 配下でも表示できます。
- 公開するのは `dist/pages/` のみです。`previews/` 内の確認画像や `state/` などは公開用成果物に含めません。
- 現在の光の線・波紋・詳細ダイアログはブラウザー内で動作します。GitHub Pagesではサーバー認証・データベース・API処理は実行できません。
- `npm run build` は既存のSites / Cloudflare向けです。GitHub Pagesには必ず `npm run build:pages` を使ってください。
- 既存の `npm run preview:html` と `preview.cmd` は引き続き利用できます。

公式手順: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
