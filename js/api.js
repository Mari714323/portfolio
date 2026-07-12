import { API_ENDPOINTS } from './config.js';

export const countView = async () => {
    try {
        console.log('[Mock] 閲覧カウンター: API Gatewayへリクエストを送信中...');
        console.log('[Mock] 閲覧カウンター: DynamoDBのカウントを裏側で+1しました。');
    } catch (error) {
        console.error('カウンターAPIエラー:', error);
    }
};

export const sendContact = async (formData) => {
    console.log('お問い合わせ: API Gatewayへ以下のデータを送信中...', formData);
    const response = await fetch(API_ENDPOINTS.CONTACT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
};