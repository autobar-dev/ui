# Autobar UI

UI is the main website for Autobar.

## Setup

### Production

To run what has been deployed to production clone the `main` branch and run it as described in the **Running** section.

```
git clone --branch main https://github.com/autobar-dev/ui.git

npm install # INSTALL ALL DEPENDENCIES
npm run build # BUILD APP
```

### Development

All features available on the testing environment and not yet deployed to production are on the `develop` branch.

```
git clone --branch develop https://github.com/autobar-dev/ui.git
```

or, if you have already cloned the repo, simply run `git checkout develop`.

**Important:** before you start the app, remember to install all dependencies:

```
npm install
```

## Running

### Production

On production you will most likely want to run UI in a Docker container:

```
docker run
  -p 4000:80
  -e NEXT_PUBLIC_URL=... -e PORT=80
  ghcr.io/autobar-dev/ui:main -d
```

But you can also run it as is after building:

```
npm start
```

### Development

First make sure your `.env.development` file in the root directory contains the following field:

- **NEXT_PUBLIC_URL** - URL pointing to a running Service instance (e.g. `https://api.autobar.ovh`; note the lack of `/` after the URL)
- **PORT** - port to run the app on (can be omitted; defaults to 4000)
- **NEXT_PUBLIC_BUCKET_URL** - B2 bucket URL 
- **NEXT_PUBLIC_API_URL** - URL Autobar Service is being hosted on

You can find the most up-to-date configuration in the [docs](https://docs.autobar.ovh).

Then, simply run

```
npm run dev
```

Now you should be able to access UI on `http://localhost:PORT`.