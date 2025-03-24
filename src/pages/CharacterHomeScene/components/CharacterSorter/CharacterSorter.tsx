import React, { useState, useRef } from "react";
import "./CharacterSorter.css";

interface CharacterSorterProps {
    onSort: (fields: string[]) => void;
}

const CharacterSorter: React.FC<CharacterSorterProps> = (props): React.JSX.Element => {
    const formRef = useRef<HTMLFormElement>(null);
    const [fields, setFields] = useState<string[]>([]);

    const { onSort } = props;

    const sorters = [
        { key: "affiliation", label: "Affiliation" },
        { key: "gender", label: "People" },
        { key: "name", label: "Name" },
        { key: "race", label: "Origin" },
    ];

    const handleOnCheckSorter = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.currentTarget.checked;
        const value = event.currentTarget.value;

        if (!isChecked && fields.length === 0) {
            onSort([]);
            return;
        }

        setFields([value]);
    }

    const handleOnSort = () => {
        if (fields.length > 0) {
            onSort(fields);
        }
    }

    const handleOnClear = () => {
        formRef?.current?.reset();
        setFields([]);
        onSort([]);
    }

    return (
        <div className="character-sorter">
            <form ref={formRef}>
                <h3 className="title">Sort alphabetycally:</h3>
                <div className="character-sorter__checkbox-list-container">
                    {sorters.map((sorter, index) => (
                        <label htmlFor={`sorter_item_${sorter.key}`} key={`sorter_item_${index}`}>
                            <input
                                name="radio_sorteable_attributes"
                                type="radio"
                                id={`sorter_item_${sorter.key}`}
                                value={sorter.key}
                                onChange={handleOnCheckSorter}
                            />
                            {sorter.label}
                        </label>
                    ))}
                </div>
                <div className="character-sorter__buttons-container">
                    <button
                        name="btn_sort"
                        id="btn_sort"
                        onClick={handleOnSort}
                        type="button"
                        className="primary-btn"
                        aria-label="Apply sort filter">
                        Sort
                    </button>
                    <button
                        name="btn_clear"
                        id="btn_clear"
                        onClick={handleOnClear}
                        type="reset"
                        className="link-btn"
                        aria-label="Clear filters">
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CharacterSorter;