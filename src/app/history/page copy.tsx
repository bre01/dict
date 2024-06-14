"use client";

import { useEffect, useState } from "react";
export default function History() {
  const [words, setWords] = useState([]);
  const [def, setDef] = useState();
  const [index, setIndex] = useState();
  const [current, setCurrent] = useState();
  const [ai,setAi]=useState();
  useEffect(()=>
  {
    window.model.createTextSession().then(setAi).catch(error=>console.log(error))
  },[]);

  useEffect(() => {
    fetch("http://localhost:8787/fetch")
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setWords(data);
        setIndex(10);
        console.log("fetched");
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    setCurrent(words[index]);
    if(ai){
      console.log(`running ${words[index].word}`);      
      ai.prompt(`provide the definition of the word '${words[index].word}'`)
      .then((data) => {setDef(data);console.log("done")})
      .catch(error=>console.log(error));
    }
  }, [index]);
  const nextWord=(event)=>setIndex(index+1);

  return !current ? (
    <h1>loading</h1>
  ) : (
    <>
      <h1>{current.word}</h1>
      <h2>{def}</h2>
      <button onClick={nextWord}>next word</button>
    </>
  );
}
