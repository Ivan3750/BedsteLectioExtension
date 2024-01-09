import { runtime, tabs } from 'webextension-polyfill';

runtime.onInstalled.addListener(() => {
    console.log('[===== Installed Extension!] =====');
    tabs.create({ url: 'https://www.google.com' });
});
