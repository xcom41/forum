// script.js
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function addReply(postId) {
    const textareaId = `reply-${postId}`;
    const textarea = document.getElementById(textareaId);
    const replyText = textarea.value.trim();

    if (replyText !== "") {
        const repliesDivId = `sent-replies-${postId}`;
        const repliesDiv = document.getElementById(repliesDivId);

        const replyContainer = document.createElement('div');
        replyContainer.className = 'reply-container';

        const replyHeader = document.createElement('div');
        replyHeader.className = 'reply-header';

        const replyAuthor = document.createElement('span');
        replyAuthor.className = 'reply-author';
        replyAuthor.textContent = 'Петров Петр Петрович';

        const replyTime = document.createElement('span');
        replyTime.className = 'reply-time';
        replyTime.textContent = getCurrentTime();

        const replyContent = document.createElement('div');
        replyContent.className = 'reply-content';
        replyContent.textContent = replyText;

        replyHeader.appendChild(replyAuthor);
        replyHeader.appendChild(replyTime);
        replyContainer.appendChild(replyHeader);
        replyContainer.appendChild(replyContent);
        repliesDiv.appendChild(replyContainer);

        textarea.value = "";
    }
}