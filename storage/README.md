# storage-for-cli

ファイルシステムを操作するためのコマンドラインツールです。

## 📁 ディレクトリ構造

```
storage-for-cli/
├── cli.js                 # 旧エントリーポイント（後で削除予定）
├── package.json          # プロジェクト設定
├── README.md             # このファイル
└── src/
    ├── index.js          # メインエントリーポイント
    ├── errors.js         # カスタムエラークラス定義
    ├── parser.js         # コマンドライン引数解析
    ├── dispatcher.js     # コマンドディスパッチロジック
    └── commands/
        ├── scan.js       # scanコマンド実装
        └── help.js       # helpコマンド実装
```

### モジュール説明

- **src/index.js**: アプリケーションのエントリーポイント。引数を解析し、適切なコマンドにディスパッチします
- **src/errors.js**: 各種カスタムエラークラス（ValidationError, NotFoundDirectoryError, NotFoundCommandError, PermissionError）
- **src/parser.js**: `parseArgs` を使用してコマンドライン引数を解析
- **src/dispatcher.js**: コマンドテーブルパターンを使用して、適切なコマンドハンドラーを実行
- **src/commands/**: 各コマンドの実装を格納するディレクトリ

## 🚀 使用方法

```bash
node src/index.js <command> <directory> [options]
```

### 利用可能なコマンド

#### `scan` - ディレクトリ内のファイルをスキャン

指定されたディレクトリ内のファイルとそのサイズを表示します。

```bash
node src/index.js scan ./
node src/index.js scan /path/to/directory
```

**出力例:**
```
解析成功： { command: 'scan', targetPath: './', flags: {} }
command : scan
./cli.js: 3184 bytes
./package.json: 348 bytes
```

#### `help` - ヘルプメッセージを表示

使用方法を表示します。

```bash
node src/index.js help
```

## 🛠️ 開発ガイド

### 新しいコマンドの追加方法

1. **コマンドファイルを作成**

   `src/commands/` ディレクトリに新しいコマンドファイルを作成します。

   ```javascript
   // src/commands/list.js
   export async function list(dirPath) {
     // コマンドのロジックを実装
     console.log(`Listing files in ${dirPath}`);
   }
   ```

2. **ディスパッチャーに登録**

   `src/dispatcher.js` の `commandTable` に新しいコマンドを追加します。

   ```javascript
   import { list } from "./commands/list.js";

   export async function dispatchCommand({ command, targetPath }) {
     const commandTable = {
       scan: () => scan(targetPath),
       help: () => help(),
       list: () => list(targetPath),  // 追加
     };
     // ...
   }
   ```

3. **引数の検証**

   コマンドが特定の引数を必要とする場合は、コマンド内で検証します。

   ```javascript
   export async function list(dirPath) {
     if (dirPath === undefined) {
       throw new NotFoundDirectoryError(`ディレクトリを指定してください`);
     }
     // コマンドのロジック
   }
   ```

4. **エラーハンドリング**

   必要に応じて `src/errors.js` のカスタムエラークラスを使用します。

   ```javascript
   import { ValidationError } from "../errors.js";

   if (!isValid) {
     throw new ValidationError("無効な入力です");
   }
   ```

### コードの構成原則

- **単一責任の原則**: 各モジュールは1つの責務のみを持つ
- **ディスパッチテーブルパターン**: コマンドの追加・削除を容易にする
- **エラーの一元管理**: すべてのカスタムエラーは `errors.js` で定義
- **ES Modules**: `import/export` 構文を使用

### 開発環境

```bash
# パッケージマネージャー
pnpm (10.32.1)

# Node.js バージョン
node 24.14.0
```

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
