import SelectedMenu from "@/app/components/SelectedMenu";
import {topicsPool, topics} from "@/app/services/service.data";
import PaginationLists from "@/app/components/PaginationLists";

export default async function Layout({ params, children }: any) {

    const {topicId, page, uezd} = await params;
    const pagesCount = topics[uezd][topicId].length;

    return (
        <>
            <nav className="static-navigation-bar top-navigation-bar">
                <SelectedMenu uezd={uezd} topicsPool={topicsPool[uezd]} topicId={topicId}/>
                <PaginationLists pagesCount={pagesCount} topicId={topicId} page={page} />
            </nav>
            <main>{children}</main>
            <div id="down" />
        </>
    )
}
