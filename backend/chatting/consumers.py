from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from .serializers import MessageSerializer


class MessageConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            await self.close(code=4403)
            return
        self.profile = await self.get_profile(self.user)

        self.group_name = 'chatroom'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, data):
        kind = data.get('kind', None)
        content = data.get('content', None)
        
        message = await self.create_message(kind, content)
        if not message:
            await self.close(code=4400)
            return
        
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'message.send',
                'id': message['id'],
                'kind': message['kind'],
                'content': message['content'],
                'sender': message['sender'],
                'sent_at': message['sent_at'],
            }
        )
    
    async def message_send(self, event):
        await self.send_json({
            'id': event['id'],
            'kind': event['kind'],
            'content': event['content'],
            'sender': event['sender'],
            'sent_at': event['sent_at'],
        })


    @database_sync_to_async
    def get_profile(self, user):
        return user.profile
    
    @database_sync_to_async
    def create_message(self, kind, content):
        serializer = MessageSerializer(data={'kind': kind, 'content': content})
        if not serializer.is_valid():
            return None
        
        serializer.save(sender=self.profile)
        return serializer.data