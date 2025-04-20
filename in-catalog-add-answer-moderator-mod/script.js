// Конфигурация API
const API_URL = 'http://localhost:5000/api'; // Адрес вашего Flask-сервера

// DOM элементы
const likeButtons = document.querySelectorAll('.like-button');
const dislikeButtons = document.querySelectorAll('.dislike-button');
const sendButtons = document.querySelectorAll('.send-button');

// Функция для форматирования времени
function formatTime(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Функция создания элемента сообщения
function createMessageElement(messageId, postId, author, content, timestamp) {
    const repliesDiv = document.getElementById(`sent-replies-${postId}`);
    
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    
    const replyContainer = document.createElement('div');
    replyContainer.className = 'reply-container';
    
    const replyHeader = document.createElement('div');
    replyHeader.className = 'reply-header';
    
    const replyAuthor = document.createElement('span');
    replyAuthor.className = 'reply-author';
    replyAuthor.textContent = author;
    
    const replyTime = document.createElement('span');
    replyTime.className = 'reply-time';
    replyTime.textContent = formatTime(timestamp);
    
    const replyContent = document.createElement('div');
    replyContent.className = 'reply-content';
    replyContent.textContent = content;
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-reply';
    deleteButton.innerHTML = '<img src="trash-icon.svg" alt="Удалить" width="15">';
    deleteButton.onclick = async function() {
        if (confirm('Удалить это сообщение?')) {
            try {
                await deleteMessage(messageId);
                messageContainer.remove();
            } catch (error) {
                console.error('Ошибка удаления:', error);
                alert('Не удалось удалить сообщение');
            }
        }
    };
    
    replyHeader.appendChild(replyAuthor);
    replyHeader.appendChild(replyTime);
    replyContainer.appendChild(replyHeader);
    replyContainer.appendChild(replyContent);
    
    messageContainer.appendChild(replyContainer);
    messageContainer.appendChild(deleteButton);
    repliesDiv.appendChild(messageContainer);
}

// Загрузка сообщений для поста
async function loadMessages(postId) {
    try {
        const response = await fetch(`${API_URL}/messages?postId=${postId}`);
        if (!response.ok) throw new Error('Ошибка загрузки');
        
        const messages = await response.json();
        const repliesDiv = document.getElementById(`sent-replies-${postId}`);
        repliesDiv.innerHTML = '';
        
        messages.forEach(msg => {
            createMessageElement(msg.id, postId, msg.author, msg.content, msg.created_at);
        });
    } catch (error) {
        console.error('Ошибка загрузки сообщений:', error);
    }
}

// Отправка нового сообщения
async function addReply(postId) {
    const textarea = document.getElementById(`reply-${postId}`);
    const replyText = textarea.value.trim();
    
    if (!replyText) return;
    
    try {
        const response = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postId: postId,
                author: 'Анонимный пользователь', // Можно заменить на реального пользователя
                content: replyText
            })
        });
        
        if (!response.ok) throw new Error('Ошибка отправки');
        
        const result = await response.json();
        if (result.status === 'success') {
            loadMessages(postId); // Перезагружаем сообщения
            textarea.value = '';
        }
    } catch (error) {
        console.error('Ошибка отправки:', error);
        alert('Не удалось отправить сообщение');
    }
}

// Удаление сообщения
async function deleteMessage(messageId) {
    try {
        const response = await fetch(`${API_URL}/messages/${messageId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Ошибка удаления');
        return await response.json();
    } catch (error) {
        console.error('Ошибка удаления:', error);
        throw error;
    }
}

// Обработчики лайков/дизлайков (заглушка - можно подключить к API)
function setupReactions() {
    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Лайк поставлен');
            // Здесь можно добавить вызов API для сохранения лайка
        });
    });
    
    dislikeButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Дизлайк поставлен');
            // Здесь можно добавить вызов API для сохранения дизлайка
        });
    });
}

// Обработчики кнопок отправки
function setupSendButtons() {
    sendButtons.forEach(button => {
        const postId = button.getAttribute('onclick').match(/\d+/)[0];
        button.onclick = () => addReply(postId);
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    setupReactions();
    setupSendButtons();
    
    // Загружаем сообщения для всех постов
    loadMessages(1); // Для поста с id=1
    // loadMessages(2); // Для других постов, если есть
});

// Дополнительно: можно добавить обработку Enter для отправки
document.querySelectorAll('.reply-section textarea').forEach(textarea => {
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const postId = textarea.id.split('-')[1];
            addReply(postId);
        }
    });
});