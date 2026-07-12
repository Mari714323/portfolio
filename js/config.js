/* エンドポイントは各自で作成したものに書き換えること　*/
export const API_ENDPOINTS = {
    CONTACT: 'https://xxxxxxx.com/prod/contact'
};

export const TERMINAL_LINES = {
    mv: [
        { text: '$ python data_compare.py --target dataset_8gb.csv', color: '#ffbd2e' },
        { text: '> Loading 8GB CSV data...', color: '#a9b7c6' },
        { text: '> Sorting records by primary key...', color: '#a9b7c6' },
        { text: '> Executing data comparison...', color: '#a9b7c6' },
        { text: '> Success: Process completed in 4.2s', color: '#27c93f' }
    ],
    cert: [
        { text: '$ ./get_certifications.sh', color: '#ffbd2e' },
        { text: '> Loading credentials...', color: '#a9b7c6' },
        { text: '[ OK ] 基本情報技術者試験', color: '#27c93f' },
        { text: '[ OK ] AWS 認定 クラウドプラクティショナー', color: '#27c93f' }
    ],
    career: [
        { text: '$ cat career_log.txt', color: '#ffbd2e' },
        { text: '2018-2023: 高等学校 教員（教科:化学・成績処理Excel作成）', color: '#a9b7c6' },
        { text: '2023-now: データ処理・移行開発基盤エンジニア（PostgreSQL / SQL Server）', color: '#27c93f' },
        { text: '2025-now: クラウドインフラ・データエンジニアリング（AWS完全サーバーレス構成構築）', color: '#27c93f' }
    ],
    skills: [
        { text: '$ ./get_skills_summary.sh', color: '#ffbd2e' },
        { text: '[ OK ] Database: PostgreSQL, SQL Server (高度なバッチ最適化・共通化)', color: '#27c93f' },
        { text: '[ OK ] Language: Python (大容量CSVのソート・高速比較処理)', color: '#27c93f' },
        { text: '[ OK ] Cloud: AWS (S3, Lambda, API Gateway, CloudFormation)', color: '#27c93f' },
        { text: '[ OK ] Frontend: HTML5, CSS3, JavaScript (Vanilla JSによるコンポーネント化)', color: '#27c93f' }
    ]
};