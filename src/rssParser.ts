type ParsedXMLData = {
    [key: string]: string | ParsedXMLData[] | null | undefined;
};

export const parseUrl = async ({ url }: { url: string }): Promise<ParsedXMLData> => {
    try {
        const response = await fetch(url);
        const xmlString = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");

        const getNodeValue = (node: Node, tagName: string): string | null => {
            const childNode = node.getElementsByTagName(tagName)[0];
            return childNode ? childNode.textContent : null;
        };

        const extractItemData = (itemNode: Node): ParsedXMLData => {
            const item: ParsedXMLData = {};
            const childNodes = itemNode.childNodes;
            for (const node of childNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName;
                    const value = getNodeValue(itemNode, tagName);
                    if (value) {
                        if (item[tagName]) {
                            if (!Array.isArray(item[tagName])) {
                                item[tagName] = [item[tagName]];
                            }
                            item[tagName].push(value);
                        } else {
                            item[tagName.replace(':', '_')] = value;
                        }
                    } else if (tagName === 'media:content') {
                        const url = node.getAttribute('url');
                        if (url) {
                            item['media_content'] = url;
                        }
                    }
                }
            }
            return item;
        };

        const rssNode = xmlDoc.getElementsByTagName("rss")[0];
        const channelNode = rssNode.getElementsByTagName("channel")[0];
        const result: ParsedXMLData = { items: [] };
        const childNodes: any = channelNode.childNodes;
        for (const node of childNodes) {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "item") {
                const tagName = node.tagName;
                const value = getNodeValue(channelNode, tagName);
                if (value) {
                    result[tagName.replace(':', '_')] = value;
                }
            }
        }

        const itemNodes = channelNode.getElementsByTagName("item");
        for (const itemNode of itemNodes) {
            const itemData = extractItemData(itemNode);
            (result.items as ParsedXMLData[]).push(itemData);
        }

        return result;
    } catch (error) {
        console.error("Error parsing XML:", error);
        throw error;
    }
};

export const extractLinkAndRemoveTags = (htmlString: string) => {
    // Find the image source link
    const imgSrcRegex = /<img.*?src="(.*?)"/i;
    const imgSrcMatch = htmlString.match(imgSrcRegex);
    const imgSrc = imgSrcMatch ? imgSrcMatch[1] : null;

    // Remove HTML tags from the string
    const strippedString = htmlString.replace(/<[^>]*>?/g, '');

    return { link: imgSrc, cleanedText: strippedString };
};