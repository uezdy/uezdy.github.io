import Link from 'next/link'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

export default function GroupsMenu({groupsList}: any) {
    return <nav>
        <List key={0}>
            {
                groupsList.map((group: any, index: number) => <ListItem key={index}>
                    <Link className="topic-list-item" href={`/${group.groupNickName}`}>
                        {group.title}
                    </Link>
                </ListItem>)
            }
        </List>
    </nav>
};
