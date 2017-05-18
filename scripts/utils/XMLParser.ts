const xml2js = require('xml2js');

export class XMLParser {
    private static instance: XMLParser = null;

    public xmlParser;
    public xmlBuilder;

    private constructor() {
        this.xmlBuilder = new xml2js.Builder();
        this.xmlParser = new xml2js.Parser();
    }

    public static getInstance(): XMLParser {
        if (!XMLParser.instance) {
            XMLParser.instance = new XMLParser();
        }
        return XMLParser.instance;
    }
}