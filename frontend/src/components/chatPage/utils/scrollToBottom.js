export const scrollToBottom = (endMessages) => {
    endMessages.current?.scrollIntoView({ behavior: "smooth" })
}