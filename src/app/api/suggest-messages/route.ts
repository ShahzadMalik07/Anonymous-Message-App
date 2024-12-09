import { GoogleGenerativeAI } from "@google/generative-ai";


export async function GET(request: Request) {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment, and each time i call you give me diiferent response with questions.";

        const result = await model.generateContentStream(prompt);

        const stream = new ReadableStream({
            start(controller) {
                (async () => {
                    for await (const chunk of result.stream) {
                        let chunkText = chunk.text()
                        controller.enqueue(new TextEncoder().encode(chunkText))
                    }
                    controller.close()
                })().catch(err => {
                    controller.error(err)
                    console.error("error during Streaming", err)
                })
            },
        })

        // let chunkText;
        // for await (const chunk of result.stream) {
        //     let chunkText = chunk.text();
        //     process.stdout.write(chunkText);
        //     console.log(chunkText)

        // }
        return new Response(stream, {
            headers: {
                "Content-Type": "application/octet-stream"
            }
        })

    } catch (error) {
        console.log("Error with Gemini:", error)
        return new Response(
            JSON.stringify({
                success: false,
                msg: "Error  processing request"
            }), { status: 501 })

    }
}


