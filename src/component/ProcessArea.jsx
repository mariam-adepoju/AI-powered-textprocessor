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
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = async () => {
    if (output.trim()) {
      // console.log(output);
      if ("ai" in self && "summarizer" in self.ai) {
        //console.log("the summarizer Api is supported");

        const summarizerCapabilities = await ai.summarizer.capabilities();
        const available = summarizerCapabilities.available;
        //console.log(available);
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
            setError(error.message);
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        alert("Summarizer API is not Supported");
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
        //console.log("the translator Api is supported");
        const translatorCapabilities = await self.ai.translator.capabilities();
        const available = translatorCapabilities.languagePairAvailable(
          language,
          selectedLanguage
        );
        // console.log(available);
        if (available === "readily") {
          setIsProcessing(true);
          try {
            const translator = await self.ai.translator.create({
              sourceLanguage: language,
              targetLanguage: selectedLanguage,
            });

            const result = await translator.translate(output);
            // console.log(result)

            const aiResponseId = Date.now().toString();
            const aiResponse = {
              id: aiResponseId,
              text: result,
              sender: "ai",
              language: selectedLanguage,
            };
            setMessages((prev) => [...prev, aiResponse]);
          } catch (error) {
            setError(error.message);
          } finally {
            setIsProcessing(false);
          }
        }
      } else {
        alert("Translate API is not supported");
      }
    }
  };

  if (error !== null) {
    <p>Error Occured, {error}</p>;
  }
  // console.log(selectedLanguage);
  // console.log(messages);
  // console.log(summary);

  return (
    <div className={styles.section}>
      <div className={styles.outputSection}>
        <div className={styles.outputBox} aria-label="output area">
          <p>{output}</p>
          {isProcessing ? <p>loading</p> : <p>The Language is:{language}</p>}
        </div>
        <div className={styles.btnContainer}>
          {output.length > 150 && language === "en" ? (
            <button onClick={handleSummarize} aria-label="summarize button">
              Summarize
            </button>
          ) : null}
          <button onClick={translate} aria-label="tranlate button">
            Translate
          </button>
          <select
            name="language"
            value={selectedLanguage}
            aria-label="select language"
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {/* <option value={""}>Translate</option> */}
            <option value={"en"} aria-label="english">
              English
            </option>
            <option value={"pt"} aria-label="portuguese">
              Portuguese
            </option>
            <option value={"es"} aria-label="spanish">
              Spanish
            </option>
            <option value={"ru"} aria-label="russian">
              Russian
            </option>
            <option value={"tr"} aria-label="turkish">
              Turkish
            </option>
            <option value={"fr"} aria-label="french">
              French
            </option>
          </select>
        </div>
      </div>
      {isProcessing ? (
        <p>loading...</p>
      ) : (
        messages?.map((message) => (
          <div
            key={message.id}
            className={styles.processArea}
            aria-label="translated text"
          >
            <p>{message.text}</p>
            <p>{message.language}</p>
          </div>
        ))
      )}
      <div>
        {isLoading ? (
          <p>loading...</p>
        ) : summary ? (
          <div className={styles.processArea} aria-label="summarized-text">
            {summary}
          </div>
        ) : null}
      </div>
    </div>
  );
}
