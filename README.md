# storage-for-cli

シンプルなファイルストレージ管理CLIツール

## 概要

`storage-for-cli`は、ローカルディレクトリをストレージとして使用し、ファイルのアップロード、ダウンロード、一覧表示、削除などの基本的なファイル操作を行うためのコマンドラインツールです。

## 必要要件

- Node.js 24.14.0以上
- pnpm 10.30.3以上

## 📁 ディレクトリ構造

```
storage-for-cli/
├── config/
│   ├── .env          # 環境変数設定ファイル（gitignoreされる）
│   └── .env.example  # 環境変数設定ファイルのテンプレート
├── src/
│   ├── commands/     # コマンド実装
│   │   ├── delete.js # deleteコマンド実装
│   │   ├── help.js   # helpコマンド実装
│   │   ├── list.js   # listコマンド実装
│   │   ├── pull.js   # pullコマンド実装
│   │   ├── scan.js   # scanコマンド実装
│   │   └── upload.js # uploadコマンド実装
│   ├── dispatcher.js # コマンドディスパッチャー
│   ├── errors.js     # カスタムエラークラス定義
│   ├── index.js      # メインエントリーポイント
│   └── parser.js     # コマンドライン引数パーサー
├── storage/          # デフォルトストレージディレクトリ
├── package.json      # プロジェクト設定
└── README.md         # このファイル
```

### モジュール説明

- **src/index.js**: アプリケーションのエントリーポイント。環境変数を読み込み、引数を解析し、適切なコマンドにディスパッチします
- **src/errors.js**: 各種カスタムエラークラス（ValidationError, NotFoundDirectoryError, NotFoundCommandError, NotFoundFileError, PermissionError, FileAlreadyExistsError）
- **src/parser.js**: `parseArgs` を使用してコマンドライン引数を解析
- **src/dispatcher.js**: コマンドテーブルパターンを使用して、適切なコマンドハンドラーを実行
- **src/commands/**: 各コマンドの実装を格納するディレクトリ

## セットアップ

1. リポジトリをクローン：
```bash
git clone <repository-url>
cd storage-for-cli
```

2. 依存関係をインストール（現在、外部依存関係はありません）：
```bash
pnpm install
```

3. 環境変数を設定：
```bash
cp config/.env.example config/.env
```

4. `config/.env`ファイルを編集し、ストレージディレクトリを設定：
```
STORAGE=/path/to/your/storage
```

## 🚀 使用方法

```bash
node src/index.js <command> [arguments] [options]
```

### 利用可能なコマンド

#### `scan` - ディレクトリ内のファイルをスキャン

指定されたディレクトリ内のファイルとそのサイズ（バイト単位）を表示します。

```bash
node src/index.js scan <directory>
```

**例:**
```bash
node src/index.js scan ./
node src/index.js scan /path/to/directory
```

#### `list` - ストレージ内のファイル一覧を表示

ストレージディレクトリ内のファイル一覧を表示します。

```bash
node src/index.js list
```

#### `upload` - ファイルをアップロード

指定されたファイルをストレージディレクトリにアップロードします。既に同名のファイルが存在する場合はエラーになります（上書きなし）。

```bash
node src/index.js upload <filepath>
```

**例:**
```bash
node src/index.js upload ./myfile.txt
node src/index.js upload /path/to/document.pdf
```

#### `pull` - ファイルをダウンロード

ストレージディレクトリから指定されたファイルを現在のディレクトリにコピーします。

```bash
node src/index.js pull <filename>
```

**例:**
```bash
node src/index.js pull myfile.txt
```

#### `delete` - ファイルを削除

ストレージディレクトリから指定されたファイルを削除します。

```bash
node src/index.js delete <filename>
```

**例:**
```bash
node src/index.js delete myfile.txt
```

#### `help` - ヘルプメッセージを表示

使用方法とコマンド一覧を表示します。

```bash
node src/index.js help
```

## 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|--------------|
| STORAGE | ファイルのアップロード先ディレクトリ | ./storage |

環境変数は `config/.env` ファイルに設定します。

## エラーハンドリング

このツールは以下のようなエラーを適切に処理します：

- **NotFoundCommandError**: 存在しないコマンドが指定された場合
- **NotFoundDirectoryError**: 指定されたディレクトリやファイルが存在しない場合
- **NotFoundFileError**: 指定されたファイルが見つからない場合
- **PermissionError**: ファイルやディレクトリへのアクセス権限がない場合
- **FileAlreadyExistsError**: ファイルが既に存在する場合（uploadやpullコマンド使用時）

## 🛠️ 開発ガイド

### 新しいコマンドの追加方法

1. **コマンドファイルを作成**

   `src/commands/` ディレクトリに新しいコマンドファイルを作成します。

   ```javascript
   // src/commands/newcommand.js
   export async function newCommand(targetPath) {
     // コマンドのロジックを実装
     console.log(`Executing newcommand on ${targetPath}`);
   }
   ```

2. **ディスパッチャーに登録**

   `src/dispatcher.js` の `commandTable` に新しいコマンドを追加します。

   ```javascript
   import { newCommand } from "./commands/newcommand.js";

   export async function dispatchCommand({ command, targetPath }) {
     const commandTable = {
       scan: () => scan(targetPath),
       list: () => list(),
       upload: () => upload(targetPath),
       pull: () => pull(targetPath),
       delete: () => deleteFile(targetPath),
       help: () => help(),
       newcommand: () => newCommand(targetPath),  // 追加
     };
     // ...
   }
   ```

3. **引数の検証**

   コマンドが特定の引数を必要とする場合は、コマンド内で検証します。

   ```javascript
   import { NotFoundDirectoryError } from "../errors.js";

   export async function newCommand(targetPath) {
     if (targetPath === undefined) {
       throw new NotFoundDirectoryError(`引数を指定してください`);
     }
     // コマンドのロジック
   }
   ```

4. **エラーハンドリング**

   必要に応じて `src/errors.js` のカスタムエラークラスを使用します。

   ```javascript
   import { PermissionError } from "../errors.js";

   try {
     // ファイル操作
   } catch (error) {
     if (error.code === "EACCES") {
       throw new PermissionError(`権限がありません： ${error.message}`);
     }
     throw error;
   }
   ```

5. **ヘルプメッセージに追加**

   `src/commands/help.js` に新しいコマンドの説明を追加します。

### コードの構成原則

- **単一責任の原則**: 各モジュールは1つの責務のみを持つ
- **ディスパッチテーブルパターン**: コマンドの追加・削除を容易にする
- **エラーの一元管理**: すべてのカスタムエラーは `errors.js` で定義
- **ES Modules**: `import/export` 構文を使用

### パッケージマネージャー

このプロジェクトは`pnpm`を使用しています。

### Node.jsバージョン

このプロジェクトは`volta`を使用してNode.jsバージョンを管理しています。

- Node.js: 24.14.0
- pnpm: 10.32.1

## 📝 アーキテクチャノート

このプロジェクトは**ディスパッチテーブルパターン**を採用しています。これにより：

- 新しいコマンドの追加が容易
- コマンドの実装が独立している
- 存在しないコマンドのエラーハンドリングが統一されている

コマンド実行の流れ：
```
1. src/index.js がエントリーポイント
2. parser.js が引数を解析
3. dispatcher.js がコマンドテーブルから適切なハンドラーを選択
4. commands/ 内の対応する関数が実行される
5. エラーがあれば errors.js のカスタムエラーがスロー
```

## ⚠️ 注意事項

- すべてのコマンドは非同期関数として実装されています（`async/await`）
- ファイルシステム操作にはNode.js標準の `fs/promises` を使用
- エラーは適切なカスタムエラークラスでハンドリングされます
- uploadとpullコマンドは既存ファイルを上書きしません（`COPYFILE_EXCL`フラグを使用）

## ライセンス

ISC

## 作者

Ayumu
