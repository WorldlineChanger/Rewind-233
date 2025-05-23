// ==UserScript==
// @name        B站弹幕替换：让“哈哈哈”回到曾经的2333
// @icon        https://www.bilibili.com/favicon.ico
// @namespace   https://github.com/WorldlineChanger/Rewind-233
// @match       *://*.bilibili.com/*
// @grant       none
// @license     MIT
// @version     1.1
// @author      WorldlineChanger
// @description 将B站弹幕池中大于等于四个连续的“哈”替换为相应数量的“2333”。
// ==/UserScript==

(function() {
  'use strict';
 
  // 1. 首次处理页面已有弹幕
  document.querySelectorAll('.bili-danmaku-x-dm').forEach(node => {
    node.innerText = node.innerText.replace(/哈{4,}/g, m =>
      '2' + '3'.repeat(m.length - 1)
    );
  });
 
  // 2. 监控新插入的弹幕节点
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.matches('.bili-danmaku-x-dm')) {
          node.innerText = node.innerText.replace(/哈{4,}/g, m =>
            '2' + '3'.repeat(m.length - 1)
          );
        }
      });
    }
  });
 
  // 监听整个文档树的新增节点
  observer.observe(document.body, { childList: true, subtree: true });
})();
