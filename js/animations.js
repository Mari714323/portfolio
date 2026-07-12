import { TERMINAL_LINES } from './config.js';

export const playLoadingAnimation = async () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    const line1 = document.getElementById('loading-line-1');
    const line2 = document.getElementById('loading-line-2');
    const line3 = document.getElementById('loading-line-3');

    if (!loadingOverlay || !line1 || !line2 || !line3) return;
    if (window.isLoadingPlayed) return;
    window.isLoadingPlayed = true;

    line1.textContent = '';
    line2.textContent = '';
    line3.textContent = '';

    const typeText = async (element, text, speed = 40) => {
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await new Promise(r => setTimeout(r, speed));
        }
    };

    await new Promise(r => setTimeout(r, 200));
    await typeText(line1, 'LOADING...', 40);
    await new Promise(r => setTimeout(r, 200));
    await typeText(line2, '[ OK ]', 40);
    await new Promise(r => setTimeout(r, 300));
    await typeText(line3, 'Welcome!', 60);
    await new Promise(r => setTimeout(r, 800));

    loadingOverlay.classList.add('is-loaded');
    setTimeout(() => document.dispatchEvent(new Event('loadingComplete')), 600);
};

export const initSmoothScroll = () => {
    const siteHeader = document.querySelector('.site-header');
    const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
    const anchorLinks = document.querySelectorAll('a[href^="#"], a[href^="/#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const isTopPage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') || window.location.pathname === '';

            if (href.startsWith('#') || (href.startsWith('/#') && isTopPage)) {
                const targetId = href.startsWith('/#') ? href.replace(/^\/#/, '#') : href;
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
        });
    });
};

const typeLines = async (element, lines) => {
    if (!element) return;
    element.innerHTML = '';
    for (const line of lines) {
        const lineDiv = document.createElement('div');
        lineDiv.style.color = line.color || '#a9b7c6';
        element.appendChild(lineDiv);
        for (let i = 0; i < line.text.length; i++) {
            lineDiv.textContent += line.text[i];
            await new Promise(r => setTimeout(r, 25));
        }
        await new Promise(r => setTimeout(r, 500));
    }
};

export const initObservers = (rootElement = document) => {
    // 1つのObserverでフェードインとターミナル両方を監視
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                // フェードイン処理
                if (el.classList.contains('js-fade-element')) {
                    el.classList.add('is-visible');
                }
                
                // ターミナルアニメーション処理（クラス名でデータを判定）
                let terminalKey = null;
                if (el.classList.contains('js-terminal-mv')) terminalKey = 'mv';
                else if (el.classList.contains('js-terminal-cert')) terminalKey = 'cert';
                else if (el.classList.contains('js-terminal-career')) terminalKey = 'career';
                else if (el.classList.contains('js-terminal-skills')) terminalKey = 'skills';

                if (terminalKey && TERMINAL_LINES[terminalKey]) {
                    const bodyEl = el.querySelector('.terminal-body');
                    if (bodyEl) typeLines(bodyEl, TERMINAL_LINES[terminalKey]);
                }
                
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.15 });

    // MV以外の監視対象を登録
    const targets = rootElement.querySelectorAll('.js-fade-element, .js-terminal-cert, .js-terminal-career, .js-terminal-skills');
    targets.forEach(el => observer.observe(el));

    // ルート（初期読み込み時）の場合は、ローディング完了後にMVのターミナル監視を開始
    if (rootElement === document) {
        document.addEventListener('loadingComplete', () => {
            const mvTargets = document.querySelectorAll('.js-terminal-mv');
            mvTargets.forEach(el => observer.observe(el));
        });
    }
};