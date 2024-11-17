



const qna = [];

async function getResponseFromLLM() {
    try {
        const chatHistory = document.getElementById('chat-history');
        const inputRef = document.querySelector("input.userQuery");

        if (qna.length < 5) {
            const query = inputRef.value.trim();


            if (!query) {
                alert("Please enter a query.");
                return;
            }


            inputRef.value = "";


            const qDiv = document.createElement("div");
            qDiv.classList.add("user-msg");
            qDiv.innerHTML = `<strong>You:</strong> ${query}`;
            chatHistory.appendChild(qDiv);


            const loadingDiv = document.createElement("div");
            loadingDiv.classList.add("loading");
            chatHistory.appendChild(loadingDiv);

            const apiBody = {
                contents: [
                    {
                        parts: [
                            {
                                text: `Context: ${JSON.stringify(qna)}`,
                            },
                            {
                                text: `
                  You are a medical chatbot which will answer the queries of people and patients, also diagnose their diseases according to the symptoms they tell. 
                  Be specific in your answer. Lastly, excuse yourself when an irrelevant question is asked.
                `,
                            },
                            {
                                text: `User query: ${query}`,
                            },
                        ],
                    },
                ],
            };

            const res = await fetch(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyAn4tDkD5GsrxfH025dhfgiw8COHQRLl6Y',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(apiBody),
                }
            );

            const data = await res.json();
            const responseText = data.candidates[0].content.parts[0].text;


            loadingDiv.remove();


            const newDiv = document.createElement("div");
            newDiv.classList.add("bot-msg");
            newDiv.innerHTML = `<pre class="AItag"><strong>Doctor:</strong> ${responseText}</pre>`;
            chatHistory.appendChild(newDiv);


            qna.push({
                Question: query,
                LLMResponse: responseText,
            });


            const lastMessage = chatHistory.lastElementChild;
            lastMessage.scrollIntoView({ behavior: "smooth" });

        } else {
            alert("Pay for full access.");
        }
    } catch (err) {
        console.log(err);
        alert("Error while generating response");
    }
}
