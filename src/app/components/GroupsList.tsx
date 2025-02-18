import Link from 'next/link'
import './GroupsList.css';
import Image from 'next/image';

export default function GroupsList({groupsList}: any) {
    return <nav className="center">
        <ul>
            {
                groupsList.map((group: any, index: number) => {
                    const href = group.noTopics ? `/${group.groupNickName}/0/1` : `/${group.groupNickName}`;
                    return <li key={index}>
                        <Link className="group-list-item" href={href} data-message={group.title} tabIndex={0}>
                            <Image className="icon" width={15} height={15}
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
