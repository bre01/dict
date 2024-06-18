"use client";

import { useEffect, useState } from "react";
import queryKimi from "./queryKimi";
import Markdown from 'react-markdown'
import { Word } from "./types/word"
import { useImmer } from "use-immer";
import { produce } from "immer";
export default function History() {
  const [words, setWords] = useState<Word[] | []>([]);
  const [index, setIndex] = useState<number>(-1);
  const [anwsers, setAnwsers] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(0);


  useEffect(() => {
    //fetch("http://localhost:8787/fetch")
    fetch("/fetch.json")
      .then((data) => data.json())
      .then((data: Word[]) => {
        console.log(data);
        setWords(data);
        setIndex(0);
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

    updateGroup(index as number);
  }, [index]);
  useEffect(() => {
    let localwords = words;

    const prepareAnswer = async (group: number) => {
      //await updateWords(group, words, setWords, queryKimi);
      let lowRange;
      let highRange;
      if (group == 0) {
        const firstWord = localwords[0];
        firstWord.answer = await queryKimi(localwords[0])
        const newWords = localwords.map((word, index) => {
          if (index == 0) {
            return firstWord;
          }
          else {
            return word
          }
        })
        localwords = newWords;
        setWords(newWords)
        lowRange = 1;
        highRange = 10;
      }
      else {
        lowRange = group * 10;
        highRange = (group + 1) * 10;

      }
      const newWords = await Promise.all(localwords.map(async (word, index) => {
        if (index >= lowRange && index < highRange) {
          const answer = await queryKimi(word);
          return { ...word, answer };
        }
        else {
          return word;
        }

      }))
      localwords = newWords;
      setWords(newWords)
      if (group == 0) {
        prepareAnswer(1);
      }
    };




    if (words.length != 0) {
      if (currentGroup == 0) {
        prepareAnswer(0);
      }
      else {
        prepareAnswer(currentGroup + 1)
      }

    }

  //this logic is complex and i know what i'm i doing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGroup])



  const nextWord = () => setIndex(index + 1);
  const current = words ? words[index] : "loading";
  const def = (words[index] && words[index].answer) ? words[index].answer : "loading";

  return words.length == 0 ?
    (
      <h1>loading</h1>
    )
    :
    (
      <>
        <h1>{(current as Word).word}</h1>
        <Markdown>{def}</Markdown>
        <button onClick={nextWord}>next word</button>
      </>
    );
}

