from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Message
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Разрешаем запросы с фронтенда

# Конфигурация БД
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///forum.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Создаем таблицы при первом запуске
with app.app_context():
    db.create_all()

@app.route('/api/messages', methods=['GET'])
def get_messages():
    post_id = request.args.get('postId', default=1, type=int)
    messages = Message.query.filter_by(post_id=post_id).order_by(Message.created_at.asc()).all()
    return jsonify([{
        'id': msg.id,
        'post_id': msg.post_id,
        'author': msg.author,
        'content': msg.content,
        'created_at': msg.created_at.isoformat()
    } for msg in messages])

@app.route('/api/messages', methods=['POST'])
def add_message():
    data = request.get_json()
    new_message = Message(
        post_id=data['postId'],
        author=data.get('author', 'Анонимный пользователь'),
        content=data['content'],
        created_at=datetime.utcnow()
    )
    db.session.add(new_message)
    db.session.commit()
    return jsonify({'status': 'success', 'id': new_message.id})

@app.route('/api/messages/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    message = Message.query.get_or_404(message_id)
    db.session.delete(message)
    db.session.commit()
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)