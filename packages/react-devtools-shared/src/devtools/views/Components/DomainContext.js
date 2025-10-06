/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

type DomainContextType = {
    currentDomain: string,
    setCurrentDomain: (domain: string) => void,
};

const DomainContext = createContext < DomainContextType > ({
    currentDomain: 'default',
    setCurrentDomain: () => { },
});

type Props = {
    children: React.Node,
    initialDomain?: string,
};

export function DomainContextProvider({
    children,
    initialDomain = 'default',
}: Props): React.Node {
    const [currentDomain, setCurrentDomain] = useState < string > (initialDomain);

    return (
        <DomainContext.Provider value={{ currentDomain, setCurrentDomain }}>
            {children}
        </DomainContext.Provider>
    );
}

export function useDomain(): DomainContextType {
    return useContext(DomainContext);
}

export default DomainContext;

