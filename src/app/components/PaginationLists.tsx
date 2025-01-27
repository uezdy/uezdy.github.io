'use client'

import {Pagination} from "@mui/material";
import { useRouter } from 'next/navigation';
import './PaginationLists.css';
import {ChangeEvent} from "react";

export default function PaginationLists({pagesCount, topicId, page}: any) {
    const router = useRouter();

    const clickHandler = (event: ChangeEvent<unknown>, nPage: number) => {
        event.preventDefault();
        router.push(`/uezdy/${topicId}/${nPage}`);
    };

    return pagesCount ? <Pagination
        size="small"
        hidePrevButton
        hideNextButton
        className="pagination-native-mui"
        count={pagesCount}
        boundaryCount={3}
        siblingCount={0}
        defaultPage={+page || 1}
        onChange={clickHandler}
    /> : <></>
};

/*
<Button key={index} disabled={+page === (index + 1)}><Link href={`/uezdy/${topicId}/${index + 1}`}>{index + 1}</Link></Button>
* */
