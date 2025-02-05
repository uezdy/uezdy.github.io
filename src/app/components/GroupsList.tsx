import Link from 'next/link'
import './GroupsList.css';

export default function GroupsList({groupsList}: any) {
    return <nav className="center">
        <ul>
            {
                groupsList.map((group: any, index: number) => {
                    const href = group.noTopics ? `/${group.groupNickName}/0/1` : `/${group.groupNickName}`;
                    return <li key={index}>
                        <Link className="group-list-item" href={href} data-message={group.title} tabIndex="0">
                            <img className="icon" width="15rem"
                                 src={`/${group.groupNickName}/favicon.ico`}
                                 alt={group.title}/>
                            <span>{group.title}</span>
                        </Link>
                    </li>
                })
            }
        </ul>
    </nav>
};
