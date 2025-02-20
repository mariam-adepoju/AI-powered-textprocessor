import { useState } from "react";
import styles from "./process-area.module.css";

export default function ProcessArea({
  output,
  language,
  isProcessing,
  setIsProcessing,
}) {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [messages, setMessages] = useState([]);
  const [summary, setSummary] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    // console.log(e.target);

    if (output.trim()) {
      console.log(output);
      if ("ai" in self && "summarizer" in self.ai) {
        window.alert("the summarizer Api is supported");

        const summarizerCapabilities = await ai.summarizer.capabilities();
        const available = summarizerCapabilities.available;
        // console.log(summarizerCapabilities);
        console.log(available);
        if (available === "readily") {
          setIsLoading(true);
          try {
            const summarizer = await ai.summarizer.create({
              sharedContext: "some text",
              type: "key-points",
              format: "markdown",
              length: "short",
            });
            const res = await summarizer.summarize(output);
            // console.log(res);
            setSummary(res);
          } catch (error) {
            console.log("failed to get AI response", error);
          } finally {
            setIsLoading(false);
          }
        }
      }
    }
  };
  const translate = async () => {
    if (output.trim()) {
      const userMessageId = Date.now().toString();
      const userMessage = {
        id: userMessageId,
        text: output,
        sender: "user",
        language: language,
      };
      if ("ai" in self && "translator" in self.ai) {
        confirm("the translator Api is supported");
        const translatorCapabilities = await self.ai.translator.capabilities();
        const available = translatorCapabilities.languagePairAvailable(
          language,
          selectedLanguage
        );
        console.log(available);
        if (available === "readily") {
          setIsProcessing(true);
          try {
            const translator = await self.ai.translator.create({
              sourceLanguage: language,
              targetLanguage: selectedLanguage,
            });

            const result = await translator.translate(output);
            console.log(result);

            const aiResponseId = Date.now().toString();
            const aiResponse = {
              id: aiResponseId,
              text: result,
              sender: "ai",
              language: selectedLanguage,
            };
            setMessages((prev) => [...prev, aiResponse]);
          } catch (error) {
            console.log("failed to get AI response", error);
          } finally {
            setIsProcessing(false);
          }
        }
      }
    }
  };

  // console.log(selectedLanguage);
  // console.log(messages);
  // console.log(summary);

  return (
    <div className={styles.section}>
      <div>
        <div className={styles.processArea}>
          <p>{output}</p>
          {isProcessing ? <p>loading</p> : <p>The Language is:{language}</p>}
        </div>
        <div className={styles.btnContainer}>
          {output.length > 150 ? (
            <button onClick={handleSummarize}>Summarize</button>
          ) : null}
          <button onClick={translate}>Translate</button>
          <select
            name="language"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {/* <option value={""}>Translate</option> */}
            <option value={"en"}>English</option>
            <option value={"pt"}>Portuguese</option>
            <option value={"es"}>Spanish</option>
            <option value={"ru"}>Russian</option>
            <option value={"tr"}>Turkish</option>
            <option value={"fr"}>French</option>
          </select>
        </div>
      </div>
      {isProcessing ? (
        <p>loading...</p>
      ) : (
        messages?.map((message) => (
          <div key={message.id} className={styles.processArea}>
            <p>{message.text}</p>
            <p>{message.language}</p>
          </div>
        ))
      )}
      <div>
        {isLoading ? (
          <p>loading...</p>
        ) : summary ? (
          <div className={styles.processArea}>{summary}</div>
        ) : null}
      </div>
    </div>
  );
}
