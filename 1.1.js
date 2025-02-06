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
    const DANMAKU_CONTAINER_SELECTOR = '.bpx-player-dm-wrap'; // 弹幕容器选择器
    const DANMAKU_ITEM_SELECTOR = '.bpx-player-dm';          // 单个弹幕选择器

    // 弹幕替换函数
    function replaceDanmaku(text) {
        return text.replace(/哈{4,}/g, match => {
            return '2' + '3'.repeat(match.length - 1); // 生成对应位数的2333
        });
    }

    // 递归处理DOM节点
    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const newText = replaceDanmaku(node.nodeValue);
            if (newText !== node.nodeValue) {
                node.nodeValue = newText;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const child of node.childNodes) {
                processNode(child);
            }
        }
    }

    // 初始化MutationObserver
    function initObserver() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.matches?.(DANMAKU_ITEM_SELECTOR)) {
                        processNode(node);
                    }
                }
            }
        });

        const container = document.querySelector(DANMAKU_CONTAINER_SELECTOR);
        if (container) {
            // 处理现有弹幕
            container.querySelectorAll(DANMAKU_ITEM_SELECTOR).forEach(processNode);
            // 监听新弹幕
            observer.observe(container, {
                childList: true,
                subtree: true
            });
        } else {
            // 容器未加载时重试
            setTimeout(initObserver, 1000);
        }
    }

    // 启动监听
    initObserver();
})();
