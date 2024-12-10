


const qna = [];

async function getResponseFromLLM() {
    try {

        const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        loadingModal.show();

        const chatHistory = document.getElementById('chat-history');
        const inputRef = document.querySelector("input.userQuery");

        if (qna.length < 10) {
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

            const apiBody = {
                contents: [
                    {
                        parts: [
                            {
                                text: `Context: ${JSON.stringify(qna)}`,
                            },
                            {
                                text: `You are a medical chatbot that will answer people's queries and diagnose diseases based on symptoms. Be specific in your answer, and excuse yourself when the question is irrelevant.`,
                            },
                            {
                                text: `User query: ${query}`,
                            },
                        ],
                    },
                ],
            };


            const res = await fetch(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyCIAVEOrZGmviplDXlE20pJpS5UrNM52pg',
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


            loadingModal.hide();


            const newDiv = document.createElement("div");
            newDiv.classList.add("bot-msg");
            newDiv.innerHTML = `<strong>Doctor:</strong> ${responseText}`;
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

        const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        loadingModal.hide();
        alert("Error while generating response");
    }
}

