import path from "path";
import fs from "fs";

import SelectedMenu from "@/app/components/SelectedMenu";
import {topicsPool, aboutGroups} from "@/app/services/service.data";
import PaginationLists from "@/app/components/PaginationLists";
import ChatsListMenuNavigation from "@/app/components/ChatsListMenuNavigation";

export default async function Layout({ params, children }: any) {

    const {topicId, page, uezd} = await params;
    const pagePath = path.resolve(`public/${uezd}/src/${topicId}`);
    const pagesList = fs.readdirSync(pagePath, 'utf8');

    const pagesCount = pagesList.length;

    return (
        <>
            <nav className="static-navigation-bar top-navigation-bar">
                <SelectedMenu uezd={uezd} topicsPool={topicsPool[uezd]} topicId={topicId}/>
                <PaginationLists pagesCount={pagesCount} topicId={topicId} page={page} uezd={uezd} />
                <ChatsListMenuNavigation uezd={uezd} aboutGroups={aboutGroups} />
            </nav>
            <main>{children}</main>
        </>
    )
}
