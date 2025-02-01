import Link from 'next/link'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CommentIcon from '@mui/icons-material/Comment';

export default function TopicsList({uezd, topicsPool}: any) {

    return <nav>
        <List key={0} sx={{
            height: '96vh',
            overflow: 'auto'
        }}>
            {
                Object.values(topicsPool).map((top: any) => <ListItem key={top.id}>
                    <CommentIcon className="comment-icon"/>
                    <Link className="topic-list-item" href={`/${uezd}/${top.id}/1`}>
                        {top.title}
                    </Link>
                </ListItem>)
            }
        </List>

    </nav>
};
