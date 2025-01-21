export default async function Message({msg}: any) {
    return <>
        <div>
            {
                Array.isArray(msg.text) ? '' : msg.text
            }
        </div>
    </>
};
