export const askAI = async (message: string) => {
  const res = await fetch("https://api.neuroengine.ai/Neuroengine-Fast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "no-cors",
    body: JSON.stringify({
      message: message,
    }),
  });
  const data = await res.json();
  return data.reply;
};
