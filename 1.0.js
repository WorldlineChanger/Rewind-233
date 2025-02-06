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

    // 延时以确保弹幕加载完成
    function replaceDanmu() {
        // 获取所有弹幕的节点（不同页面的弹幕DOM结构可能不同，需灵活处理）
        const danmuList = document.querySelectorAll('.bui-comment-item');  // 常见弹幕节点类

        danmuList.forEach(danmu => {
            const danmuText = danmu.innerText;
            const regex = /(哈哈哈哈+)/g;

            if (regex.test(danmuText)) {
                // 计算原有“哈”的数量并生成相应数量的“2333”
                const length = danmuText.match(/哈/g).length;
                const newDanmu = '2' + '3'.repeat(length - 1);
                danmu.innerText = newDanmu;
            }
        });
    }

    // 监听DOM变动，确保新弹幕也能被替换
    const observer = new MutationObserver(() => {
        replaceDanmu();
    });

    // 监听弹幕容器变化（根据实际弹幕DOM结构，可能需要调整选择器）
    const targetNode = document.querySelector('.bui-comment'); // 常见弹幕容器类
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    // 初次运行
    setTimeout(replaceDanmu, 3000); // 初次执行函数，确保弹幕加载
})();
