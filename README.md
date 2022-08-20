After deployemnt, you need to set up webhook. Replace `<YOUR-BOT-TOKEN>` and `<YOUR-PROJECT-URL>` with the proper values.

```
curl -X POST https://api.telegram.org/bot<YOUR-BOT-TOKEN>/setWebhook \
  -H "Content-type: application/json" \
  -d '{"url": "<YOUR-PROJECT-URL>/api/index"}'
```
