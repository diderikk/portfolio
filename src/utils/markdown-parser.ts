import { marked } from "marked";
import hljs from "highlight.js";

const parseMarkdown = async (markdownString: string): Promise<string> => {
	return new Promise((res, rej) => {
		marked.parse(markdownString, (err, parsed) => {
			if(err) rej(err)
			else res(parsed)
		})
	})
}

const parse = async (markdownString: string): Promise<string> => {
	const htmlString = await parseMarkdown(markdownString)

	// if(htmlString.replaceAll("<code>", ))
	return htmlString
}

export default parse;