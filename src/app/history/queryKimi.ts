export default async function queryKimi(word){
    const res=await fetch("http://localhost:8000/v1/chat/completions", {
        "method": "POST",
        "headers": {
              "Content-Type": "text/plain; charset=utf-8"
        },
        "body": `{\n  \"model\": \"kimi\",\n  \"messages\": [\n    {\n      \"role\": \"user\",\n      \"content\": \"provide the definition of ${word.word},provide common usage and usage in computer science, and make a sentence for me to remember it \"\n    }\n  ],\n  \"use_search\": true,\n  \"stream\": false\n}`
  })
  return res;

}
