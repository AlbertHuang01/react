/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/**
 * 从 URL 中提取域名
 * 支持标准 URL、localhost、IP 地址等
 */
export function extractDomainFromURL(url: string): string {
    if (!url) {
        return 'default';
    }

    try {
        // 处理特殊协议
        if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
            return 'chrome-internal';
        }
        if (url.startsWith('about:')) {
            return 'about-page';
        }
        if (url.startsWith('file://')) {
            return 'file-system';
        }

        // 解析标准 URL
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        const port = urlObj.port;

        // 如果有端口号，包含在域名中（对于 localhost 和开发环境很重要）
        if (port && port !== '80' && port !== '443') {
            return `${hostname}:${port}`;
        }

        return hostname || 'default';
    } catch (error) {
        // URL 解析失败，返回默认值
        console.warn('Failed to parse URL for domain extraction:', url, error);
        return 'default';
    }
}

/**
 * 生成带域名的 localStorage key
 */
export function getSearchKeyForDomain(domain: string): string {
    const baseKey = 'React::DevTools::componentSearchText';

    // 对于默认域名，使用原始 key 格式
    if (domain === 'default') {
        return baseKey;
    }

    // 清理域名，移除可能导致问题的字符
    const sanitizedDomain = domain.replace(/[^a-zA-Z0-9.:_-]/g, '-');

    return `${baseKey}::${sanitizedDomain}`;
}

