const fs = require('fs');
const path = require('path');

const poFilePath = path.join(__dirname, 'maxi-blocks-ja.po');
let content = fs.readFileSync(poFilePath, 'utf8');

const translations = {
    " theme, which is optimized for MaxiBlocks.": " MaxiBlocksに最適化されたテーマ。",
    " WordPress Importer plugin to import content XML files.": " コンテンツXMLファイルをインポートするためのWordPressインポータープラグイン。",
    "Style Card imported successfully as \\\"%s\\\"": "スタイルカード \\\"%s\\\" として正常にインポートされました",
    ", or ": "、または ",
    ": example value": ": 値の例",
    "A/Z": "A/Z",
    "Accumulator": "アキュムレーター",
    "ACF": "ACF",
    "ACF: example value": "ACF: 値の例",
    "activate": "有効化",
    "Activate now": "今すぐ有効化",
    "activating": "有効化中",
    "Active Plugins": "有効なプラグイン",
    "Active style card": "アクティブなスタイルカード",
    "Add a search bar with icon": "アイコン付き検索バーを追加",
    "Add icon or shape and style it": "アイコンやシェイプを追加してスタイルを設定",
    "Combine a set of blocks in a group": "ブロックのセットをグループに結合",
    "Create a divider between visual elements": "視覚要素の間に区切り線を作成",
    "Create a map with marker and description": "マーカーと説明付きのマップを作成",
    "Create a number counter": "ナンバーカウンターを作成",
    "Create list items with numbers, bullets or icons": "番号、箇条書き、またはアイコン付きのリストアイテムを作成",
    "Create slider with blocks, controls and animations": "ブロック、コントロール、アニメーション付きのスライダーを作成",
    "Expand or collapse content inside of a panel": "パネル内のコンテンツを展開または折りたたむ",
    "Insert a video with controls or lightbox": "コントロールまたはライトボックス付きの動画を挿入",
    "Insert, modify or style a button": "ボタンを挿入、変更、またはスタイル設定",
    "Insert, modify or style an image": "画像を挿入、変更、またはスタイル設定",
    "Insert, modify or style text": "テキストを挿入、変更、またはスタイル設定",
    "Organise blocks horizontally inside a row": "行内でブロックを水平に配置",
    "Sliding component of Slider Maxi": "Slider Maxiのスライドコンポーネント",
    "Stack blocks vertically inside a column": "カラム内でブロックを垂直に積み重ねる",
    "Wrap blocks within a container": "コンテナ内にブロックをラップ",
    "Burmese": "ビルマ語",
    "Central Atlas Tamazight": "中央アトラス・タマジクト語",
    "Central Atlas Tamazight (Latin)": "中央アトラス・タマジクト語 (ラテン文字)",
    "change templates": "テンプレートを変更",
    "choose another starter site": "別のスターターサイトを選択",
    "d.m.Y t": "Y年n月j日 H:i",
    "Delete old file: invalid file path": "古いファイルを削除: 無効なファイルパス",
    "Error processing images' links and ids - counts do not match": "画像のリンクとIDの処理エラー - カウントが一致しません",
    "everything inside svg on canvas hover (:hover svg > *)": "キャンバスホバー時のSVG内のすべて (:hover svg > *)",
    "Failed to check, please try again": "チェックに失敗しました。もう一度お試しください",
    "full year": "通年",
    "Georgian": "グルジア語",
    "Import completed. ": "インポートが完了しました。",
    "Import completed. You can ": "インポートが完了しました。次は ",
    "Imported card already exists.": "インポートされたカードは既に存在します。",
    "Imports a custom design for your website's 404 error page.": "ウェブサイトの404エラーページ用にカスタムデザインをインポートします。",
    "Imports the default blog landing page design for your site.": "サイトのデフォルトのブログランディングページデザインをインポートします。",
    "Imports the global footer design for your site.": "サイトのグローバルフッターデザインをインポートします。",
    "Imports the global header design for your site.": "サイトのグローバルヘッダーデザインをインポートします。",
    "Kannada": "カンナダ語",
    "Kazakh": "カザフ語",
    "Khmer": "クメール語",
    "Kirghiz": "キルギス語",
    "Klingon": "クリンゴン語",
    "Kurdish": "クルド語",
    "Lao": "ラオ語",
    "Left: %s": "左: %s",
    "line": "行",
    "Luxembourgish": "ルクセンブルク語",
    "Malay (Malaysia)": "マレー語 (マレーシア)",
    "Malayalam": "マラヤーラム語",
    "Maltese": "マルタ語",
    "Maori": "マオリ語",
    "Marathi": "マラーティー語",
    "Maxi": "Maxi",
    "MaxiBlocks Plugin": "MaxiBlocks プラグイン",
    "Mongolian": "モンゴル語",
    "Montenegrin": "モンテネグロ語",
    "month in numeric format": "月 (数値)",
    "month in text format": "月 (テキスト)",
    "month in text format, short": "月 (テキスト短縮)",
    "Nepali": "ネパール語",
    "Northern Sami": "北部サーミ語",
    "P": "P",
    "Pallet box colour %s": "パレットボックスの色 %s",
    "Please ": "してください ",
    "Punjabi (India)": "パンジャブ語 (インド)",
    "Radius: %s": "半径: %s",
    "Scale down Fade in less": "縮小フェードイン (小)",
    "Scale out Fade out less": "拡大フェードアウト (小)",
    "Scale up Fade in less": "拡大フェードイン (小)",
    "Search…": "検索...",
    "Serbian (Cyrillic)": "セルビア語 (キリル文字)",
    "Set your Image Maxi caption here…": "Image Maxiのキャプションをここに設定...",
    "Sindhi": "シンド語",
    "Sinhala": "シンハラ語",
    "Sorry, there is no next post, please choose something else.": "申し訳ありませんが、次の投稿はありません。他を選択してください。",
    "Sorry, there is no previous post, please choose something else.": "申し訳ありませんが、前の投稿はありません。他を選択してください。",
    "Sorry, this author has no posts yet, please choose something else.": "申し訳ありませんが、この著者にはまだ投稿がありません。他を選択してください。",
    "Sorry, you do not have any images yet, please choose something else.": "申し訳ありませんが、画像がまだありません。他を選択してください。",
    "Sorry, you do not have any tags yet, please choose something else.": "申し訳ありませんが、タグがまだありません。他を選択してください。",
    "Style Card imported successfully as \"%s\"": "スタイルカード \"%s\" として正常にインポートされました",
    "Swahili": "スワヒリ語",
    "Swati": "スワジ語",
    "Tagalog (Philippines)": "タガログ語 (フィリピン)",
    "Tajik": "タジク語",
    "Talossan": "タロッサ語",
    "Tamil": "タミル語",
    "Telugu": "テルグ語",
    "Tetum": "テトゥン語",
    "The block should have a wrapper to use flex-child properties": "フレックス子要素プロパティを使用するには、ブロックにラッパーが必要です",
    "The Code is not valid": "コードが無効です",
    "Theme Directory": "テーマディレクトリ",
    "Theme Information": "テーマ情報",
    "Theme Name": "テーマ名",
    "This type is empty": "このタイプは空です",
    "time": "時間",
    "Top: %1$s Left: %2$s": "上: %1$s 左: %2$s",
    "Top: %s": "上: %s",
    "Turkmen": "トルクメン語",
    "Type to search…": "検索文字を入力...",
    "Urdu": "ウルドゥー語",
    "Uyghur (China)": "ウイグル語 (中国)",
    "Uzbek": "ウズベク語",
    "Uzbek (Latin)": "ウズベク語 (ラテン文字)",
    "X": "X",
    "Y": "Y",
    "year in short format": "年 (短縮)",
    "Yoruba (Nigeria)": "ヨルバ語 (ナイジェリア)",
    "Your size": "あなたのサイズ",
    "Z": "Z",
    "Z/A": "Z/A"
};

let appliedCount = 0;
const lines = content.split('\n');
let newLines = [];
let i = 0;

while (i < lines.length) {
    let line = lines[i];
    newLines.push(line);
    
    // Check if this line is a msgid
    if (line.trim().startsWith('msgid "')) {
        let msgid = line.trim().substring(7, line.trim().length - 1);
        
        // Look ahead for msgstr
        if (i + 1 < lines.length) {
            let nextLine = lines[i + 1];
            if (nextLine.trim().startsWith('msgstr ""') && translations[msgid]) {
                // Check if it's really empty
                let isEmpty = true;
                if (i + 2 < lines.length) {
                    if (lines[i+2].trim().startsWith('"')) isEmpty = false;
                }
                
                if (isEmpty) {
                    newLines.push(`msgstr "${translations[msgid]}"`);
                    i += 2; // Skip original msgstr ""
                    appliedCount++;
                    continue;
                }
            }
        }
    }
    i++;
}

fs.writeFileSync(poFilePath, newLines.join('\n'));
console.log(`Applied ${appliedCount} translations.`);
