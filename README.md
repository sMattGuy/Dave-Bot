# Dave-Bot
Dave bot is a bot meant to capture the essence of our friend Dave.  
Dave bot can be interacted with in many ways
## Features
### Karma System
When receiving a DOTD, a user will be given 1 Karma. Using it too much though will result in losing Karma instead.  
A User can spend 10 of their Karma to create their own DOTD, which will be added to the random pool, with them as the author.
|Command|Description|
|:---|:---|
|/karma|Shows a users current Karma value|
|/spendkarma|Allows a user to spend 10 Karma to make a DOTD.|
### Commands
Dave bot can be directly interacted with using slash commands
|Command|Description|
|:---|:---|
|/dave|Shows how long dave has been in the server.|
|/dotd|Sends a random bit of wisdom from Dave.|
|/ohm|Allows a user to query if another user is Zen.|
|/ratedave|Allows everyone to rate Dave to estimate approval.|
|/nycfc|Shows how NYCFC is doing in their current season.|
### Admin Commands
Admins can use these commands to manage the bot
|Command|Description|
|:---|:---|
|/daveoptions|Allows admins to edit the random chance that Dave will respond in chat.|
|/useroptions|Allows admins to edit users.|
### Chat Features
Dave bot will randomly talk in chat based on various conditions.  
Dave bot can be interrupted by telling him to **shut up**, cancelling its action.  
|Action|Trigger|Description|
|:---|---|:---|
|Yap|Chance when another message is sent|Dave bot sends a random wikipedia summary.|
|Respond|Chance when Dave is mentioned in chat|Dave bot will send a quick reply.|
|Poem|Chance when another message is sent|Dave bot sends a random poem.|
