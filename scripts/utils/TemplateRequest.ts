import {GITHUB_CDN_ENDPOINT} from "../constants/APIEndpoint";

const request = require("request");


export class TemplateRequest {

    public static async getTemplateContents(componentName: string) {

        const BASE_URL = `${GITHUB_CDN_ENDPOINT}/${componentName}`,
            SRC_ENDPOINT = `${BASE_URL}/index.ac.src`,
            LAYOUT_ENDPOINT = `${BASE_URL}/index.ac.layout`;

        const srcBody = await TemplateRequest.getContentFromURL(SRC_ENDPOINT);
        const layoutBody = await TemplateRequest.getContentFromURL(LAYOUT_ENDPOINT);

        return  {src: srcBody, layout: layoutBody};
    }

    public static async getContentFromURL(requestURL: string) {
        return new Promise(function (resolve, reject) {
            request(requestURL, function (error, res, body) {
                if (!error && res.statusCode == 200) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
        });
    }
}