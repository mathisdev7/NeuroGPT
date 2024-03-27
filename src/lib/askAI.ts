export const askAI = async (message: string) => {
  const res = await fetch("https://api.neuroengine.ai/Neuroengine-Large", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "no-cors",
    body: JSON.stringify({
      message: message,
    }),
  });
  console.log(res);
  const data = await res.json();
  console.log(data);
  return data.reply;
};
