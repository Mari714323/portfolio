import { injectCommonHead, loadComponent, initDarkModeToggle, initContactForm } from './components.js';
import { playLoadingAnimation, initSmoothScroll, initObservers } from './animations.js';
import { countView } from './api.js';

// 1. 共通の<head>タグ（フォント等）を動的注入
injectCommonHead();

// 2. ダークモードの初期適用（ロード直後のチラつき防止）
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.body.classList.add(currentTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    // ローディングアニメーション実行
    playLoadingAnimation();

    // 閲覧カウンターAPI実行
    countView();

    // 共通コンポーネントの読み込みと個別機能の紐付け
    loadComponent('common-header', '/components/header.html', () => {
        initDarkModeToggle();
        initSmoothScroll();
    });

    loadComponent('common-footer', '/components/footer.html');

    loadComponent('common-contact', '/components/contact.html', (container) => {
        initContactForm(container);
        initObservers(container); // 動的に挿入された要素を監視対象に追加
    });

    // 既存DOMのアニメーション監視を初期化
    initObservers(document);
});