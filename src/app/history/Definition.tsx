import { useState, useEffect } from "react";
import { Word } from "./types/word";

export default function Definition(props: { words: Word[]; index: number }) {
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  useEffect(() => {
    async function Query() {
      let queryResult: QueryResult[] = await Promise.all(
        props.words.map((word, index) => {
          return queryDef(word.word);
        })
      );
      setQueryResults(queryResult);
    }
    Query();
  }, [props.words]);
  if (queryResults.length) {
    const queryResult = queryResults[props.index];
    if (queryResult) {
      return (
        <div className="bg-gray-500/20 backdrop-blur space-y-2 h-64 overflow-auto   px-4 py-2 rounded-lg">
          <div className="gap-2  flex text-xl">
            <div className="text-cyan-500 ">phonetic:</div>
            <div>{queryResult.phonetic}</div>
          </div>
          <div className="gap-2 relative  flex text-xl">
            <div className="text-cyan-500  ">definition:</div>
            <div className="">{queryResult.definition}</div>
          </div>
          <div className="gap-2  flex text-xl">
            <div className="text-cyan-500  ">exchange:</div>
            <div className=" text-wrap text-ellipsis">
              {queryResult.exchange ? queryResult.exchange : "none"}{" "}
            </div>
          </div>
          <div className="gap-2  flex text-xl">
            <div className="text-cyan-500  ">collins:</div>
            <div className="">{queryResult.collins}</div>
          </div>
          <div className="gap-2  flex text-xl">
            <div className="text-cyan-500  ">oxford:</div>
            <div className="">{queryResult.oxford}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-gray-500/20 backdrop-blur h-64 flex items-center justify-center  px-4 py-2 rounded-lg">
          <h2 className="text-5xl text-red-500">wrong word</h2>
        </div>
      );
    }
  }
  return (
    <div className="bg-gray-500/20 backdrop-blur h-64 flex items-center justify-center  px-4 py-2 rounded-lg">
      <h2 className="text-5xl">loading defnition</h2>
    </div>
  );
}

/**
 * Takes a word and return their definition and usage to show as markdown string
 * @param word word to query
 * @returns QueryResult object that contains phonetic and dictionary defnition
 */
async function queryDef(word: string): Promise<QueryResult> {
  const res = await fetch(
    "http://127.0.0.1:5001?" +
      new URLSearchParams({
        word: word,
      })
  );
  const js = await res.json();
  return js;
}

interface QueryResult {
  id: number;
  sw: string;
  word: string;
  phonetic: string;
  definition: string;
  translate: string;
  pos: string | null;
  collins: string;
  oxford: string;
  tag: any;
  bnc: number;
  frq: number;
  exchange: string;
  detail: string;
  audio: any;
}
