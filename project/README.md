# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Environment Variables

This project uses environment variables for configuration. The following files are used:

### `.env`

Default environment variables that will be used if no environment-specific file is found.

### `.env.development`

Environment variables for development mode. These will be used when running `npm start`.

### `.env.production`

Environment variables for production mode. These will be used when running `npm run build`.

### `.env.local`

Local environment variables that override the above files. This file is not committed to version control.
You can create this file based on the `.env.local.example` template.

### Available Environment Variables

- `REACT_APP_API_URL`: The URL of the API server
- `REACT_APP_ENV`: The current environment (development, production)
- `REACT_APP_DEBUG`: Enable debug mode (true/false)

### Using Environment Variables in Code

Environment variables are accessible through the utility module at `src/utils/env.ts`:

```typescript
import { API_URL, ENV, IS_DEV, IS_PROD, DEBUG } from '../utils/env';

// Example usage
fetch(`${API_URL}/endpoint`);

if (IS_DEV) {
  console.log('Debug info');
}
```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
