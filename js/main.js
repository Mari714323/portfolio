document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       0. 初回ローディング画面（オープニング演出）
       ========================================================================== */
    const loadingOverlay = document.getElementById('loading-overlay');
    const line1 = document.getElementById('loading-line-1');
    const line2 = document.getElementById('loading-line-2');
    const line3 = document.getElementById('loading-line-3');

    // 既に実行されたかを判定するフラグ（二重実行を完全に防止）
    let isLoadingPlayed = false;

    async function playLoadingAnimation() {
        // 対象要素がない場合は処理をスキップ（安全対策）
        if (!loadingOverlay || !line1 || !line2 || !line3) return;
        
        // 既に実行済みの場合はスキップして終了
        if (isLoadingPlayed) return;
        isLoadingPlayed = true;

        // 万が一再発火しても文字が繋がらないよう中身をリセット
        line1.textContent = '';
        line2.textContent = '';
        line3.textContent = '';

        // 1文字ずつタイピングするヘルパー関数
        const typeText = async (element, text, speed = 40) => {
            for (let i = 0; i < text.length; i++) {
                element.textContent += text[i];
                await new Promise(resolve => setTimeout(resolve, speed));
            }
        };

        // アニメーションの実行手順（トータル約2秒強の演出）
        await new Promise(resolve => setTimeout(resolve, 200)); // 画面表示後のわずかなタメ
        
        await typeText(line1, 'LOADING...', 40);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        await typeText(line2, '[ OK ]', 40);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        await typeText(line3, 'Welcome!', 60); // Welcome! は少しもったいぶって遅めに
        await new Promise(resolve => setTimeout(resolve, 800)); // 表示後の余韻

        // オーバーレイにクラスを付与してCSSのtransitionでフェードアウト
        loadingOverlay.classList.add('is-loaded');

        // ★追加：ローディング画面が完全に消えたタイミング(0.6s後)で、独自イベントを発火させる
        setTimeout(() => {
            document.dispatchEvent(new Event('loadingComplete'));
        }, 600);
    }

    // ローディングアニメーションを実行
    playLoadingAnimation();

    /* ==========================================================================
       0.5. ダークモードの適用（ロード直後のチラつき防止）
       ========================================================================== */
    // 過去に選択したテーマがローカルストレージにあれば、ヘッダー挿入を待たずに即座にbodyへ適用
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    if (currentTheme) {
        document.body.classList.add(currentTheme);
    }

    /* ==========================================================================
       0.6. ダークモード切り替えイベントの初期化（ヘッダー挿入後に実行）
       ========================================================================== */
    const initDarkModeToggle = () => {
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        if (!themeToggleBtn || !themeIcon) return;

        // 初期アイコン状態の同期
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.textContent = 'light_mode';
        } else {
            themeIcon.textContent = 'dark_mode';
        }

        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            // 切り替え後の状態に応じてアイコンとローカルストレージを更新
            if (document.body.classList.contains('dark-mode')) {
                themeIcon.textContent = 'light_mode';
                localStorage.setItem('theme', 'dark-mode');
            } else {
                themeIcon.textContent = 'dark_mode';
                localStorage.setItem('theme', ''); // ライトモード時は空文字
            }
        });
    };

    /* ==========================================================================
       1. スムーススクロール（ルート相対パス・固定ヘッダー対応版）
       ========================================================================== */
    const initSmoothScroll = () => {
        const siteHeader = document.querySelector('.site-header');
        const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
        
        // ページ内アンカー、およびルート相対パスのアンカーを両方監視対象にする
        const anchorLinks = document.querySelectorAll('a[href^="#"], a[href^="/#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                
                // 現在のページがトップページ（ルート、またはindex.html）であるかを判定
                const isTopPage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') || window.location.pathname === '';

                // 「#id」の形式、または「トップページにいる状態での /#id」の場合のみスムーススクロールを実行
                if (href.startsWith('#') || (href.startsWith('/#') && isTopPage)) {
                    const targetId = href.startsWith('/#') ? href.replace(/^\/#/, '#') : href;
                    if (targetId === '#') return;

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault(); // 通常のURL遷移をキャンセル
                        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
                // トップページ以外で「/#id」がクリックされた場合は、デフォルトの挙動（トップページへの画面遷移）に任せる
            });
        });
    };

    /* ==========================================================================
       2. スクロール時の「ふわっとフェードイン」演出（Intersection Observer）
       ========================================================================== */
    const fadeElements = document.querySelectorAll('.js-fade-element');
    
    // 画面に要素がどのくらい入ったら発火するかを設定（15%見えたらアニメーション開始）
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 画面内に入ったらCSSクラスを付与してフェードインを実行
                entry.target.classList.add('is-visible');
                // 一度表示されたら監視を解除する（スクロールを戻してもアニメーションを繰り返さない）
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    /* ==========================================================================
       2.5 ターミナル風タイピングアニメーション
       ========================================================================== */
    // アニメーションを実行する汎用関数
    async function typeLines(elementId, lines) {
        const targetElement = document.getElementById(elementId);
        if (!targetElement) return;
        
        targetElement.innerHTML = ''; // 初期化
        
        for (const line of lines) {
            const lineDiv = document.createElement('div');
            lineDiv.style.color = line.color || '#a9b7c6';
            targetElement.appendChild(lineDiv);
            
            // 1文字ずつタイピングする演出
            for (let i = 0; i < line.text.length; i++) {
                lineDiv.textContent += line.text[i];
                await new Promise(r => setTimeout(r, 25)); // タイピング速度
            }
            await new Promise(r => setTimeout(r, 500)); // 行間の待機時間
        }
    }

    // メインビジュアル用のターミナルテキスト（データ処理スクリプト実行風）
    const mvTerminalLines = [
        { text: '$ python data_compare.py --target dataset_8gb.csv', color: '#ffbd2e' },
        { text: '> Loading 8GB CSV data...', color: '#a9b7c6' },
        { text: '> Sorting records by primary key...', color: '#a9b7c6' },
        { text: '> Executing data comparison...', color: '#a9b7c6' },
        { text: '> Success: Process completed in 4.2s', color: '#27c93f' }
    ];

    // 資格セクション用のターミナルテキスト
    const certTerminalLines = [
        { text: '$ ./get_certifications.sh', color: '#ffbd2e' },
        { text: '> Loading credentials...', color: '#a9b7c6' },
        { text: '[ OK ] 基本情報技術者試験', color: '#27c93f' },
        { text: '[ OK ] AWS 認定 クラウドプラクティショナー', color: '#27c93f' }
    ];

    // 【追加】Aboutページ・経歴用のターミナルテキスト
    const aboutCareerLines = [
        { text: '$ cat career_log.txt', color: '#ffbd2e' },
        { text: '2018-2023: 高等学校 教員（教科:化学・成績処理Excel作成）', color: '#a9b7c6' },
        { text: '2023-now: データ処理・移行開発基盤エンジニア（PostgreSQL / SQL Server）', color: '#27c93f' },
        { text: '2025-now: クラウドインフラ・データエンジニアリング（AWS完全サーバーレス構成構築）', color: '#27c93f' }
    ];

    // 【追加】Aboutページ・スキル用のターミナルテキスト
    const aboutSkillsLines = [
        { text: '$ ./get_skills_summary.sh', color: '#ffbd2e' },
        { text: '[ OK ] Database: PostgreSQL, SQL Server (高度なバッチ最適化・共通化)', color: '#27c93f' },
        { text: '[ OK ] Language: Python (大容量CSVのソート・高速比較処理)', color: '#27c93f' },
        { text: '[ OK ] Cloud: AWS (S3, Lambda, API Gateway, CloudFormation)', color: '#27c93f' },
        { text: '[ OK ] Frontend: HTML5, CSS3, JavaScript (Vanilla JSによるコンポーネント化)', color: '#27c93f' }
    ];

    // Intersection Observerを使って、ターミナルが画面に入ったらアニメーションを開始する
    const terminalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('js-terminal-mv')) {
                    typeLines('typing-mv', mvTerminalLines);
                } else if (entry.target.classList.contains('js-terminal-cert')) {
                    typeLines('typing-cert', certTerminalLines);
                } else if (entry.target.classList.contains('js-terminal-career')) {
                    typeLines('typing-career', aboutCareerLines);
                } else if (entry.target.classList.contains('js-terminal-skills')) {
                    typeLines('typing-skills', aboutSkillsLines);
                }
                observer.unobserve(entry.target); // 1回だけ実行
            }
        });
    }, { threshold: 0.5 }); // 要素が半分見えたら発火

    // ★修正：資格セクション用のターミナルは初期状態から監視（スクロールして見えたら発火するため）
    document.querySelectorAll('.js-terminal-cert').forEach(el => {
        terminalObserver.observe(el);
    });

    // 【追加】Aboutページ用の各ミニターミナルを初期状態から監視対象に登録
    document.querySelectorAll('.js-terminal-career').forEach(el => {
        terminalObserver.observe(el);
    });
    document.querySelectorAll('.js-terminal-skills').forEach(el => {
        terminalObserver.observe(el);
    });

    // ★修正：メインビジュアルのターミナルは、ローディング画面の終了イベントを待ってから監視を開始する
    document.addEventListener('loadingComplete', () => {
        document.querySelectorAll('.js-terminal-mv').forEach(el => {
            terminalObserver.observe(el);
        });
    });

    /* ==========================================================================
       3. 【AWS連携準備】閲覧数カウンター機能（モック処理）
       ========================================================================== */
    const countView = async () => {
        try {
            console.log('[Mock] 閲覧カウンター: API Gatewayへリクエストを送信中...');
            /* 実際のコード例:
            const response = await fetch('https://your-api-gateway-url/counter', { method: 'POST' });
            const data = await response.json();
            */
            console.log('[Mock] 閲覧カウンター: DynamoDBのカウントを裏側で+1しました。');
        } catch (error) {
            console.error('カウンターAPIエラー:', error);
        }
    };
    
    // ページ読み込み時にカウンターを裏側で実行
    countView();

    /* ==========================================================================
       4. 【共通ロジック】汎用コンポーネント非同期読み込み関数
       ========================================================================== */
    const loadComponent = async (containerId, filePath, successCallback = null) => {
        const container = document.getElementById(containerId);
        if (!container) return; // 該当するコンテナがページ内にない場合はスキップ

        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTMLの取得に失敗しました: ${response.statusText}`);
            const html = await response.text();
            
            // コンテナにHTMLを挿入
            container.innerHTML = html;

            // コールバック関数（各パーツ固有の初期化ロジック）があれば実行
            if (successCallback) {
                successCallback(container);
            }
        } catch (error) {
            console.error(`コンポーネント [${containerId}] の読み込みエラー:`, error);
            container.innerHTML = `<p style="text-align: center; padding: 20px; color: var(--text-muted);">パーツの読み込みに失敗しました。</p>`;
        }
    };

    /* ==========================================================================
       5. 【AWS連携準備】お問い合わせフォーム送信処理（モック処理）
       ========================================================================== */
    const initContactForm = () => {
        const contactForm = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        const submitBtn = document.getElementById('submit-btn');

        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault(); // デフォルトの送信挙動をキャンセル

                // ボタンを「送信中」状態に変更し、多重送信を防止
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = '送信中...';
                submitBtn.disabled = true;
                formStatus.className = 'form-status'; // メッセージリセット

                // フォームから入力データを取得し、JSON化の準備
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value
                };

                try {
                    console.log('[Mock] お問い合わせ: API Gatewayへ以下のデータを送信中...', formData);
                    
                    // 通信のタイムラグをシミュレート（1.5秒待機）
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    // 成功時のUI更新
                    formStatus.textContent = 'お問い合わせを受け付けました。追ってご連絡いたします。';
                    formStatus.classList.add('success');
                    contactForm.reset(); // フォームの中身を空にする

                } catch (error) {
                    // エラー時のUI更新
                    console.error('送信エラー:', error);
                    formStatus.textContent = '送信に失敗しました。時間をおいて再度お試しください。';
                    formStatus.classList.add('error');
                } finally {
                    // 処理が終わったらボタンの状態を元に戻す
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }
            });
        }
    };

    /* ==========================================================================
       6. 各種コンポーネントの読み込み実行
       ========================================================================== */
    // 6-1. ヘッダーの読み込み（挿入後にダークモードとスクロールのイベントを紐付け）
    // ※トップページ・下層ページ（about, works）すべてのページ共通のルーティングとして機能します
    loadComponent('common-header', '/components/header.html', () => {
        initDarkModeToggle();
        initSmoothScroll();
    });

    // 6-2. フッターの読み込み
    loadComponent('common-footer', '/components/footer.html');

    // 6-3. お問い合わせフォームの読み込み（挿入後にフェードイン監視の追加と送信イベントの紐付け）
    loadComponent('common-contact', '/components/contact.html', (container) => {
        const newFadeElements = container.querySelectorAll('.js-fade-element');
        newFadeElements.forEach(element => {
            fadeObserver.observe(element);
        });
        initContactForm();
    });

});