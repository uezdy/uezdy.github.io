import SelectedMenu from "@/app/components/SelectedMenu";
import {topicsPool} from "@/app/services/service.data";
import PaginationLists from "@/app/components/PaginationLists";

export default async function Layout({ params, children }) {

    const {topicId, page} = await params;
    const pagesCount = topicsPool[topicId].messages.length - 1;

    return (
        <>
            <nav className="static-navigation-bar top-navigation-bar">
                <SelectedMenu topicsPool={topicsPool} topicId={topicId}/>
                <PaginationLists pagesCount={pagesCount} topicId={topicId} page={page} />
            </nav>
            <main>{children}</main>
            <div id="down" />
        </>
    )
}
