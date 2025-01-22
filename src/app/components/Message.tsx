import {List, ListItem} from "@mui/joy";

export default async function Message({msg}: any) {
    return <>
        <ListItem variant="outlined">
            {
                Array.isArray(msg.text) ? '' : msg.text
            }
        </ListItem>
    </>
};
