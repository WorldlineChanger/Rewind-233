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

    // 配置参数
    const DANMAKU_CONTAINER_SELECTOR = '.bpx-player-danmaku-wrap';
    const DANMAKU_ITEM_SELECTOR = '.bpx-player-danmaku-item';

    // 弹幕替换逻辑
    function replaceDanmaku(text) {
        return text.replace(/哈{4,}/g, match => '2' + '3'.repeat(match.length - 1));
    }

    // 处理DOM节点
    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const newText = replaceDanmaku(node.nodeValue);
            if (newText !== node.nodeValue) node.nodeValue = newText;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(processNode);
        }
    }

    // 监听DOM变化
    function initObserver(container) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.matches?.(DANMAKU_ITEM_SELECTOR)) processNode(node);
                    });
                }
            });
        });
        observer.observe(container, { childList: true, subtree: true });
    }

    // 主入口
    function main() {
        const container = document.querySelector(DANMAKU_CONTAINER_SELECTOR);
        if (container) {
            initObserver(container);
            container.querySelectorAll(DANMAKU_ITEM_SELECTOR).forEach(processNode);
        } else {
            setTimeout(main, 1000); // 延迟重试
        }
    }

    // 启动
    main();
})();
