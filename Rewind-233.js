// ==UserScript==
// @name        B站弹幕替换：让“哈哈哈”回到曾经的2333
// @icon        https://www.bilibili.com/favicon.ico
// @namespace   https://github.com/WorldlineChanger/Rewind-233
// @match       *://*.bilibili.com/*
// @grant       none
// @license     MIT
// @version     1.3
// @author      WorldlineChanger
// @description 将B站弹幕池中大于等于四个连续的“哈”替换为相应数量的“2333”。
// ==/UserScript==

(function() {
  'use strict';

  /**
   * 对一个弹幕容器 element，遍历其所有 TextNode 并替换连续4个以上“哈”
   * 使用 TreeWalker 可精确到文本节点，不会扁平化子元素结构 :contentReference[oaicite:0]{index=0}
   */
  function replaceInContainer(element) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node;
    while (node = walker.nextNode()) {
      node.nodeValue = node.nodeValue.replace(/哈{4,}/g, m =>
        '2' + '3'.repeat(m.length - 1)
      );
    }
  }

  /** 全量扫描页面上所有弹幕容器 */
  function scanAllDanmaku() {
    document
      .querySelectorAll('.bili-danmaku-x-dm')
      .forEach(el => replaceInContainer(el));
  }

  // —— 1. 初次运行，替换已有弹幕
  scanAllDanmaku();

  // —— 2. MutationObserver：增量捕获新插入的弹幕容器
  const observer = new MutationObserver(muts => {
    for (const m of muts) {
      m.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        // 如果新增的是整个弹幕容器
        if (node.matches('.bili-danmaku-x-dm')) {
          replaceInContainer(node);
        }
        // 或者在其子树深处插入了弹幕容器
        else {
          node.querySelectorAll &&
            node.querySelectorAll('.bili-danmaku-x-dm')
                .forEach(el => replaceInContainer(el));
        }
      });
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // —— 3. 监听视频 seeked：B 站会重建弹幕，此时全量再来一次
  const video = document.querySelector('video');
  if (video) {
    video.addEventListener('seeked', scanAllDanmaku);
  }

  // —— 4. 保险：每 500ms 全量一次，防漏网喵
  setInterval(scanAllDanmaku, 500);

})();
