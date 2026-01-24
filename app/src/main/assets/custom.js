window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug

// ========== 新增代码开始 ==========
// 添加一个标志，记录页面是否已初始化
let isPageInitialized = false;

// 页面加载完成后标记为已初始化
window.addEventListener('load', () => {
    setTimeout(() => {
        isPageInitialized = true;
        console.log('Page initialized, starting link interception');
    }, 800); // 延迟800ms确保首页完全加载
});
// ========== 新增代码结束 ==========

const hookClick = (e) => {
    // ========== 新增代码开始 ==========
    // 如果页面未初始化，不拦截任何点击
    if (!isPageInitialized) {
        console.log('Page not initialized yet, skip interception');
        return;
    }
    
    // 检查是否是用户真实的点击，避免JavaScript自动触发的点击
    if (!e.isTrusted) {
        console.log('Not a user-triggered click, skip');
        return;
    }
    // ========== 新增代码结束 ==========
    
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    
    // ========== 新增代码开始 ==========
    // 检查链接是否有效，避免拦截特殊链接
    if (origin && origin.href) {
        const href = origin.getAttribute('href');
        // 跳过无效或特殊协议链接
        if (!href || 
            href === '#' || 
            href.startsWith('javascript:') || 
            href.startsWith('mailto:') || 
            href.startsWith('tel:') ||
            href.startsWith('blob:') ||
            href.startsWith('data:')) {
            console.log('Special link or anchor, skip');
            return;
        }
        
        // 如果是当前页面，不处理（避免首页重新加载）
        if (origin.href === window.location.href || 
            href === '/' || 
            href === '/index.html' ||
            href === window.location.pathname) {
            console.log('Same page link, skip');
            return;
        }
    }
    // ========== 新增代码结束 ==========
    
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

// ========== 新增代码开始 ==========
// 保存原始的window.open函数
const originalWindowOpen = window.open;
// ========== 新增代码结束 ==========

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    
    // ========== 新增代码开始 ==========
    // 如果是无效URL、首页、空白页或当前页面，使用原始方法
    if (!url || 
        url === window.location.href || 
        url === '/' || 
        url.includes('about:blank') ||
        url === 'undefined' ||
        url === 'null') {
        console.log('Home/blank page or same URL, use original open');
        return originalWindowOpen.call(this, url, target, features);
    }
    
    // 检查是否是特殊协议
    if (url.startsWith('javascript:') || 
        url.startsWith('mailto:') || 
        url.startsWith('tel:') ||
        url.startsWith('blob:') ||
        url.startsWith('data:')) {
        console.log('Special protocol, use original open');
        return originalWindowOpen.call(this, url, target, features);
    }
    
    // 只有在页面初始化后才拦截
    if (isPageInitialized) {
        location.href = url;
        return null;
    } else {
        console.log('Page not initialized, use original open');
        return originalWindowOpen.call(this, url, target, features);
    }
    // ========== 新增代码结束 ==========
}

// ========== 新增代码开始 ==========
// 延迟绑定点击事件，避免首页加载时被拦截
setTimeout(() => {
    document.addEventListener('click', hookClick, { capture: true });
    console.log('Click event listener added');
}, 1000); // 等待1秒后再绑定事件
// ========== 新增代码结束 ==========