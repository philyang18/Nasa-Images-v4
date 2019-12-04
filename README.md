[![Build Status](https://travis-ci.com/ITP-Webdev/final-project-philyang18.svg?token=JjfsCsZxtpzqdFdxKz9k&branch=master)](https://travis-ci.com/ITP-Webdev/final-project-philyang18)

nasa-images.surge.sh

1. NASA has a plethora of photo and video APIs which are frequently updated but is not accessible to people who do not understand how to use an API. Although NASA has a website for its library of photographs, it is not structured or organized in a manner that appeals to me. Thus the goal for this project is to display NASA's photo in a friendly and organized fashion.

2. The primary audience includes (but is not limited to) astronomers, space-lovers, scientists, and students of any age. 

3. In order to meet the project requirements, I plan on using 2 APIs which will each have their own route. The current APIs I plan on using are the Mars Rover and APOD APIs. 

Each image will be a reusable component with a "like" function that allows for the user to create a list of liked photos that will load on a separate page. They can later "unlike" or delete the image from the list. Each of these actions will display a notification on the right-top corner. This page's information will be held using an API and will use all four AJAX calls. 

In addition, users will be able to search for photos taken on certain dates for the Mars Rover API which will require form validation to ensure that the date is formatted correctly or if there no photos for that date.

4. As of now I only plan on using Bootstrap.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
