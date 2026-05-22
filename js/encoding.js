function fixEncoding(text) {

    try {

        return decodeURIComponent(
            escape(text)
        )

    } catch {

        return text

    }

}