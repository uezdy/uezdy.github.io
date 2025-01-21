'use client'
import React from "react";

export default function TopicsMenu({topics}: any) {
    const [tops, setTops] = React.useState([]);
    React.useEffect(() => {
        if (topics) {
            setTops(topics);
        }
    }, [topics])
    return <>
        <div>
            {
                tops.map((top: any) => <div key={top.id}>{top.title}</div>)
            }
        </div>
    </>
};
