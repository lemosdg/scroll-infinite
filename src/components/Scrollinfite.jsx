import React, {useEffect, useState, useRef} from "react";

export default function Scrollinfinite() {
    const [data, setData] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [offSet, setOffSet] = useState(0);

    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(OnItersection);
        if(observer && elementRef.current) observer.observe(elementRef.current);

        return()=>{
            if(observer) observer.disconnect();
        }
    }, [data]);

    const OnItersection = async (entries)=>{
        const firstEntry = entries[0];
        if(firstEntry.isIntersecting && hasMore) await getData(offSet);
    }

    const getData = async(cantPoke)=>{
        try{
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${cantPoke}&limit=20`);
            const json = await res.json();
            //console.log(json.results)
            if(json.results.length === 0) setHasMore(false);
            else{
                setData((data) => [...data, ...json.results]);
                setOffSet((offSet) => offSet + 20);
            }
        }
        catch(err){
            console.error(err)
        }
    }
    console.log(data)
    return(
        <div>
            <h3>Lista de Pokemon</h3>
            <ul>
                {data.map((el, index)=> (
                    <li key={index}>
                        <b>{el.name}</b>
                    </li>
                ))}
            </ul>
            {hasMore && <p ref={elementRef}>Cargando Pokemon...</p>}
        </div>
    )
}