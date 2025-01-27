'use client'

import {Pagination} from "@mui/material";
import { useRouter } from 'next/navigation';
import './PaginationLists.css';
import React, {ChangeEvent} from "react";

export default function PaginationLists({pagesCount, topicId, page}: any) {
    const [currentWidth, setCurrentWidth] = React.useState(1000);
    const router = useRouter();

    const clickHandler = (event: ChangeEvent<unknown>, nPage: number) => {
        event.preventDefault();
        router.push(`/uezdy/${topicId}/${nPage}`);
    };

    React.useEffect(() => {
        setCurrentWidth(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
    }, []);

    return pagesCount > 1 ? <Pagination
        size="small"
        className="pagination-native-mui"
        count={pagesCount}
        boundaryCount={currentWidth < 700 && pagesCount > 10 ? 1 : 3}
        siblingCount={currentWidth < 700 && pagesCount > 10 ? 1 : 3}
        defaultPage={+page || 1}
        onChange={clickHandler}
    /> : <></>
};
