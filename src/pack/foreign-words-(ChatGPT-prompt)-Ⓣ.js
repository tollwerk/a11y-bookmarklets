import { ErrorInfo, SuccessInfo } from "../lib/info";

(function iefe(d) {
    const stl = 'position:fixed;top:0;left:0';

    function removeDuplicateWords(str) {
        // Split the string into words
        let words = str.split(/\s+/);

        // Use a set to remove duplicates
        let uniqueWords = new Set(words);

        // Join the unique words back into a string
        return [...uniqueWords].join(' ');
    }

    async function copyToPrompt() {
        try {
            const text = `Finde alle fremdsprachigen, nicht-deutschen Begriffe in folgendem Text, die keine Eigennamen sind und nicht bereits in den deutschen Sprachgebrauch eingegangen und somit eingedeutscht sind, und liste sie gruppiert nach Sprache auf. Liefere keine Erklärung.\n\n${removeDuplicateWords(document.body.innerText.replace(/\s+/gi, ' '))}`;
            await navigator.clipboard.writeText(text)
                .then(res => {
                    console.log(text);
                    (new SuccessInfo(d.body, 2, `Copied page text to clipboard and console (ChatGPT prompt)`, null, stl)).create(true);
                })
                .catch(res => (new ErrorInfo(d.body, 2, `Failed to copy page text / prompt to clipboard`, null, stl)).create(true));
            ;
        } catch (err) {
            (new ErrorInfo(d.body, 2, `Failed to copy page text / prompt to clipboard`, null, stl)).create(true);
        }
    }

    copyToPrompt();
}(document));
