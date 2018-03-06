Plugin.registerCompiler(
    {
        extensions: ["html"],
        archMatching: "web",
        isTemplate: false,
    },
    () =>
        new CachingHtmlCompiler("static-html", filter, compileTagsToStaticHtml),
);

function filter(tag) {
    const firstTag = tag.contents.indexOf("<") + 1;
    if (
        tag.tagNames.reduce(
            (acc, tagName) =>
                tag.contents.substring(firstTag, firstTag + tagName.length) ===
                    tagName || acc,
            false,
        )
    )
        return Object.assign(tag, {
            type: tag.contents.match(/<[A-Za-z\-]+/g)[0].substring(1),
        });
}

function compileTagsToStaticHtml(tag) {
    if (!tag)
        return {
            head: "",
            body: "",
            js: "",
            bodyAttrs: {},
        };

    switch (tag.type) {
        case "head":
            return {
                head: tag.contents.replace(/<\/?head>/g, ""),
                body: "",
                js: "",
                bodyAttrs: {},
            };
        case "body":
            return {
                head: "",
                body: tag.contents.replace(/<\/?body>/g, ""),
                js: "",
                bodyAttrs: {},
            };
        default:
            return {
                head: "",
                body: "",
                js: "",
                bodyAttrs: {},
            };
    }
}
