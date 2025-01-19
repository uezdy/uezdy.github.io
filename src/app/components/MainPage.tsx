'use client'

const getData = async () => {
    const response = await fetch("/result.json", {
        cache: "no-cache",
    });
    return await response.json();
};

export const MainPage = async () => {
    const data = await getData();

    return <>
        {data.messages.length}
    </>

}
