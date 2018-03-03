Plugin.registerCompiler({
	extensions: ['html'],
	archMatching: 'web',
	isTemplate: false
}, () => new CachingHtmlCompiler("static-html", filter, compileTagsToStaticHtml));

function filter(tag) {
	const firstTag = tag.contents.indexOf('<') + 1;
	//const ok = tagNames.reduce((acc, tag) => tag.substring(firstTag, firstTag + tag.length) || acc, false);
	if(tag.tagNames.reduce((acc, tagName) => tag.contents.substring(firstTag, firstTag + tagName.length) === tagName || acc, false))
		return Object.assign(tag, {type: tag.contents.match(/<[A-Za-z\-]+/g)[0].substring(1)});
}

function compileTagsToStaticHtml(tag) {
	if(!tag) return {
		head: '',
		body: '',
		js: '',
		bodyAttrs: {}
	};

	switch(tag.type) {
		case "head":
			return {
				head: tag.contents.replace(/<\/?head>/g, ""),
				body: '',
				js: '',
				bodyAttrs: {}
			}
		case "body": 
			return {
				head: '',
				body: tag.contents.replace(/<\/?body>/g, ""),
				js: '',
				bodyAttrs: {}
			}
		default:
			return {
				head: '',
				body: '',
				js: '',
				bodyAttrs: {}
			}
	}
}

class StaticHtmlTagHandler {
	constructor() {
		this.results = {
			head: '',
			body: '',
			js: '',
			bodyAttrs: {}
		};
	}

	getResults() {
		return this.results;
	}

	addTagToResults(tag) {
		this.tag = tag;

		// do we have 1 or more attributes?
		const hasAttribs = !_.isEmpty(this.tag.attribs);

		if (this.tag.tagName === "head") {
			if (hasAttribs) {
				this.throwCompileError("Attributes on <head> not supported");
			}

			this.results.head += this.tag.contents;
			return;
		}


		// <body> or <template>

		try {
			if (this.tag.tagName === "body") {
				this.addBodyAttrs(this.tag.attribs);

				// We may be one of many `<body>` tags.
				this.results.body += this.tag.contents;
			} else {
				this.throwCompileError("Expected <head> or <body> tag", this.tag.tagStartIndex);
			}
		} catch (e) {
			if (e.scanner) {
				// The error came from Spacebars
				this.throwCompileError(e.message, this.tag.contentsStartIndex + e.offset);
			} else {
				throw e;
			}
		}
	}

	addBodyAttrs(attrs) {
		Object.keys(attrs).forEach((attr) => {
			const val = attrs[attr];

			// This check is for conflicting body attributes in the same file;
			// we check across multiple files in caching-html-compiler using the
			// attributes on results.bodyAttrs
			if (this.results.bodyAttrs.hasOwnProperty(attr) && this.results.bodyAttrs[attr] !== val) {
				this.throwCompileError(
					`<body> declarations have conflicting values for the '${attr}' attribute.`);
			}

			this.results.bodyAttrs[attr] = val;
		});
	}

	throwCompileError(message, overrideIndex) {
		TemplatingTools.throwCompileError(this.tag, message, overrideIndex);
	}
}