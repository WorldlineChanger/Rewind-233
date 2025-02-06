// ==UserScript==
// @name        B站弹幕替换：曾经的233
// @icon        https://www.bilibili.com/favicon.ico
// @namespace   Violentmonkey Scripts
// @match       *://*.bilibili.com/*
// @grant       none
// @version     1.0
// @author      青空
// @description 将B站弹幕池中大于等于四个连续的“哈”转换为相应数量的“2333”。曾经弹幕池中常见的233，随着新生代的到来似乎逐渐销声匿迹了。对一部分人来说，如今满屏的“哈哈哈”既令人唏嘘，又影响视频有效面积，脚本因此诞生。233来源于猫扑表情第233号，是一张捶地大笑的表情，常用来表示哈哈大笑的意思。
// ==/UserScript==

(function() {
    'use strict';

    // 新版弹幕选择器
    const DANMAKU_ITEM_CLASS = 'bili-danmaku-x-dm';

    // 弹幕替换核心逻辑
    const replaceDanmaku = (text) => {
        return text.replace(/哈{4,}/g, match => '2' + '3'.repeat(match.length - 1));
    };

    // 弹幕处理器
    const processDanmaku = (danmakuNode) => {
        const originalText = danmakuNode.textContent;
        const newText = replaceDanmaku(originalText);
        if (newText !== originalText) {
            // 保留原始样式和动画属性
            danmakuNode.textContent = newText;
        }
    };

    // 动态监听器
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.classList?.contains(DANMAKU_ITEM_CLASS)) {
                    processDanmaku(node);
                }
            });
        });
    });

    // 初始化扫描
    const init = () => {
        // 扫描现有弹幕
        document.querySelectorAll(`.${DANMAKU_ITEM_CLASS}`).forEach(processDanmaku);

        // 监听动态弹幕
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    };

    // 启动监听
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
