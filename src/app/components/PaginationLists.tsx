'use client'

import {Pagination, PaginationItem, PaginationRenderItemParams} from "@mui/material";
import { useRouter } from 'next/navigation';
import './PaginationLists.css';

export default function PaginationLists({pagesCount, topicId, page}: any) {
    const router = useRouter();

    const clickHandler = (event: React.ChangeEvent, nPage: number) => {
        event.preventDefault();
        router.push(`/uezdy/${topicId}/${nPage}`);
    };

    return <Pagination
        className="pagination-native-mui"
        count={pagesCount}
        boundaryCount={1}
        siblingCount={1}
        defaultPage={+page || 1}
        onChange={clickHandler}
    />
};

/*
<Button key={index} disabled={+page === (index + 1)}><Link href={`/uezdy/${topicId}/${index + 1}`}>{index + 1}</Link></Button>
* */
