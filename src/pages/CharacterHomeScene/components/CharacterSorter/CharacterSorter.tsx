import React, { useState } from "react";
import "./CharacterSorter.css";

interface CharacterSorterProps {
    onSort: (fields: string[]) => void;
}

export const CharacterSorter: React.FC<CharacterSorterProps> = (props): React.JSX.Element => {
    const [fields, setFields] = useState<string[]>([]);

    const { onSort } = props;

    const sorters = [
        { key: 'affiliation', label: 'Affiliation' },
        { key: 'gender', label: 'Gender' },
        { key: 'name', label: 'Name' },
        { key: 'race', label: 'Race' },
    ];

    const handleOnCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.currentTarget.checked;
        const value = event.currentTarget.value;

        if (!isChecked && fields.length === 0) {
            onSort([]);
            return;
        }

        setFields([value]);
    }

    const handleOnClick = () => {
        if (fields.length > 0) {
            onSort(fields);
        }
    }

    return (
        <div style={{ textAlign: 'left' }}>
            <h3>Sort alphabetycally by:</h3>
            <div style={{ display: 'flex', flexFlow: 'column' }}>
                {sorters.map((sorter, index) => (
                    <label htmlFor={`sorter_item_${sorter.key}`} key={`sorter_item_${index}`}>
                        <input
                            name="radio_sorteable_attributes"
                            type="radio"
                            id={`sorter_item_${sorter.key}`}
                            value={sorter.key}
                            onChange={handleOnCheck}
                        />
                        {sorter.label}
                    </label>
                ))}
            </div>
            <button onClick={handleOnClick} name="btn_sort" id="btn_sort">
                Sort
            </button>
        </div>
    );
}