"use client";

import { useEffect, useState } from "react";
import queryKimi from "./queryKimi";
import Markdown from 'react-markdown'
import { Word } from "./types/word"
import { useImmer } from "use-immer";
import { produce } from "immer";
export default function History() {
  const [words, setWords] = useImmer<Word[] | []>([]);
  const [def, setDef] = useState();
  const [index, setIndex] = useState(0);
  const [anwsers, updateAnwsers] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(0);


  useEffect(() => {
    fetch("http://localhost:8787/fetch")
      .then((data) => data.json())
      .then((data: Word[]) => {
        console.log(data);
        setWords(data);
        setIndex(10);
        console.log("fetched");
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    /*
    if(ai){
      console.log(`running ${words[index].word}`);      
      ai.prompt(`provide the definition of the word '${words[index].word}'`)
      .then((data) => {setDef(data);console.log("done")})
      .catch(error=>console.log(error));
    }
    */

    function updateGroup(index: number) {
      const currentGroup = Math.round(index / 10);
      setCurrentGroup(currentGroup);
    }

    updateGroup(index);
  }, [index]);
  useEffect(() => {

    async function updateWords(group, words: Word[], setWords, queryKimi) {
      const updatedWords = await produce(words, async draft => {
        for (let i = group; i < (group + 1) * 10; i++) {
          if (i < words.length) {
            const def = await queryKimi(words[i]);
            draft[i].answer = def;
          }
        }
      });

      setWords(updatedWords);
    }
    const prepareAnswer = async (group) => {
      await updateWords(group, words, setWords, queryKimi);
    };





    if (words.length != 0) {
      if (currentGroup == 0) {
        prepareAnswer(0);
        prepareAnswer(1);
      }
      else {
        prepareAnswer(currentGroup + 1)
      }

    }


  }, [currentGroup])



  const nextWord = () => setIndex(index + 1);
  const current = words ? words[index] : undefined;

  return !current ? (
    <h1>loading</h1>
  ) : (
    <>
      <h1>{current.word}</h1>
      <Markdown>{def}</Markdown>
      <button onClick={nextWord}>next word</button>
    </>
  );
}

