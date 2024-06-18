import {useState,useEffect} from "react"
import {Word} from "./types/word"


export default function Definition(props:{words:Word[],index:number}){
    const [queryResults,setQueryResults]=useState<QueryResult[]>([]);
    useEffect(()=>{
        async function Query(){
            let queryResult:QueryResult[]=await Promise.all(props.words.map((word,index)=>{
            return queryDef(word.word)
            }))
            setQueryResults(queryResult);
        }
        Query()
    },[props.words])
    if(queryResults.length){
        const queryResult=queryResults[props.index];
        if(queryResult){

        return<>
            <h2>{queryResult.definition}</h2>
            <h2>{queryResult.phonetic}</h2>
            <h2>{queryResult.exchange}</h2>
            <h3>{queryResult.collins}{queryResult.oxford}</h3>
        </>
        }
        else{
            return<>
            <h2>wrong word</h2>
            </>
        }
    }
    return <>
        <h1>loading defnition</h1>
    </>

}

/**
 * Takes a word and return their definition and usage to show as markdown string
 * @param word word to query
 * @returns QueryResult object that contains phonetic and dictionary defnition
 */
async function queryDef(word:string):Promise<QueryResult>{
    const res=await fetch("http://127.0.0.1:5001?"+new URLSearchParams({
        word: word,
    }))
    const js=await res.json()
    return js;  
}


interface QueryResult{
    id:number;
    sw:string;
    word:string;
    phonetic:string;
    definition:string;
    translate:string;
    pos:string|null;
    collins:string;
    oxford:string;
    tag:any;
    bnc:number;
    frq:number;
    exchange:string;
    detail:string;
    audio:any;
}