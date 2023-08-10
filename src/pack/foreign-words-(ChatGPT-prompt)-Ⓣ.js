import { ErrorInfo, SuccessInfo } from "../lib/info";

(function iefe(d) {
    const stl = 'position:absolute';

    async function copyToPrompt() {
        try {
            const text = `Finde alle fremdsprachigen, nicht-deutschen Begriffe in folgendem Text, die nicht bereits in den deutschen Sprachgebrauch eingegangen und quasi eingedeutscht sind, und liste sie gruppiert nach Sprache auf:\n\n${document.body.innerText.replace(/\s+/gi, ' ')}`;
            await navigator.clipboard.writeText(text)
                .then(res => (new SuccessInfo(d.documentElement, 2, `Copied page text to prompt`, null, stl)).create(true))
                .catch(res => (new ErrorInfo(d.documentElement, 2, `Failed to copy to prompt`, null, stl)).create(true));
            ;
        } catch (err) {
            (new ErrorInfo(d.documentElement, 2, `Failed to copy to prompt`, null, stl)).create(true);
        }
    }

    copyToPrompt();
}(document));
