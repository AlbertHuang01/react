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

const LOCAL_STORAGE_SEARCH_KEY = 'React::DevTools::componentSearchText';

export default function ComponentSearchInput(): React.Node {
  // 从 localStorage 读取初始值
  const [localSearchQuery, setLocalSearchQuery] = useState(() => {
    return localStorageGetItem(LOCAL_STORAGE_SEARCH_KEY) || '';
  });
  const { searchIndex, searchResults } = useContext(TreeStateContext);
  const transitionDispatch = useContext(TreeDispatcherContext);

  // 当搜索内容变化时，保存到 localStorage
  useEffect(() => {
    localStorageSetItem(LOCAL_STORAGE_SEARCH_KEY, localSearchQuery);
  }, [localSearchQuery]);

  // 初始化时如果有缓存的搜索内容，触发搜索
  useEffect(() => {
    if (localSearchQuery) {
      transitionDispatch({ type: 'SET_SEARCH_TEXT', payload: localSearchQuery });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在组件挂载时执行一次

  const search = useCallback(
    (text: string) => {
      setLocalSearchQuery(text);
      transitionDispatch({ type: 'SET_SEARCH_TEXT', payload: text });
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
