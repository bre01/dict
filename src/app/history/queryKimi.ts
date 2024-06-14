import {Word} from "./types/word"
import kimiKey from "../../../.dev.kimi"
/**
 * Takes a word and return their definition and usage to show as markdown string
 * @param word word to query
 * @returns defnition and usage 
 */
export default async function queryKimi(word:Word):Promise<string>{
  const res=await fetch("http://localhost:8000/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": kimiKey(),
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify({
      model: "kimi",
      messages: [
        {
          role: "user",
          content: `provide the definition of ${word.word}, provide common usage and usage in computer science, and make a sentence for me to remember it`
        }
      ],
      use_search: true,
      stream: false
    })
  })
  const js=await res.json()
  return js.choices[0].message.content;

}