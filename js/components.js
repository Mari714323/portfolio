import { sendContact } from './api.js';

// フォントとアイコンのタグを動的に挿入する処理
export const injectCommonHead = () => {
    const fontPreconnect1 = document.createElement('link');
    fontPreconnect1.rel = 'preconnect';
    fontPreconnect1.href = 'https://fonts.googleapis.com';

    const fontPreconnect2 = document.createElement('link');
    fontPreconnect2.rel = 'preconnect';
    fontPreconnect2.href = 'https://fonts.gstatic.com';
    fontPreconnect2.crossOrigin = '';

    const fontCss = document.createElement('link');
    fontCss.rel = 'stylesheet';
    fontCss.href = 'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&family=DotGothic16&family=Share+Tech+Mono&display=swap';

    const iconCss = document.createElement('link');
    iconCss.rel = 'stylesheet';
    iconCss.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';

    document.head.append(fontPreconnect1, fontPreconnect2, fontCss, iconCss);
};

export const initDarkModeToggle = () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    if (!themeToggleBtn || !themeIcon) return;

    if (document.body.classList.contains('dark-mode')) {
        themeIcon.textContent = 'light_mode';
    } else {
        themeIcon.textContent = 'dark_mode';
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.textContent = 'light_mode';
            localStorage.setItem('theme', 'dark-mode');
        } else {
            themeIcon.textContent = 'dark_mode';
            localStorage.setItem('theme', '');
        }
    });
};

export const loadComponent = async (containerId, filePath, successCallback = null) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTMLの取得に失敗しました: ${response.statusText}`);
        const html = await response.text();
        
        container.innerHTML = html;

        if (successCallback) {
            successCallback(container);
        }
    } catch (error) {
        console.error(`コンポーネント [${containerId}] の読み込みエラー:`, error);
        container.innerHTML = `<p style="text-align: center; padding: 20px; color: var(--text-muted);">パーツの読み込みに失敗しました。</p>`;
    }
};

export const initContactForm = (container) => {
    const contactForm = container.querySelector('#contact-form');
    const formStatus = container.querySelector('#form-status');
    const submitBtn = container.querySelector('#submit-btn');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = '送信中...';
        submitBtn.disabled = true;
        formStatus.className = 'form-status';

        const formData = {
            name: container.querySelector('#name').value,
            email: container.querySelector('#email').value,
            subject: container.querySelector('#subject').value,
            message: container.querySelector('#message').value
        };

        try {
            await sendContact(formData);
            formStatus.textContent = 'お問い合わせを受け付けました。追ってご連絡いたします。';
            formStatus.classList.add('success');
            contactForm.reset();
        } catch (error) {
            console.error('送信エラー:', error);
            formStatus.textContent = '送信に失敗しました。時間をおいて再度お試しください。';
            formStatus.classList.add('error');
        } finally {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });
};