# How to structure the conversation

-   n users should be able to contribute to the same chat.
-   We do not want duplicate conversations in our db.
    <img src="UserAndConversations.png" /> \
    Solution: Each user document is associated with a list of conversation IDs. When the user logs in, the corresponding conversations are loaded.

# Storage Format

- User
   - Conversation ID 1
   - ...

- Conversation 1
   - Message
      - Sender
      - Text
      - Timestamp
   - Message
      - ...
- Conversation 2
   - ...
- ...