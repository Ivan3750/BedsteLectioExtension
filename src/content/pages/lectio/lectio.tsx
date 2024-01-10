import React, { useContext, useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import { extractSchools } from './extractor';
import { Input } from 'components/input';
import { Card, CardHeader, CardTitle } from 'components/card';
import { SchoolContext } from 'content/index';

export const LectioPage = (props: { originalContent: Document }) => {
    const [school, setSchool] = useContext(SchoolContext);

    const schools = extractSchools(props.originalContent);
    const search = new Fuse(schools, { keys: ['name'] });
    const [searchString, setSearchString] = useState('');
    const [filteredSchools, setFilteredSchools] = useState(schools);

    useEffect(() => {
        if (searchString === '') {
            setFilteredSchools(schools);
        } else {
            setFilteredSchools(search.search(searchString).map((result) => result.item));
        }
    }, [searchString, schools]);

    return (
        <div className="page-container">
            <div>
                <h1 className="mb-2">BedsteLectio</h1>
                <p className="mt-0">Velkommen til BedsteLectio, vælg venligst din skole.</p>
                <Input
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                    placeholder="Søg efter skoler..."
                />
                {filteredSchools.map((school) => (
                    <Card
                        onClick={() => {
                            setSchool(school);
                            location.href = 'https://www.lectio.dk/lectio/' + school.id + '/login.aspx';
                        }}
                        key={school.id}
                    >
                        <CardHeader>
                            <CardTitle>{school.name}</CardTitle>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
};
