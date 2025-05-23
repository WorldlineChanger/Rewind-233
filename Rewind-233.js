// ==UserScript==
// @name        B站弹幕替换：让“哈哈哈”回到曾经的2333
// @icon        https://www.bilibili.com/favicon.ico
// @namespace   https://github.com/WorldlineChanger/Rewind-233
// @match       *://*.bilibili.com/*
// @grant       none
// @license     MIT
// @version     1.2
// @author      WorldlineChanger
// @description 将B站弹幕池中大于等于四个连续的“哈”替换为相应数量的“2333”。
// ==/UserScript==

(function() {
  'use strict';
 
  // 替换函数
  function replaceText(node) {
    node.innerText = node.innerText.replace(/哈{4,}/g, m =>
      '2' + '3'.repeat(m.length - 1)
    );
  }
 
  // 全量扫描
  function scanAllDanmaku() {
    document.querySelectorAll('[class*="bili-danmaku-x-dm"]').forEach(replaceText);
  }
 
  // 初次替换已有弹幕
  scanAllDanmaku();
 
  // 1. MutationObserver
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.matches('[class*="bili-danmaku-x-dm"]')) {
          replaceText(node);
        }
      });
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true
  });
 
  // 2. 绑定 seeked 事件
  const video = document.querySelector('video');
  if (video) {
    video.addEventListener('seeked', scanAllDanmaku);
  }
 
  // 3. 周期扫描
  setInterval(scanAllDanmaku, 500);
  // 或使用 requestAnimationFrame:
  // function loop() { scanAllDanmaku(); requestAnimationFrame(loop); }
  // requestAnimationFrame(loop);
 
})();
