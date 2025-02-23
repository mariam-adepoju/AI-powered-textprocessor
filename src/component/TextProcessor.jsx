import { useState } from "react";
import ProcessArea from "./ProcessArea";
import styles from "./text-processor.module.css";
import logo from "./../assets/submit.svg";

export default function TextProcessor() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    detectLanguage(input);
    setOutput(input);
    setInput("");
  }
  const detectLanguage = async (output) => {
    if (output) {
      // console.log(output);

      if ("ai" in self && "languageDetector" in self.ai) {
        //console.log("The Language Detector API is available.");

        const languageDetectorCapabilities =
          await self.ai.languageDetector.capabilities();
        const canDetect = languageDetectorCapabilities.languageAvailable("fr");
        // console.log(canDetect);
        let detector;

        if (canDetect === "readily") {
          setIsProcessing(true);
          try {
            detector = await self.ai.languageDetector.create();
            const results = await detector.detect(output);
            // console.log(results);
            let bestResult = results[0];
            setLanguage(bestResult.detectedLanguage);
          } catch (error) {
            setErrorMsg(error.message);
          } finally {
            setIsProcessing(false);
          }
        }
      } else {
        alert("This Language detector API is not supported");
      }
    }
  };
  if (errorMsg !== null) {
    <p>Error Occured, {errorMsg}</p>;
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.textContainer}>
        <textarea
          type="text"
          placeholder="Enter your text here"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          aria-label="input-field"
          className={styles.textArea}
          required
        />
        <button
          type="submit"
          aria-label="submit button"
          className={styles.submitBtn}
        >
          <img src={logo} alt="submit" className={styles.submitLogo} />
        </button>
      </form>
      <ProcessArea
        output={output}
        language={language}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </div>
  );
}
