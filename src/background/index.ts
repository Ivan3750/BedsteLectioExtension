import { runtime, tabs } from 'webextension-polyfill';

/**
 * Define background script functions
 * @type {class}
 */
class Background {
    _port: number;
    constructor() {
        this.init();
    }

    /**
     * Document Ready
     *
     * @returns {void}
     */
    init = () => {
        console.log('[===== Loaded Background Scripts =====]');

        //When extension installed
        runtime.onInstalled.addListener(this.onInstalled);
    };

    /**
     * Extension Installed
     */
    onInstalled = () => {
        console.log('[===== Installed Extension!] =====');
        tabs.create({ url: 'https://www.google.com' });
    };
}

export const background = new Background();
