# Solaris

To run preview:

```
docker-compose up --build
```

To develop:

```
npm run dev
```

**_ In a separate terminal _**

```
npm start
```

## Testing webhooks in dev environment

```
smee --url <SMEE REDIRECT URL> --path /api/webhooks/<CODEHOST> --port 3001
```
