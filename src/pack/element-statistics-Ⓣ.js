import { SuccessInfo } from '../lib/info';
(function iefe(d) {
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
    const table = [];
    for (const e in elements) {
        const el = d.getElementsByTagName(e);
        table.push({
            'Typ': elements[e],
            'Anzahl': el.length,
            'Elemente': el
        });
    }
    console.table(table);
    (new SuccessInfo(d.body, 2, 'Element statistics have been printed to the DevTools', null, 'position:fixed;top:0;left:0')).create(true);
}(document));
