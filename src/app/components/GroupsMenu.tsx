import Link from 'next/link'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import './GroupsMenu.css';

export default function GroupsMenu({groupsList}: any) {
    return <nav>
        <List key={0}>
            {
                groupsList.map((group: any, index: number) => {
                    const href = group.noTopics ? `/${group.groupNickName}/0/1` : `/${group.groupNickName}`;
                    return <ListItem key={index}>
                        <Link className="group-list-item" href={href}>
                            <img className="icon" width="15rem" src={`/${group.groupNickName}/favicon.ico`} alt={group.title}/>
                            <span>{group.title}</span>
                        </Link>
                    </ListItem>
                })
            }
        </List>
    </nav>
};
