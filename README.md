# 📓 a-simple-note

A personal project to make a clone Google Keep with advanced functionalities using Facebook's [Lexical Editor](https://lexical.dev/).

```bash
# install
yarn

# run dev server
yarn dev

# build
yarn build

# run production server
yarn start

# lint
yarn lint

# prettier
yarn prettier

# clean
yarn clean

# reinstall
yarn reinstall
```

## Use MongoSH in MongoDB Compass

MongoSH is compatibility with the MongoDB Node.js driver ([ref](https://www.mongodb.com/docs/mongodb-shell/))

```bash
# Change database
use atomicNote
```

```bash
# MongoSH
db.notes.find({}).sort({ metacritic: -1 }).limit(10).toArray()
```

And the corresponding codes using node driver,

```ts
const db = client.db('atomicNote')
await db.collection<Note>('notes').find({}).sort({ metacritic: -1 }).limit(10).toArray()
```

## Troubleshooting

`Module not found: Can't resolve 'dns'` is we use `mongodb` package in the client side.
