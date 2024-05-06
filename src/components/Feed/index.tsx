import React, { useCallback } from "react";
import { useAllFormFields } from 'payload/components/forms';
import { parseUrl, extractLinkAndRemoveTags } from "../../rssParser";

const Feed: React.FC = () => {

    const [fields] = useAllFormFields();

    const handleUpdate = useCallback(async () => {
        const feed_url: any = fields.feed_url.value;
        const number_of_posts_to_import: any = fields.number_of_posts_to_import.value;

        if (feed_url && number_of_posts_to_import) {
            parseUrl({ url: feed_url })
                .then(async (parsedData: any) => {
                    // Use the parsedData object here
                    let count = 0
                    for (let i = 0; i < number_of_posts_to_import; i++) {
                        count++
                        const item = parsedData.items[i];
                        const { cleanedText }: any = extractLinkAndRemoveTags(parsedData.items[i].description);
                        const formDataMedia = new FormData();
                        const formData = new FormData();

                        const richTextData: any = {
                            "root": {
                                "type": "root",
                                "format": "",
                                "indent": 0,
                                "version": 1,
                                "children": [
                                    {
                                        "children": [
                                            {
                                                "detail": 0,
                                                "format": 0,
                                                "mode": "normal",
                                                "style": "",
                                                "text": cleanedText,
                                                "type": "text",
                                                "version": 1
                                            }
                                        ],
                                        "direction": "ltr",
                                        "format": "",
                                        "indent": 0,
                                        "type": "heading",
                                        "version": 1,
                                        "tag": "h1"
                                    }
                                ],
                                "direction": "ltr"
                            }
                        }

                        // console.log(JSON.stringify(item))
                        const date = new Date().toLocaleDateString();
                        const dateTime = new Date().toLocaleTimeString();

                        try {
                            const response = await fetch(`https://cors-anywhere.herokuapp.com/${item.media_content}`, {
                                method: 'GET',
                            });

                            const blob = await response.blob();
                            const file = new File([blob], `${date}-${dateTime}-${i}`, { type: blob.type });

                            formDataMedia.append('file', file);

                            fetch("http://localhost:3001/api/media", {
                                method: 'POST',
                                body: formDataMedia,
                            })
                                .then(async (response) => {
                                    const res = await response;
                                    const data = await res.json()

                                    formData.append('title', item.title);
                                    formData.append('content', JSON.stringify(richTextData));
                                    formData.append('image', data.doc.id);

                                    if (data) {
                                        fetch("http://localhost:3001/api/post", {
                                            method: 'POST',
                                            body: formData,
                                        })
                                    }

                                })
                                .catch(error => {
                                    throw new Error(error);
                                });

                        } catch (error) {
                            console.error('Error fetching image:', error);
                        }
                    }
                })
                .catch(error => {
                    throw new Error(error);
                });
        }
    }, [])

    return (
        <>
            <button onClick={handleUpdate} type="button">
                Update
            </button>
        </>
    )
}

export default Feed;