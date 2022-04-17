(function iefe() {
    const elements = {
        table: 'Tabellen',
        ul: 'Ungeordnete Listen',
        ol: 'Geordnete Listen',
        dl: 'Definitionslisten',
        form: 'Formulare',
        input: 'Eingabefelder',
        textarea: 'Textfelder',
        select: 'Auswahlfelder',
        iframe: 'IFrames',
        blockquote: 'Zitate'
    };
    let msg = '';
    for (const e in elements) {
        msg += `Anzahl ${elements[e]}: ${document.getElementsByTagName(e).length}\n`;
    }
    alert(msg);
}());
