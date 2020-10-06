# manaba+R++

> Increment manaba+R.

## これはなに

manaba+R をほんの少し改善 (increment) する **非公式** Google Chrome 拡張機能です。

## ⚠ 注意

この拡張機能は立命館大学とは一切関係ありません。

また、この拡張機能は自己責任のもとでご使用ください。この拡張機能の作者はこれを使用することで生じた損害に対する責任を負いません。

## 機能

- [x] 「課題一覧」をマイページ、コースページに追加
- [x] 直近（一週間以内）に提出期限がある課題の数をアイコンに表示

実装途中の機能は [enhancement タグが適用された Issue](https://github.com/ygkn/manaba_R_incremented/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement) をご覧ください。

## 使い方

### ソースからビルド

#### 必要なソフトウェア

- Node.js 最新版
- yarn 最新版

#### ビルド方法

1. このリポジトリの main ブランチを clone する
2. `yarn install` を実行し、依存パッケージをインストールする
3. `yarn build` を実行し、ビルドする
4. 拡張機能ページ (Google Chrome では `chrome://extensions`) を開く
5. ページ右上の <kbd>Developer mode</kbd> トグルスイッチをオン
6. <kbd>Load unpacked button</kbd> ボタンをクリックし、 `dist` ディレクトリを選択する

## 開発

[`package.json`](./package.json) をご覧ください。

## 他大学向け manaba 拡張機能

[mkobayashime/manaba-enhanced](https://github.com/mkobayashime/manaba-enhanced): 筑波大学

## ライセンス

このプロジェクトは MIT ライセンスで運用されています。

[`LICENSE` ファイル](./LICENSE) をご覧ください。
