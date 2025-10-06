/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react';
import { useState, useContext, useCallback, useEffect } from 'react';

import SearchInput from 'react-devtools-shared/src/devtools/views/SearchInput';
import {
  TreeDispatcherContext,
  TreeStateContext,
} from 'react-devtools-shared/src/devtools/views/Components/TreeContext';
import {
  localStorageGetItem,
  localStorageSetItem,
} from 'react-devtools-shared/src/storage';
import { useDomain } from './DomainContext';
import { getSearchKeyForDomain } from '../../utils/domainUtils';

const LOCAL_STORAGE_SEARCH_KEY = 'React::DevTools::componentSearchText';

export default function ComponentSearchInput(): React.Node {
  const { currentDomain } = useDomain();
  const { searchIndex, searchResults } = useContext(TreeStateContext);
  const transitionDispatch = useContext(TreeDispatcherContext);

  // 生成当前域名对应的 localStorage key
  const storageKey = getSearchKeyForDomain(currentDomain);

  // 从 localStorage 读取初始值（基于当前域名）
  const [localSearchQuery, setLocalSearchQuery] = useState(() => {
    return localStorageGetItem(storageKey) || '';
  });

  // 当域名变化时，加载对应域名的搜索历史
  useEffect(() => {
    const domainSearchQuery = localStorageGetItem(storageKey) || '';
    setLocalSearchQuery(domainSearchQuery);
    // 如果有缓存的搜索内容，触发搜索
    if (domainSearchQuery) {
      transitionDispatch({ type: 'SET_SEARCH_TEXT', payload: domainSearchQuery });
    } else {
      // 清空搜索
      transitionDispatch({ type: 'SET_SEARCH_TEXT', payload: '' });
    }
  }, [currentDomain, storageKey, transitionDispatch]);

  // 当搜索内容变化时，保存到 localStorage（使用当前域名的 key）
  useEffect(() => {
    localStorageSetItem(storageKey, localSearchQuery);
  }, [localSearchQuery, storageKey]);

  const search = useCallback(
    (text: string) => {
      // 过滤输入：只允许 ASCII 字母、数字、空格和正则表达式常用字符
      // 允许的字符：a-z A-Z 0-9 空格 / . * + ? ^ $ { } [ ] ( ) | \ - _
      const filteredText = text.replace(/[^\x00-\x7F]/g, '');

      setLocalSearchQuery(filteredText);
      transitionDispatch({ type: 'SET_SEARCH_TEXT', payload: filteredText });
    },
    [setLocalSearchQuery, transitionDispatch],
  );
  const goToNextResult = useCallback(
    () => transitionDispatch({ type: 'GO_TO_NEXT_SEARCH_RESULT' }),
    [transitionDispatch],
  );
  const goToPreviousResult = useCallback(
    () => transitionDispatch({ type: 'GO_TO_PREVIOUS_SEARCH_RESULT' }),
    [transitionDispatch],
  );

  return (
    <SearchInput
      goToNextResult={goToNextResult}
      goToPreviousResult={goToPreviousResult}
      placeholder="Search (text or /regex/)"
      search={search}
      searchIndex={searchIndex}
      searchResultsCount={searchResults.length}
      searchText={localSearchQuery}
      testName="ComponentSearchInput"
    />
  );
}
