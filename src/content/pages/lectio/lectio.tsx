import React, { useState } from 'react';
import Fuse from 'fuse.js';
import { extractSchools } from './extractor';
import { Input } from 'components/input';
import { Card, CardDescription, CardHeader, CardTitle } from 'components/card';
import { useSchool } from 'components/school-provider';

export const LectioPage = (props: { originalContent: Document }) => {
    const { school, setSchool } = useSchool();
    if (school) {
        location.href = 'https://www.lectio.dk/lectio/' + school.id + '/login.aspx';
    }

    const schools = extractSchools(props.originalContent);
    const search = new Fuse(schools, { keys: ['name', 'id'] });
    const [filteredSchools, setFilteredSchools] = useState(schools);

    const searchSchools = (value: string) => {
        if (value === '') {
            setFilteredSchools(schools);
        } else {
            setFilteredSchools(search.search(value).map((result) => result.item));
        }
    };

    return (
        <div className="page-container">
            <div>
                <h1 className="mb-2">BedsteLectio</h1>
                <p className="mt-0">Velkommen til BedsteLectio, vælg venligst din skole.</p>
                <Input
                    onChange={(e) => searchSchools(e.target.value)}
                    className="mb-2"
                    placeholder="Søg efter skoler..."
                />
                <div className="space-y-2">
                    {filteredSchools.map((entry) => (
                        <Card
                            onClick={() => {
                                setSchool(entry);
                                location.href = 'https://www.lectio.dk/lectio/' + entry.id + '/login.aspx';
                            }}
                            className="cursor-pointer"
                            key={entry.id}
                        >
                            <CardHeader>
                                <CardTitle>{entry.name}</CardTitle>
                                <CardDescription>{entry.id}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
