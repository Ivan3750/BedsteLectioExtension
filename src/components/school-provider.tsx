import React, { createContext, useContext } from 'react';
import useLocalState from './useLocalState';

type School = {
    id: string;
    name: string;
};

const SchoolContext = createContext<{
    school: School | null;
    setSchool: (school: School) => void;
}>({ school: null, setSchool: () => null });

export const SchoolProvider = (props: { children: React.ReactNode }) => {
    const [school, setSchool] = useLocalState<{ id: string; name: string } | null>('bedstelectio-school', null);

    return <SchoolContext.Provider value={{ school, setSchool }}>{props.children}</SchoolContext.Provider>;
};

export const useSchool = () => useContext(SchoolContext);
