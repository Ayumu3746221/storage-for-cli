export function help() {
  console.log(`
storage-for-cli - ファイルストレージ管理ツール

使用方法:
  node src/index.js <command> [arguments] [options]

利用可能なコマンド:

  scan <directory>
    指定されたディレクトリ内のファイルをスキャンし、
    ファイル名とそのサイズ（バイト単位）を表示します。
    
    例: node src/index.js scan ./
        node src/index.js scan /path/to/directory

  list
    ストレージディレクトリ内のファイル一覧を表示します。
    
    例: node src/index.js list

  upload <filepath>
    指定されたファイルをストレージディレクトリにアップロードします。
    ファイルが既に存在する場合はエラーになります（上書きなし）。
    
    例: node src/index.js upload ./myfile.txt
        node src/index.js upload /path/to/document.pdf

  pull <filename>
    ストレージディレクトリから指定されたファイルを
    現在のディレクトリにコピーします。
    
    例: node src/index.js pull myfile.txt

  delete <filename>
    ストレージディレクトリから指定されたファイルを削除します。
    
    例: node src/index.js delete myfile.txt

  help
    このヘルプメッセージを表示します。
    
    例: node src/index.js help

環境変数:
  STORAGE    ファイルのアップロード先ディレクトリ（デフォルト: ./storage）

詳細情報:
  README.md を参照してください。
`);
}
