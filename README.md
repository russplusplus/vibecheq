# Vibecheq

This mobile application allows users to send and receive images from other random users. Once an image is sent, the recipient can respond to the sender with their own image. After the exchange, no informatino about either user is stored.

## Stack

This application is written in React Native and follows the Expo Bare Workflow pattern. It also employs a Firebase cloud backend with several microservices.

## Image Processing

Because this application allows anonymity between users, images need to be analyzed and filtered based on their content. This is done using [private-detector-js](https://www.npmjs.com/package/private-detector-js), a TypeScript implementation of Bumble's Private Detector model, created to detect explicit imagery using TensorFlow.

## Screenshots

<img src="https://github.com/russplusplus/vibecheq/assets/35588356/68e393ec-1768-4ee1-9c36-a60a588e4bbf" width="260"/>

<img src="https://github.com/russplusplus/vibecheq/assets/35588356/ad946c54-3d99-4a8f-b23d-d8cb945ce8df" width="260"/>

<img src="https://github.com/russplusplus/vibecheq/assets/35588356/e3cd96af-663e-4a92-874d-73111d42da75" width="260"/>
