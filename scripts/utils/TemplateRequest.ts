import {GITHUB_CDN_ENDPOINT} from "../constants/APIEndpoint";
import * as rp from 'request-promise';

export class TemplateRequest {

    public static async getTemplateContents(componentName: string) {

        const BASE_URL = `${GITHUB_CDN_ENDPOINT}/${componentName}`,
            SRC_ENDPOINT = `${BASE_URL}/index.ac.src`,
            LAYOUT_ENDPOINT = `${BASE_URL}/index.ac.layout`;

        const srcBody = await rp(SRC_ENDPOINT);
        const layoutBody = await rp(LAYOUT_ENDPOINT);

        return {src: srcBody, layout: layoutBody};
    }
}